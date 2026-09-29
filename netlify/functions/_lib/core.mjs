// Shared pieces of the Randolph Construction time clock: storage, time math,
// login security, and the entry store. Used by timeclock.mjs and the scheduled jobs.
import { getStore } from '@netlify/blobs'
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export const store = () => getStore({ name: 'timeclock', consistency: 'strong' })
export const backupStore = () => getStore({ name: 'timeclock-backups', consistency: 'strong' })

export const ok = (b) => new Response(JSON.stringify(b), { headers: { 'Content-Type': 'application/json' } })
export const bad = (msg, code = 400, extra = {}) => new Response(JSON.stringify({ error: msg, ...extra }), { status: code, headers: { 'Content-Type': 'application/json' } })
export const rand = () => randomBytes(6).toString('base64url').replace(/[^a-z0-9]/gi, '').toLowerCase().padEnd(8, '0').slice(0, 8)
export const r2 = (n) => Math.round(n * 100) / 100
export const JOB_STATUSES = ['active', 'future', 'finished']
export const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v || ''))
export const isTime = (v) => /^\d{2}:\d{2}$/.test(String(v || ''))

// ---------- Time ----------
// The business runs on Eastern time, whatever clock the server uses.
export const TZ = 'America/New_York'
export function nyParts(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(d).map((x) => [x.type, x.value]))
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}`, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday) }
}
export const toMins = (t) => { const [h, mi] = String(t).split(':').map(Number); return h * 60 + mi }
export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
export const fmtTime = (t) => {
  if (!isTime(t)) return String(t || '')
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

// Normalize a lunch value to minutes. Legacy entries stored a boolean (true = 30 min).
export function lunchMins(lunch) {
  if (lunch === true) return 30
  if (lunch === false || lunch == null) return 0
  return Math.max(0, Math.round(Number(lunch) || 0))
}
// hours = (out - in) - lunch, clamped >= 0
export function calcHours(clockIn, clockOut, lunch) {
  let mins = toMins(clockOut) - toMins(clockIn)
  if (mins < 0) mins += 24 * 60 // crossed midnight
  mins -= lunchMins(lunch)
  return Math.max(0, Math.round((mins / 60) * 100) / 100)
}
// Workweek key for a YYYY-MM-DD date (UTC-safe). startDay: 0=Sun … 6=Sat.
export function weekStart(dateStr, startDay = 0) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const off = (d.getUTCDay() - startDay + 7) % 7
  d.setUTCDate(d.getUTCDate() - off)
  return d.toISOString().slice(0, 10)
}
// Overtime is 1.5x over 40 hrs in a workweek. Walk one employee's week in
// chronological order so each shift's hours land in regular until 40, then OT.
// Returns { totalHours, regHours, otHours, gross } using each entry's own rate.
export function weekTotals(entries) {
  const sorted = [...entries].sort((a, b) => (a.date + (a.createdAt || '')).localeCompare(b.date + (b.createdAt || '')))
  let cum = 0, reg = 0, ot = 0, gross = 0
  for (const e of sorted) {
    const h = e.hours || 0
    const regPart = Math.min(h, Math.max(0, 40 - cum))
    const otPart = h - regPart
    reg += regPart; ot += otPart
    gross += regPart * e.rate + otPart * e.rate * 1.5
    cum += h
  }
  return { totalHours: r2(reg + ot), regHours: r2(reg), otHours: r2(ot), gross: r2(gross) }
}
// Two shifts on one date overlap when their minute ranges cross. A shift that
// ends before it starts ran past midnight.
export function shiftsOverlap(a, b) {
  const span = (x) => { const s = toMins(x.clockIn); let e = toMins(x.clockOut); if (e <= s) e += 24 * 60; return [s, e] }
  const [s1, e1] = span(a), [s2, e2] = span(b)
  return s1 < e2 && s2 < e1
}

// ---------- Pay rates ----------
// An employee carries a dated list of rates so a raise can start on a chosen day,
// past or future. Older records have only `rate`.
export function rateList(emp) {
  const list = Array.isArray(emp.rates) && emp.rates.length ? emp.rates : [{ rate: Number(emp.rate) || 0, from: '0000-00-00' }]
  return [...list].sort((a, b) => a.from.localeCompare(b.from))
}
export function rateFor(emp, dateStr) {
  const list = rateList(emp)
  let cur = list[0].rate
  for (const x of list) if (x.from <= dateStr) cur = x.rate
  return Number(cur) || 0
}
export function upcomingRate(emp, today) {
  return rateList(emp).find((x) => x.from > today) || null
}

// ---------- Base records ----------
// A read that fails must never look like "nothing saved yet", or the seed below
// would overwrite the real crew list. Errors are thrown; only a true miss is null.
async function readJSON(s, key) {
  let lastErr
  for (let i = 0; i < 3; i++) {
    try { return await s.get(key, { type: 'json' }) } catch (e) { lastErr = e; await new Promise((r) => setTimeout(r, 120 * (i + 1))) }
  }
  throw lastErr
}
export async function loadBase(s) {
  let [employees, jobs, settings] = await Promise.all([readJSON(s, 'employees'), readJSON(s, 'jobs'), readJSON(s, 'settings')])
  if (!employees) { employees = [{ id: rand(), name: 'Sample Crew', rate: 25, pin: '1234', active: true }]; await s.setJSON('employees', employees) }
  if (!jobs) { jobs = [{ id: rand(), customer: 'Sample Customer', workType: 'Driveway', name: 'Sample Customer · Driveway', address: '123 Main St, Wadsworth, OH', status: 'active' }]; await s.setJSON('jobs', jobs) }
  if (!settings) { settings = { adminPin: '1111', weekStartDay: 0, lockedThrough: null }; await s.setJSON('settings', settings) }
  if (!settings.sessionSecret) { settings = { ...settings, sessionSecret: randomBytes(32).toString('hex') }; await s.setJSON('settings', settings) }
  return { employees, jobs, settings }
}

// ---------- Login security ----------
const safeEq = (a, b) => {
  const x = createHash('sha256').update(String(a)).digest(), y = createHash('sha256').update(String(b)).digest()
  return timingSafeEqual(x, y)
}
export const pinMatches = (emp, pin) => safeEq(emp.pin, pin ?? '')
export function hashPass(pass, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(String(pass), salt, 32).toString('hex') }
}
export function adminPassMatches(settings, pass) {
  if (pass == null || pass === '') return false
  if (settings.adminHash) return safeEq(hashPass(pass, settings.adminHash.salt).hash, settings.adminHash.hash)
  return safeEq(settings.adminPin || '', pass)
}
// The owner is nudged to a longer passcode while the old 4-digit PIN is still in use.
export const weakPasscode = (settings) => !settings.adminHash

export function signToken(secret, payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${createHmac('sha256', secret).update(body).digest('base64url')}`
}
export function readToken(secret, token) {
  const [body, sig] = String(token || '').split('.')
  if (!body || !sig) return null
  if (!safeEq(createHmac('sha256', secret).update(body).digest('base64url'), sig)) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    return p && p.exp > Date.now() ? p : null
  } catch { return null }
}
// Changes whenever the PIN does, so a new PIN signs the old phone out.
export const pinTag = (emp, secret) => createHmac('sha256', secret).update(`${emp.id}:${emp.pin}`).digest('base64url').slice(0, 12)

export function clientIp(req, context) {
  return String(context?.ip || req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim()
}

// Wrong-PIN limits. Five misses from one connection locks that connection out of
// that login for 15 minutes. Twenty-five misses from anywhere locks the login for an hour.
const WINDOW = 15 * 60e3, IP_MAX = 5, IP_LOCK = 15 * 60e3, ALL_MAX = 25, ALL_LOCK = 60 * 60e3
const ipKey = (ip) => createHash('sha256').update(String(ip)).digest('hex').slice(0, 16)
const failKey = (scope) => `fail:${scope}`
function prune(rec, now) {
  const live = (x) => x && (x.until > now || now - x.first < WINDOW)
  const ips = Object.fromEntries(Object.entries(rec?.ips || {}).filter(([, x]) => live(x)))
  return { ips, all: live(rec?.all) ? rec.all : null }
}
export async function lockState(s, scope, ip, now = Date.now()) {
  const raw = await s.get(failKey(scope), { type: 'json' }).catch(() => null)
  if (!raw) return { locked: false, hadFails: false }
  const rec = prune(raw, now)
  const until = Math.max(rec.ips[ipKey(ip)]?.until || 0, rec.all?.until || 0)
  return { locked: until > now, until, hadFails: true }
}
export async function recordFail(s, scope, ip, now = Date.now()) {
  const rec = prune(await s.get(failKey(scope), { type: 'json' }).catch(() => null), now)
  const bump = (x, max, lock) => {
    const cur = x && now - x.first < WINDOW ? x : { n: 0, first: now, until: 0 }
    const n = cur.n + 1
    return { n, first: cur.first, until: n >= max ? now + lock : cur.until }
  }
  rec.ips[ipKey(ip)] = bump(rec.ips[ipKey(ip)], IP_MAX, IP_LOCK)
  rec.all = bump(rec.all, ALL_MAX, ALL_LOCK)
  await s.setJSON(failKey(scope), rec)
  const until = Math.max(rec.ips[ipKey(ip)].until, rec.all.until)
  return { locked: until > now, until, left: Math.max(0, IP_MAX - rec.ips[ipKey(ip)].n) }
}
export async function clearFails(s, scope, ip, now = Date.now()) {
  const rec = prune(await s.get(failKey(scope), { type: 'json' }).catch(() => null), now)
  delete rec.ips[ipKey(ip)]
  if (!Object.keys(rec.ips).length && !rec.all) await s.delete(failKey(scope)).catch(() => {})
  else await s.setJSON(failKey(scope), rec)
}
export const lockMsg = (until, now = Date.now()) => {
  const mins = Math.max(1, Math.ceil((until - now) / 60e3))
  return `Too many wrong tries. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`
}

// ---------- Entries ----------
// New shifts are stored under entry:YYYYMMDD-xxxxxxxx so a week or a month can be
// found from the key alone. Shifts saved before this change have short random ids
// and are read in full until the one-time migration renames them.
export const DATED_ID = /^\d{8}-[a-z0-9]{6,}$/
export const entryId = (date) => `${date.replaceAll('-', '')}-${rand()}`
export const entryKey = (id) => `entry:${id}`
const monthOf = (id) => `${id.slice(0, 4)}-${id.slice(4, 6)}`
const cleanTag = (t) => String(t || '').replace(/^W\//, '').replace(/"/g, '')

async function readWithRetry(fn) {
  let lastErr
  for (let i = 0; i < 3; i++) {
    try { return await fn() } catch (e) { lastErr = e; await new Promise((r) => setTimeout(r, 150 * (i + 1))) }
  }
  throw lastErr
}
// Read many keys at once. A shift that cannot be read is an error, never a silent gap in payroll.
export async function readMany(s, keys, limit = 40) {
  const out = new Array(keys.length)
  let i = 0
  const worker = async () => {
    while (i < keys.length) {
      const n = i++
      out[n] = await readWithRetry(() => s.getWithMetadata(keys[n], { type: 'json' }))
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, keys.length) }, worker))
  return out.filter((x) => x && x.data).map((x) => ({ ...x.data, _etag: cleanTag(x.etag) }))
}

const strip = ({ _etag, ...e }) => e
const sortEntries = (list) => list.sort((a, b) => (b.date + (b.createdAt || '')).localeCompare(a.date + (a.createdAt || '')))

// Group the dated shift keys by month, with the etag each one carries right now.
function groupByMonth(blobs) {
  const legacy = [], byMonth = new Map()
  for (const b of blobs) {
    const id = b.key.slice(6)
    if (!DATED_ID.test(id)) { legacy.push(b.key); continue }
    const m = monthOf(id)
    if (!byMonth.has(m)) byMonth.set(m, [])
    byMonth.get(m).push({ key: b.key, etag: cleanTag(b.etag), day: id.slice(0, 8) })
  }
  return { legacy, byMonth }
}
// An archive is trusted only while it lists exactly the shifts that month holds now,
// each with the same etag it had when the archive was built. An edit, a delete, or a
// new shift all break the match, so a stale archive can never hide a change.
const archiveIsFresh = (arc, items) => {
  const tags = arc?.tags
  return !!tags && Object.keys(tags).length === items.length && items.every((x) => x.etag && tags[x.key] === x.etag)
}

// Finished months are packed into one archive blob each (built nightly) so opening
// the owner screen stays quick as the years add up.
export async function listEntries(s, { from, to, useArchives = true } = {}) {
  const f = from ? from.replaceAll('-', '') : null, t = to ? to.replaceAll('-', '') : null
  const { blobs } = await readWithRetry(() => s.list({ prefix: 'entry:' }))
  const { legacy, byMonth } = groupByMonth(blobs)
  const thisMonth = nyParts().date.slice(0, 7)
  const inRange = (x) => (!f || x.day >= f) && (!t || x.day <= t)
  const out = [], loose = [...legacy]
  await Promise.all(Array.from(byMonth.entries()).map(async ([m, items]) => {
    const wanted = items.filter(inRange)
    if (!wanted.length) return
    if (useArchives && m < thisMonth && wanted.length > 3) {
      const arc = await s.get(`archive:${m}`, { type: 'json' }).catch(() => null)
      if (archiveIsFresh(arc, items)) {
        const keys = new Set(wanted.map((x) => x.key))
        out.push(...arc.entries.filter((e) => keys.has(entryKey(e.id))))
        return
      }
    }
    loose.push(...wanted.map((x) => x.key))
  }))
  out.push(...(await readMany(s, loose)).map(strip))
  const ranged = from || to ? out.filter((e) => (!from || e.date >= from) && (!to || e.date <= to)) : out
  // If the migration was interrupted, a shift can exist under both ids. Keep the new one.
  const moved = new Set(ranged.map((e) => e.legacyId).filter(Boolean))
  return sortEntries(ranged.filter((e) => !moved.has(e.id)))
}

// Pack every finished month that has no current archive. Returns the months rebuilt.
export async function buildArchives(s) {
  const { blobs } = await readWithRetry(() => s.list({ prefix: 'entry:' }))
  const { byMonth } = groupByMonth(blobs)
  const thisMonth = nyParts().date.slice(0, 7)
  const rebuilt = []
  for (const [m, items] of byMonth) {
    if (m >= thisMonth || items.length <= 3) continue
    const arc = await s.get(`archive:${m}`, { type: 'json' }).catch(() => null)
    if (archiveIsFresh(arc, items)) continue
    const rows = await readMany(s, items.map((x) => x.key))
    const tags = Object.fromEntries(rows.map((e) => [entryKey(e.id), e._etag]))
    await s.setJSON(`archive:${m}`, { month: m, builtAt: new Date().toISOString(), tags, entries: rows.map(strip) })
    rebuilt.push(m)
  }
  return rebuilt
}

export async function getEntry(s, id) {
  return readWithRetry(() => s.get(entryKey(id), { type: 'json' }))
}
export async function putEntry(s, entry) {
  await s.setJSON(entryKey(entry.id), entry)
  return entry
}
// Keep what a shift looked like before each change. Newest first, capped.
export function withHistory(entry, what, by = 'owner') {
  const { history = [] } = entry
  const before = { date: entry.date, clockIn: entry.clockIn, clockOut: entry.clockOut, lunch: lunchMins(entry.lunch), jobName: entry.jobName, address: entry.address, hours: entry.hours, rate: entry.rate, pay: entry.pay }
  return [{ at: new Date().toISOString(), by, what, before }, ...history].slice(0, 20)
}

// ---------- Backups ----------
export async function takeSnapshot(s, label = 'daily') {
  const base = await loadBase(s)
  const entries = await listEntries(s, { useArchives: false })
  const extra = {}
  for (const prefix of ['open:', 'trash:']) {
    const { blobs } = await s.list({ prefix })
    const rows = await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' }).catch(() => null)))
    extra[prefix.slice(0, -1)] = Object.fromEntries(blobs.map((b, i) => [b.key, rows[i]]))
  }
  const takenAt = new Date().toISOString()
  const counts = { employees: base.employees.length, jobs: base.jobs.length, entries: entries.length }
  const snap = { takenAt, label, counts, ...base, entries, open: extra.open, trash: extra.trash }
  const key = label === 'daily' ? `daily/${nyParts().date}.json` : `${label}/${takenAt.replace(/[:.]/g, '-')}.json`
  const bs = backupStore()
  await bs.setJSON(key, snap)
  await bs.setJSON('latest', { key, takenAt, counts })
  return { key, takenAt, counts }
}
// Keep 35 dailies, plus the first snapshot of every month for good.
export async function pruneSnapshots() {
  const bs = backupStore()
  const { blobs } = await bs.list({ prefix: 'daily/' })
  const keys = blobs.map((b) => b.key).sort()
  const firstOfMonth = new Set(), seen = new Set()
  for (const k of keys) { const m = k.slice(6, 13); if (!seen.has(m)) { seen.add(m); firstOfMonth.add(k) } }
  const drop = keys.slice(0, Math.max(0, keys.length - 35)).filter((k) => !firstOfMonth.has(k))
  await Promise.all(drop.map((k) => bs.delete(k).catch(() => {})))
  return { kept: keys.length - drop.length, dropped: drop.length }
}
export async function listSnapshots() {
  const bs = backupStore()
  const { blobs } = await bs.list()
  const latest = await bs.get('latest', { type: 'json' }).catch(() => null)
  return { latest, keys: blobs.map((b) => b.key).filter((k) => k !== 'latest').sort().reverse() }
}
