// Email (Resend) and text (Twilio) delivery for the time clock, plus the weekly
// payroll summary. Both senders stay quiet until their env vars are set on the
// site, and they report that plainly so the owner screen can say what is connected.
import { addDays, fmtTime, lunchMins, r2, weekTotals } from './core.mjs'

export const emailReady = () => !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
export const smsReady = () => {
  const e = process.env
  return !!(e.TWILIO_ACCOUNT_SID && e.TWILIO_FROM_NUMBER && ((e.TWILIO_API_KEY_SID && e.TWILIO_API_KEY_SECRET) || e.TWILIO_AUTH_TOKEN))
}

export function e164(digits) {
  const d = String(digits || '').replace(/\D/g, '')
  if (d.length === 10) return `+1${d}`
  if (d.length === 11 && d.startsWith('1')) return `+${d}`
  return null
}

export async function sendEmail({ to, subject, text, html, attachments }) {
  if (!emailReady()) return { ok: false, skipped: true, error: 'email_not_configured' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to, subject, text, html, attachments, reply_to: process.env.RESEND_REPLY_TO || undefined }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[timeclock] email failed', res.status, detail.slice(0, 300))
      return { ok: false, status: res.status }
    }
    return { ok: true }
  } catch (err) {
    console.error('[timeclock] email threw', err)
    return { ok: false, error: String(err) }
  }
}

export async function sendSms({ to, body }) {
  if (!smsReady()) return { ok: false, skipped: true, error: 'sms_not_configured' }
  const toNumber = e164(to)
  if (!toNumber) return { ok: false, skipped: true, error: 'invalid_phone' }
  const e = process.env
  const user = e.TWILIO_API_KEY_SID && e.TWILIO_API_KEY_SECRET ? e.TWILIO_API_KEY_SID : e.TWILIO_ACCOUNT_SID
  const pass = e.TWILIO_API_KEY_SID && e.TWILIO_API_KEY_SECRET ? e.TWILIO_API_KEY_SECRET : e.TWILIO_AUTH_TOKEN
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${e.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: { authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`, 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: toNumber, From: e.TWILIO_FROM_NUMBER, Body: body }).toString(),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[timeclock] text failed', res.status, detail.slice(0, 300))
      return { ok: false, status: res.status }
    }
    return { ok: true }
  } catch (err) {
    console.error('[timeclock] text threw', err)
    return { ok: false, error: String(err) }
  }
}

// ---------- Weekly payroll summary ----------
const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const money = (n) => `$${(Number(n) || 0).toFixed(2)}`
const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

// One row per crew member for the workweek that starts on `weekOf`.
export function weekPayroll(entries, employees, weekOf) {
  const end = addDays(weekOf, 6)
  const nameById = new Map(employees.map((e) => [e.id, e.name]))
  const mine = entries.filter((e) => e.date >= weekOf && e.date <= end).map((e) => ({ ...e, employeeName: nameById.get(e.employeeId) || e.employeeName }))
  const groups = new Map()
  for (const e of mine) {
    const key = e.employeeId || e.employeeName
    if (!groups.has(key)) groups.set(key, { name: e.employeeName, shifts: [] })
    groups.get(key).shifts.push(e)
  }
  const rows = Array.from(groups.values()).map((g) => ({ name: g.name, shifts: g.shifts.length, ...weekTotals(g.shifts) })).sort((a, b) => a.name.localeCompare(b.name))
  const total = rows.reduce((t, r) => ({ hours: r2(t.hours + r.totalHours), ot: r2(t.ot + r.otHours), gross: r2(t.gross + r.gross) }), { hours: 0, ot: 0, gross: 0 })
  return { weekOf, end, rows, total, shifts: mine }
}

export function payrollEmail({ payroll, siteUrl }) {
  const { weekOf, end, rows, total, shifts } = payroll
  const subject = `Payroll for the week of ${longDate(weekOf)}: ${money(total.gross)}`
  const lines = rows.map((r) => `${r.name}: ${r.regHours} regular${r.otHours ? `, ${r.otHours} overtime` : ''}, ${money(r.gross)}`)
  const text = [
    `Randolph Construction payroll, ${longDate(weekOf)} through ${longDate(end)}.`,
    '',
    rows.length ? lines.join('\n') : 'No hours were logged this week.',
    '',
    `Total: ${total.hours} hours, ${money(total.gross)} gross before taxes.`,
    '',
    `Every shift for the week is in the attached spreadsheet. Open the time clock: ${siteUrl}/admin`,
  ].join('\n')
  const cell = 'padding:10px 12px;border-bottom:1px solid #e3e0dd;font-size:14px;'
  const head = `${cell}font-size:12px;color:#5c5856;`
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f2f0;">
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1c1b1b;">
    <div style="background:#131313;padding:24px;"><div style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Randolph Construction</div><div style="color:#ffb3ac;font-size:13px;margin-top:4px;">Weekly payroll</div></div>
    <div style="background:#ffffff;padding:24px;">
      <p style="margin:0 0 4px;font-size:15px;">${esc(longDate(weekOf))} through ${esc(longDate(end))}</p>
      <p style="margin:0 0 20px;font-size:26px;font-weight:bold;">${esc(money(total.gross))} <span style="font-size:14px;font-weight:normal;color:#5c5856;">gross, before taxes</span></p>
      ${rows.length ? `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
        <tr><th align="left" style="${head}">Crew</th><th align="right" style="${head}">Regular</th><th align="right" style="${head}">Overtime</th><th align="right" style="${head}">Gross</th></tr>
        ${rows.map((r) => `<tr><td style="${cell}">${esc(r.name)}</td><td align="right" style="${cell}">${r.regHours}</td><td align="right" style="${cell}">${r.otHours || 0}</td><td align="right" style="${cell}font-weight:bold;">${esc(money(r.gross))}</td></tr>`).join('')}
        <tr><td style="${cell}font-weight:bold;">Total</td><td align="right" style="${cell}" colspan="2">${total.hours} hours</td><td align="right" style="${cell}font-weight:bold;">${esc(money(total.gross))}</td></tr>
      </table>` : '<p style="font-size:15px;">No hours were logged this week.</p>'}
      <p style="margin:24px 0 0;font-size:14px;">Every shift for the week is in the attached spreadsheet.</p>
      <p style="margin:16px 0 0;"><a href="${esc(siteUrl)}/admin" style="display:inline-block;background:#d32f2f;color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 20px;">Open the time clock</a></p>
    </div>
  </div></body></html>`
  const columns = ['Date', 'Employee', 'Job', 'Address', 'Clock In', 'Clock Out', 'Lunch (min)', 'Hours', 'Rate', 'Pay']
  const body = [columns, ...[...shifts].sort((a, b) => (a.employeeName + a.date).localeCompare(b.employeeName + b.date)).map((e) => [e.date, e.employeeName, e.jobName, e.address, fmtTime(e.clockIn), fmtTime(e.clockOut), lunchMins(e.lunch), e.hours, e.rate, e.pay])]
    .map((row) => row.map(csvCell).join(',')).join('\n')
  const attachments = [{ filename: `randolph-shifts-${weekOf}.csv`, content: Buffer.from(body).toString('base64') }]
  return { subject, text, html, attachments }
}
