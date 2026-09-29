// Nightly housekeeping for the time clock, 3:00 AM Eastern (2:00 AM in winter).
// Saves a full copy of every record, packs finished months so the owner screen
// stays quick, and clears out deleted shifts older than 90 days.
import { store, takeSnapshot, pruneSnapshots, buildArchives } from './_lib/core.mjs'

export const config = { schedule: '0 7 * * *' }

export default async () => {
  const s = store()
  try {
    const snap = await takeSnapshot(s, 'daily')
    const kept = await pruneSnapshots()
    const packed = await buildArchives(s)

    const cutoff = Date.now() - 90 * 24 * 3600e3
    const { blobs } = await s.list({ prefix: 'trash:' })
    let purged = 0
    for (const b of blobs) {
      const row = await s.get(b.key, { type: 'json' }).catch(() => null)
      if (row && Date.parse(row.deletedAt) < cutoff) { await s.delete(b.key); purged++ }
    }
    console.log('[timeclock-backup] done', JSON.stringify({ ...snap.counts, kept: kept.kept, packed, purged }))
  } catch (e) {
    console.error('[timeclock-backup] failed', e)
  }
  return new Response('ok')
}
