// Weekly payroll summary to the owner. Runs every morning at 7:00 AM Eastern
// (6:00 AM in winter) and sends only on the day picked under Settings.
// Off until the owner turns it on, and quiet until email is connected to the site.
import { store, loadBase, listEntries, nyParts, weekStart, addDays } from './_lib/core.mjs'
import { emailReady, sendEmail, weekPayroll, payrollEmail } from './_lib/notify.mjs'

export const config = { schedule: '0 11 * * *' }

export default async () => {
  try {
    const s = store()
    const { employees, settings } = await loadBase(s)
    const cfg = { on: false, to: '', day: 1, ...(settings.payrollEmail || {}) }
    const now = nyParts()
    if (!cfg.on || !cfg.to || now.dow !== Number(cfg.day) || !emailReady()) return new Response('skip')

    // The last workweek that has fully ended.
    const weekOf = addDays(weekStart(now.date, Number(settings.weekStartDay) || 0), -7)
    const marker = `sent:payroll:${weekOf}`
    if (await s.get(marker, { type: 'json' }).catch(() => null)) return new Response('already sent')

    const entries = await listEntries(s, { from: weekOf, to: addDays(weekOf, 6) })
    const mail = payrollEmail({ payroll: weekPayroll(entries, employees, weekOf), siteUrl: (process.env.URL || 'https://randolph.construction').replace(/\/$/, '') })
    const sent = await sendEmail({ to: cfg.to, ...mail })
    if (sent.ok) await s.setJSON(marker, { at: new Date().toISOString(), to: cfg.to })
    console.log('[timeclock-payroll-email]', weekOf, sent.ok ? 'sent' : 'failed')
  } catch (e) {
    console.error('[timeclock-payroll-email] failed', e)
  }
  return new Response('ok')
}
