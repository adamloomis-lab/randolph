// Operator tool for the time clock's stored records. Run from the project root:
//   node scripts/timeclock-admin.mjs backup     save every record to ~/Documents/randolph-timeclock-backups
//   node scripts/timeclock-admin.mjs check      read-only report on keys and storage behavior
//   node scripts/timeclock-admin.mjs migrate    dry run of the key and job-id migration
//   node scripts/timeclock-admin.mjs migrate --apply
//   node scripts/timeclock-admin.mjs nightly    run the nightly backup and month packing right now
// Uses the Netlify CLI login already on this machine. Prints counts only, never PINs or rates.
import { getStore } from '@netlify/blobs'
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

const siteID = JSON.parse(readFileSync(new URL('../.netlify/state.json', import.meta.url), 'utf8')).siteId
const cfg = JSON.parse(readFileSync(join(homedir(), 'Library/Preferences/netlify/config.json'), 'utf8'))
const token = process.env.NETLIFY_AUTH_TOKEN || cfg.users?.[cfg.userId]?.auth?.token
if (!token) { console.error('No Netlify login found. Run `netlify login` first.'); process.exit(1) }
const s = getStore({ name: 'timeclock', siteID, token, consistency: 'strong' })

const DATED = /^\d{8}-[a-z0-9]{6,}$/
const rand = () => randomBytes(6).toString('base64url').replace(/[^a-z0-9]/gi, '').toLowerCase().padEnd(8, '0').slice(0, 8)
const r2 = (n) => Math.round(n * 100) / 100
async function readAll(keys, limit = 30) {
  const out = new Array(keys.length); let i = 0
  await Promise.all(Array.from({ length: Math.min(limit, keys.length) }, async () => {
    while (i < keys.length) { const n = i++; out[n] = await s.get(keys[n], { type: 'json' }) }
  }))
  return out
}
const sums = (rows) => ({ shifts: rows.length, hours: r2(rows.reduce((t, e) => t + (e.hours || 0), 0)), pay: r2(rows.reduce((t, e) => t + (e.pay || 0), 0)) })

const cmd = process.argv[2]
const apply = process.argv.includes('--apply')
const { blobs } = await s.list()
const keys = blobs.map((b) => b.key)
const entryKeys = keys.filter((k) => k.startsWith('entry:'))

if (cmd === 'backup') {
  const t0 = Date.now()
  const values = await readAll(keys)
  const dir = join(homedir(), 'Documents/randolph-timeclock-backups')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `timeclock-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify({ takenAt: new Date().toISOString(), siteID, records: Object.fromEntries(keys.map((k, i) => [k, values[i]])) }, null, 1))
  chmodSync(file, 0o600)
  const entries = values.filter((_, i) => keys[i].startsWith('entry:'))
  console.log(JSON.stringify({ saved: file, keys: keys.length, ...sums(entries), seconds: r2((Date.now() - t0) / 1000) }))
} else if (cmd === 'check') {
  const legacy = entryKeys.filter((k) => !DATED.test(k.slice(6)))
  const sample = entryKeys[0]
  const meta = sample ? await s.getWithMetadata(sample, { type: 'json' }) : null
  const listed = blobs.find((b) => b.key === sample)
  const clean = (t) => String(t || '').replace(/^W\//, '').replace(/"/g, '')
  const t0 = Date.now(); for (const k of entryKeys.slice(0, 20)) await s.get(k, { type: 'json' }); const seq = (Date.now() - t0) / 20
  const t1 = Date.now(); await readAll(entryKeys); const par = Date.now() - t1
  console.log(JSON.stringify({
    keys: keys.length, entries: entryKeys.length, legacyIds: legacy.length, datedIds: entryKeys.length - legacy.length,
    otherPrefixes: [...new Set(keys.filter((k) => !k.startsWith('entry:')).map((k) => k.split(':')[0]))],
    listGivesEtag: !!listed?.etag, getGivesEtag: !!meta?.etag, etagsMatch: !!meta && clean(listed?.etag) === clean(meta.etag), getGivesData: !!meta?.data,
    msPerReadOneAtATime: Math.round(seq), estimateOldLoadSeconds: r2((seq * entryKeys.length) / 1000), newLoadSeconds: r2(par / 1000),
  }))
} else if (cmd === 'migrate') {
  const jobs = (await s.get('jobs', { type: 'json' })) || []
  const settings = (await s.get('settings', { type: 'json' })) || {}
  const rows = await readAll(entryKeys)
  const before = sums(rows.filter(Boolean))
  let rekey = 0, linked = 0, unmatched = new Map(), skipped = 0
  const plan = []
  rows.forEach((e, i) => {
    if (!e) { skipped++; return }
    const next = { ...e }
    let changed = false
    if (!e.jobId && e.jobName) {
      const hits = jobs.filter((j) => j.name === e.jobName)
      if (hits.length === 1) { next.jobId = hits[0].id; linked++; changed = true }
      else unmatched.set(e.jobName, (unmatched.get(e.jobName) || 0) + 1)
    }
    const oldKey = entryKeys[i]
    if (!DATED.test(e.id) && /^\d{4}-\d{2}-\d{2}$/.test(e.date)) { next.id = `${e.date.replaceAll('-', '')}-${rand()}`; next.legacyId = e.id; rekey++; changed = true }
    if (changed) plan.push({ oldKey, newKey: `entry:${next.id}`, next })
  })
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'dry run', before, toRename: rekey, toLinkToJob: linked, namesMatchingNoJob: unmatched.size, shiftsUnderThoseNames: [...unmatched.values()].reduce((a, b) => a + b, 0), unreadable: skipped }))
  if (apply) {
    let i = 0
    await Promise.all(Array.from({ length: 10 }, async () => {
      while (i < plan.length) {
        const p = plan[i++]
        await s.setJSON(p.newKey, p.next)
        const back = await s.get(p.newKey, { type: 'json' })
        if (!back || back.hours !== p.next.hours || back.pay !== p.next.pay) throw new Error(`verify failed for ${p.newKey}`)
        if (p.oldKey !== p.newKey) await s.delete(p.oldKey)
      }
    }))
    const after = await s.list({ prefix: 'entry:' })
    const afterRows = await readAll(after.blobs.map((b) => b.key))
    const a = sums(afterRows.filter(Boolean))
    const same = a.shifts === before.shifts && a.hours === before.hours && a.pay === before.pay
    console.log(JSON.stringify({ after: a, totalsUnchanged: same, legacyIdsLeft: after.blobs.filter((b) => !DATED.test(b.key.slice(6))).length, withJobId: afterRows.filter((e) => e?.jobId).length }))
    if (!same) process.exit(2)
  }
} else if (cmd === 'nightly') {
  // Same code the 3:00 AM job runs, pointed at the live store from this machine.
  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ siteID, token })).toString('base64')
  const core = await import('../netlify/functions/_lib/core.mjs')
  const live = core.store()
  const snap = await core.takeSnapshot(live, 'daily')
  const kept = await core.pruneSnapshots()
  const packed = await core.buildArchives(live)
  const t0 = Date.now(); const rows = await core.listEntries(live); const ms = Date.now() - t0
  console.log(JSON.stringify({ backup: snap.key, ...snap.counts, snapshotsKept: kept.kept, monthsPacked: packed, loadAllShifts: { shifts: rows.length, hours: r2(rows.reduce((t, e) => t + e.hours, 0)), pay: r2(rows.reduce((t, e) => t + e.pay, 0)), seconds: r2(ms / 1000) } }))
} else {
  console.log('usage: node scripts/timeclock-admin.mjs backup | check | migrate [--apply] | nightly')
}
