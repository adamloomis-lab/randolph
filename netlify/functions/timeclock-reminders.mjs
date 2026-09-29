// Clock-out reminder texts. Checks every half hour from early afternoon to
// midnight Eastern. Anyone still on the clock past the limit set under Settings
// gets one text with their clock-out link. Off until the owner turns it on, and
// quiet until a texting number is connected to the site.
import { store, loadBase, nyParts, toMins, fmtTime } from './_lib/core.mjs'
import { smsReady, sendSms } from './_lib/notify.mjs'

export const config = { schedule: '*/30 0-4,17-23 * * *' }

// Minutes since the clock-in. Uses the server stamp when there is one.
function minutesOn(open, now) {
  if (open.at) return (Date.now() - Date.parse(open.at)) / 60e3
  const days = Math.round((Date.parse(`${now.date}T00:00:00Z`) - Date.parse(`${open.date}T00:00:00Z`)) / 86400e3)
  return days * 1440 + toMins(now.time) - toMins(open.clockIn)
}

export default async () => {
  try {
    const s = store()
    const { employees, settings } = await loadBase(s)
    const cfg = { on: false, afterHours: 10, ...(settings.reminders || {}) }
    if (!cfg.on || !smsReady()) return new Response('skip')

    const now = nyParts()
    const site = (process.env.URL || 'https://randolph.construction').replace(/\/$/, '')
    const { blobs } = await s.list({ prefix: 'open:' })
    let sent = 0
    for (const b of blobs) {
      const open = await s.get(b.key, { type: 'json' }).catch(() => null)
      const emp = employees.find((e) => e.id === b.key.slice(5))
      if (!open || !emp || emp.active === false || !emp.phone) continue
      if (minutesOn(open, now) < cfg.afterHours * 60) continue
      // The mark lives under its own key. Writing to the open punch here could bring
      // back a punch the crew member closed a moment ago.
      const punch = `${open.date} ${open.clockIn}`
      const mark = await s.get(`reminded:${emp.id}`, { type: 'json' }).catch(() => null)
      if (mark && mark.punch === punch) continue
      const res = await sendSms({
        to: emp.phone,
        body: `Randolph Construction: you clocked in at ${fmtTime(open.clockIn)} and are still on the clock. Clock out here: ${site}/employee?u=${emp.id} Reply STOP to opt out.`,
      })
      // Mark it either way so one bad number does not retry every half hour.
      await s.setJSON(`reminded:${emp.id}`, { punch, at: new Date().toISOString(), sent: res.ok === true })
      if (res.ok) sent++
    }
    console.log('[timeclock-reminders] sent', sent)
  } catch (e) {
    console.error('[timeclock-reminders] failed', e)
  }
  return new Response('ok')
}
