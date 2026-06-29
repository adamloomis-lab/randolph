// Randolph Construction crew time clock. Secure backend (Netlify Blobs).
// Employees log shifts (name + 4-digit PIN); admin (PIN) manages crew/jobs and sees reports.
// PINs and rates never go to the public; only names/jobs are exposed for the picker.
import { getStore } from '@netlify/blobs'

const store = () => getStore({ name: 'timeclock', consistency: 'strong' })
const ok = (b) => new Response(JSON.stringify(b), { headers: { 'Content-Type': 'application/json' } })
const bad = (msg, code = 400) => new Response(JSON.stringify({ error: msg }), { status: code, headers: { 'Content-Type': 'application/json' } })
const id = () => Math.random().toString(36).slice(2, 10)

async function getJSON(s, key, dflt) {
  const v = await s.get(key, { type: 'json' }).catch(() => null)
  return v ?? dflt
}

async function seedIfEmpty(s) {
  let employees = await getJSON(s, 'employees', null)
  let jobs = await getJSON(s, 'jobs', null)
  let settings = await getJSON(s, 'settings', null)
  if (!employees) { employees = [{ id: id(), name: 'Sample Crew', rate: 25, pin: '1234', active: true }]; await s.setJSON('employees', employees) }
  if (!jobs) { jobs = [{ id: id(), customer: 'Sample Customer', workType: 'Driveway', name: 'Sample Customer · Driveway', address: '123 Main St, Wadsworth, OH' }]; await s.setJSON('jobs', jobs) }
  if (!settings) { settings = { adminPin: '1111', weekStartDay: 0, lockedThrough: null }; await s.setJSON('settings', settings) }
  return { employees, jobs, settings }
}

async function listEntries(s) {
  const out = []
  const { blobs } = await s.list({ prefix: 'entry:' })
  for (const b of blobs) {
    const e = await s.get(b.key, { type: 'json' }).catch(() => null)
    if (e) out.push(e)
  }
  out.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt))
  return out
}

// Normalize a lunch value to minutes. Legacy entries stored a boolean (true = 30 min).
function lunchMins(lunch) {
  if (lunch === true) return 30
  if (lunch === false || lunch == null) return 0
  return Math.max(0, Math.round(Number(lunch) || 0))
}
// hours = (out - in) - lunch, clamped >= 0
function calcHours(clockIn, clockOut, lunch) {
  const m = (t) => { const [h, mi] = String(t).split(':').map(Number); return h * 60 + mi }
  let mins = m(clockOut) - m(clockIn)
  if (mins < 0) mins += 24 * 60 // crossed midnight
  mins -= lunchMins(lunch)
  return Math.max(0, Math.round((mins / 60) * 100) / 100)
}

// Workweek key for a YYYY-MM-DD date (UTC-safe). startDay: 0=Sun … 6=Sat.
function weekStart(dateStr, startDay = 0) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const off = (d.getUTCDay() - startDay + 7) % 7
  d.setUTCDate(d.getUTCDate() - off)
  return d.toISOString().slice(0, 10)
}

// Overtime is 1.5x over 40 hrs in a workweek. Walk one employee's week in
// chronological order so each shift's hours land in regular until 40, then OT.
// Returns { totalHours, regHours, otHours, gross } using each entry's own rate.
function weekTotals(entries) {
  const sorted = [...entries].sort((a, b) => (a.date + a.createdAt).localeCompare(b.date + b.createdAt))
  let cum = 0, reg = 0, ot = 0, gross = 0
  for (const e of sorted) {
    const h = e.hours || 0
    const regPart = Math.min(h, Math.max(0, 40 - cum))
    const otPart = h - regPart
    reg += regPart; ot += otPart
    gross += regPart * e.rate + otPart * e.rate * 1.5
    cum += h
  }
  const r2 = (n) => Math.round(n * 100) / 100
  return { totalHours: r2(reg + ot), regHours: r2(reg), otHours: r2(ot), gross: r2(gross) }
}

export default async (req) => {
  if (req.method !== 'POST') return bad('POST only', 405)
  let body
  try { body = await req.json() } catch { return bad('bad request') }
  const s = store()
  const { employees, jobs, settings } = await seedIfEmpty(s)
  const a = body.action
  const isAdmin = () => body.adminPin && body.adminPin === settings.adminPin

  // ---- Public / employee ----
  if (a === 'config') {
    return ok({ employees: employees.filter((e) => e.active !== false).map((e) => ({ id: e.id, name: e.name })), jobs })
  }
  if (['employee-login', 'submit', 'my-week', 'punch-status', 'punch-in', 'punch-cancel'].includes(a)) {
    const emp = employees.find((e) => e.id === body.employeeId)
    if (!emp || emp.pin !== String(body.pin)) return bad('Wrong name or PIN.', 401)
    if (a === 'employee-login') return ok({ ok: true, employee: { id: emp.id, name: emp.name, rate: emp.rate } })

    const wsd = Number(settings.weekStartDay) || 0
    if (a === 'my-week') {
      const wk = weekStart(body.date || new Date().toISOString().slice(0, 10), wsd)
      const mine = (await listEntries(s)).filter((e) => e.employeeId === emp.id && weekStart(e.date, wsd) === wk)
      return ok({ ok: true, weekStart: wk, week: weekTotals(mine) })
    }

    // ---- Live punch: an open clock-in kept until the shift is submitted ----
    if (a === 'punch-status') {
      const open = await s.get(`open:${emp.id}`, { type: 'json' }).catch(() => null)
      return ok({ ok: true, open: open || null })
    }
    if (a === 'punch-in') {
      if (!body.time || !body.date) return bad('Missing time.')
      const open = { date: body.date, clockIn: body.time }
      await s.setJSON(`open:${emp.id}`, open)
      return ok({ ok: true, open })
    }
    if (a === 'punch-cancel') { await s.delete(`open:${emp.id}`).catch(() => {}); return ok({ ok: true }) }

    // submit
    const { date, clockIn, clockOut, lunch, jobName, address } = body
    if (!date || !clockIn || !clockOut) return bad('Missing clock times.')
    if (settings.lockedThrough && date <= settings.lockedThrough) return bad('That pay period is locked. Check with the office.')
    const lm = lunchMins(lunch)
    const hours = calcHours(clockIn, clockOut, lm)
    const pay = Math.round(hours * emp.rate * 100) / 100
    const entry = {
      id: id(), employeeId: emp.id, employeeName: emp.name, date, clockIn, clockOut,
      lunch: lm, jobName: jobName || '', address: address || '', hours, rate: emp.rate, pay,
      createdAt: new Date().toISOString(),
    }
    await s.setJSON(`entry:${entry.id}`, entry)
    await s.delete(`open:${emp.id}`).catch(() => {})
    const wk = weekStart(date, wsd)
    const mine = (await listEntries(s)).filter((e) => e.employeeId === emp.id && weekStart(e.date, wsd) === wk)
    return ok({ ok: true, entry, weekStart: wk, week: weekTotals(mine) })
  }

  // ---- Admin (PIN required) ----
  if (a?.startsWith('admin') || ['save-employee', 'delete-employee', 'save-job', 'delete-job', 'delete-entry', 'update-entry', 'set-admin-pin', 'set-week-start', 'set-lock'].includes(a)) {
    if (!isAdmin()) return bad('Wrong admin PIN.', 401)
  }
  if (a === 'admin-bootstrap') return ok({ employees, jobs, weekStartDay: Number(settings.weekStartDay) || 0, lockedThrough: settings.lockedThrough || null, hasPin: true })
  if (a === 'set-week-start') {
    const wd = Number(body.weekStartDay)
    if (!(wd >= 0 && wd <= 6)) return bad('Pick a valid day.')
    await s.setJSON('settings', { ...settings, weekStartDay: wd })
    return ok({ ok: true })
  }
  if (a === 'set-lock') {
    const lt = body.lockedThrough ? String(body.lockedThrough) : null
    if (lt && !/^\d{4}-\d{2}-\d{2}$/.test(lt)) return bad('Bad date.')
    await s.setJSON('settings', { ...settings, lockedThrough: lt })
    return ok({ ok: true })
  }
  if (a === 'admin-entries') return ok({ entries: await listEntries(s) })
  if (a === 'save-employee') {
    const e = body.employee || {}
    if (!e.name || !/^\d{4}$/.test(String(e.pin || ''))) return bad('Name and a 4-digit PIN are required.')
    const rec = { id: e.id || id(), name: e.name.trim(), rate: Number(e.rate) || 0, pin: String(e.pin), active: e.active !== false }
    const list = employees.filter((x) => x.id !== rec.id); list.push(rec)
    await s.setJSON('employees', list)
    return ok({ ok: true, employees: list })
  }
  if (a === 'delete-employee') {
    await s.setJSON('employees', employees.filter((x) => x.id !== body.id))
    return ok({ ok: true })
  }
  if (a === 'save-job') {
    const j = body.job || {}
    const customer = (j.customer || '').trim()
    const workType = (j.workType || '').trim()
    // Display label used in the crew dropdown, entries, and reports.
    const name = [customer, workType].filter(Boolean).join(' · ') || (j.name || '').trim()
    if (!name) return bad('Add a customer (and the type of work).')
    const rec = { id: j.id || id(), customer, workType, name, address: (j.address || '').trim() }
    const list = jobs.filter((x) => x.id !== rec.id); list.push(rec)
    await s.setJSON('jobs', list)
    return ok({ ok: true, jobs: list })
  }
  if (a === 'delete-job') {
    await s.setJSON('jobs', jobs.filter((x) => x.id !== body.id))
    return ok({ ok: true })
  }
  if (a === 'delete-entry') {
    const cur = await s.get(`entry:${body.id}`, { type: 'json' }).catch(() => null)
    if (cur && settings.lockedThrough && cur.date <= settings.lockedThrough) return bad('That entry is in a locked pay period.')
    await s.delete(`entry:${body.id}`); return ok({ ok: true })
  }
  if (a === 'update-entry') {
    const cur = await s.get(`entry:${body.id}`, { type: 'json' }).catch(() => null)
    if (!cur) return bad('Entry not found.', 404)
    const date = body.date || cur.date
    if (settings.lockedThrough && (cur.date <= settings.lockedThrough || date <= settings.lockedThrough)) return bad('That entry is in a locked pay period.')
    const clockIn = body.clockIn || cur.clockIn
    const clockOut = body.clockOut || cur.clockOut
    const lunch = body.lunch !== undefined ? lunchMins(body.lunch) : lunchMins(cur.lunch)
    const hours = calcHours(clockIn, clockOut, lunch)
    const updated = {
      ...cur, date, clockIn, clockOut, lunch,
      jobName: body.jobName ?? cur.jobName, address: body.address ?? cur.address,
      hours, pay: Math.round(hours * cur.rate * 100) / 100,
    }
    await s.setJSON(`entry:${body.id}`, updated)
    return ok({ ok: true, entry: updated })
  }
  if (a === 'set-admin-pin') {
    if (!/^\d{4}$/.test(String(body.newPin || ''))) return bad('PIN must be 4 digits.')
    await s.setJSON('settings', { ...settings, adminPin: String(body.newPin) })
    return ok({ ok: true })
  }
  return bad('Unknown action.')
}
