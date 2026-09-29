// Randolph Construction crew time clock. Secure backend (Netlify Blobs).
// Crew log shifts (name + 4-digit PIN); the owner (passcode) manages crew/jobs and sees reports.
// PINs and rates never go to the public; only names/jobs are exposed for the picker.
import {
  store, ok, bad, rand, r2, JOB_STATUSES, isDate, isTime, nyParts, addDays, fmtTime, lunchMins, calcHours, weekStart, weekTotals, shiftsOverlap,
  rateList, rateFor, upcomingRate, loadBase, pinMatches, hashPass, adminPassMatches, weakPasscode, signToken, readToken, pinTag, clientIp,
  lockState, recordFail, clearFails, lockMsg, entryId, entryKey, listEntries, getEntry, putEntry, withHistory, takeSnapshot, listSnapshots, backupStore,
} from './_lib/core.mjs'
import { emailReady, smsReady, e164, sendEmail, weekPayroll, payrollEmail } from './_lib/notify.mjs'

const ADMIN_TTL = 7 * 24 * 3600e3
const CREW_TTL = 12 * 3600e3
const CREW_ACTIONS = ['employee-login', 'submit', 'my-week', 'punch-status', 'punch-in', 'punch-cancel']
const ADMIN_ACTIONS = [
  'admin-bootstrap', 'admin-entries', 'admin-trash', 'save-employee', 'set-employee-active', 'delete-employee', 'save-job', 'delete-job', 'link-job-name',
  'delete-entry', 'restore-entry', 'update-entry', 'set-admin-pin', 'set-admin-passcode', 'set-week-start', 'set-lock', 'save-settings',
  'backup-now', 'backup-download', 'send-payroll-email',
]

const DEFAULT_EMAIL = { on: false, to: '', day: 1 }
const DEFAULT_REMINDERS = { on: false, afterHours: 10 }
// Names as they appear in the owner's QuickBooks lists. Blank until he fills them in.
const QB_FIELDS = ['serviceItem', 'payrollItem', 'otPayrollItem', 'companyName', 'companyCreateTime']
const cleanQb = (q = {}) => Object.fromEntries(QB_FIELDS.map((k) => [k, String(q[k] ?? '').replace(/[\t\r\n]+/g, ' ').trim().slice(0, 100)]))
const ownerSettings = (settings) => ({
  quickbooks: cleanQb(settings.quickbooks),
  weekStartDay: Number(settings.weekStartDay) || 0,
  lockedThrough: settings.lockedThrough || null,
  locationStamp: settings.locationStamp === true,
  payrollEmail: { ...DEFAULT_EMAIL, ...(settings.payrollEmail || {}) },
  reminders: { ...DEFAULT_REMINDERS, ...(settings.reminders || {}) },
})
// What the owner sees for each crew member. `rate` is today's rate.
const ownerEmployee = (e, today) => ({
  id: e.id, name: e.name, pin: e.pin, active: e.active !== false, phone: e.phone || '',
  rate: rateFor(e, today), nextRate: upcomingRate(e, today), rates: rateList(e).filter((x) => x.from !== '0000-00-00'),
})
const siteUrl = () => (process.env.URL || 'https://randolph.construction').replace(/\/$/, '')

function cleanLoc(loc) {
  if (!loc || typeof loc !== 'object') return null
  const lat = Number(loc.lat), lng = Number(loc.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat: Math.round(lat * 1e5) / 1e5, lng: Math.round(lng * 1e5) / 1e5, acc: Math.max(0, Math.round(Number(loc.acc) || 0)), at: new Date().toISOString() }
}
const LOC_NOTES = ['denied', 'unavailable', 'timeout']
const cleanLocNote = (n) => (LOC_NOTES.includes(n) ? n : 'unavailable')

export default async (req, context) => {
  if (req.method !== 'POST') return bad('POST only', 405)
  let body
  try { body = await req.json() } catch { return bad('bad request') }
  const s = store()
  let base
  try { base = await loadBase(s) } catch (e) {
    console.error('[timeclock] could not load records', e)
    return bad('The time clock could not reach its records. Try again in a minute.', 503)
  }
  try { return await handle(s, body, base, clientIp(req, context)) } catch (e) {
    console.error('[timeclock] failed', body?.action, e)
    return bad('That did not save. Try again in a minute.', 500)
  }
}

async function handle(s, body, base, ip) {
  const { jobs } = base
  let { employees, settings } = base
  const a = String(body.action || '')
  const today = nyParts().date
  const wsd = Number(settings.weekStartDay) || 0
  const locked = (date) => !!settings.lockedThrough && date <= settings.lockedThrough

  // ---- Public ----
  if (a === 'config') {
    // Crew only see ACTIVE jobs, and ONLY the picker fields, never the financials (value/materials).
    const activeJobs = jobs
      .filter((j) => (j.status || 'active') === 'active')
      .map((j) => ({ id: j.id, name: j.name, customer: j.customer, workType: j.workType, address: j.address }))
    return ok({ employees: employees.filter((e) => e.active !== false).map((e) => ({ id: e.id, name: e.name })), jobs: activeJobs, locationStamp: settings.locationStamp === true })
  }

  // ---- Crew ----
  if (CREW_ACTIONS.includes(a)) {
    let emp = null
    if (body.token && a !== 'employee-login') {
      const p = readToken(settings.sessionSecret, body.token)
      emp = p && p.k === 'e' ? employees.find((e) => e.id === p.id && e.active !== false && pinTag(e, settings.sessionSecret) === p.v) : null
      if (!emp) return bad('Your login timed out. Enter your PIN again.', 401, { relogin: true })
    } else {
      const found = employees.find((e) => e.id === body.employeeId && e.active !== false)
      if (!found) return bad('Wrong name or PIN.', 401)
      const scope = `emp:${found.id}`
      const lock = await lockState(s, scope, ip)
      if (lock.locked) return bad(lockMsg(lock.until), 429)
      if (!pinMatches(found, body.pin)) {
        const f = await recordFail(s, scope, ip)
        return f.locked ? bad(lockMsg(f.until), 429) : bad('Wrong name or PIN.', 401)
      }
      if (lock.hadFails) await clearFails(s, scope, ip)
      emp = found
    }

    if (a === 'employee-login') {
      const token = signToken(settings.sessionSecret, { k: 'e', id: emp.id, v: pinTag(emp, settings.sessionSecret), exp: Date.now() + CREW_TTL })
      return ok({ ok: true, token, employee: { id: emp.id, name: emp.name, rate: rateFor(emp, today) } })
    }

    const myWeek = async (date) => {
      const wk = weekStart(date, wsd)
      const mine = (await listEntries(s, { from: wk, to: addDays(wk, 6) })).filter((e) => e.employeeId === emp.id)
      return { weekStart: wk, week: weekTotals(mine) }
    }
    if (a === 'my-week') return ok({ ok: true, ...(await myWeek(isDate(body.date) ? body.date : today)) })

    // ---- Live punch: an open clock-in kept until the shift is submitted ----
    if (a === 'punch-status') {
      const open = await s.get(`open:${emp.id}`, { type: 'json' })
      return ok({ ok: true, open: open ? { date: open.date, clockIn: open.clockIn } : null })
    }
    if (a === 'punch-in') {
      // The server stamps the time, so the clock-in is the moment the button was tapped.
      const now = nyParts()
      const open = { date: now.date, clockIn: now.time, at: new Date().toISOString() }
      if (settings.locationStamp === true) {
        const loc = cleanLoc(body.loc)
        if (loc) open.loc = loc; else open.locNote = cleanLocNote(body.locNote)
      }
      await s.setJSON(`open:${emp.id}`, open)
      return ok({ ok: true, open: { date: open.date, clockIn: open.clockIn } })
    }
    if (a === 'punch-cancel') { await s.delete(`open:${emp.id}`).catch(() => {}); return ok({ ok: true }) }

    // submit
    const { date, clockIn, clockOut, lunch } = body
    if (!isDate(date) || !isTime(clockIn) || !isTime(clockOut)) return bad('Missing clock times.')
    if (date > addDays(today, 1)) return bad('That date has not happened yet.')
    if (locked(date)) return bad('That pay period is locked. Check with the office.')
    const job = jobs.find((j) => j.id === body.jobId) || jobs.find((j) => j.name === body.jobName) || null
    const sameDay = (await listEntries(s, { from: date, to: date })).filter((e) => e.employeeId === emp.id)
    const clash = sameDay.find((e) => shiftsOverlap(e, { clockIn, clockOut }))
    if (clash) return bad(`You already logged ${fmtTime(clash.clockIn)} to ${fmtTime(clash.clockOut)} on that day. Check with the office if it needs fixing.`, 409)
    const lm = lunchMins(lunch)
    const hours = calcHours(clockIn, clockOut, lm)
    const rate = rateFor(emp, date)
    const open = await s.get(`open:${emp.id}`, { type: 'json' }).catch(() => null)
    const fromPunch = !!open && open.date === date && open.clockIn === clockIn
    const entry = {
      id: entryId(date), employeeId: emp.id, employeeName: emp.name, date, clockIn, clockOut,
      lunch: lm, jobId: job ? job.id : '', jobName: job ? job.name : String(body.jobName || ''), address: String(body.address || ''),
      hours, rate, pay: r2(hours * rate), source: fromPunch ? 'punch' : 'manual',
      createdAt: new Date().toISOString(),
    }
    if (settings.locationStamp === true) {
      if (fromPunch && open.loc) entry.locIn = open.loc
      else if (fromPunch && open.locNote) entry.locInNote = open.locNote
      const out = cleanLoc(body.loc)
      if (out) entry.locOut = out; else entry.locOutNote = cleanLocNote(body.locNote)
    }
    await putEntry(s, entry)
    await s.delete(`open:${emp.id}`).catch(() => {})
    return ok({ ok: true, entry: { id: entry.id, date, hours, rate, pay: entry.pay }, ...(await myWeek(date)) })
  }

  // ---- Owner login ----
  if (a === 'admin-login') {
    const lock = await lockState(s, 'admin', ip)
    if (lock.locked) return bad(lockMsg(lock.until), 429)
    if (!adminPassMatches(settings, body.passcode ?? body.adminPin)) {
      const f = await recordFail(s, 'admin', ip)
      return f.locked ? bad(lockMsg(f.until), 429) : bad('Wrong passcode.', 401)
    }
    if (lock.hadFails) await clearFails(s, 'admin', ip)
    return ok({ ok: true, token: signToken(settings.sessionSecret, { k: 'a', exp: Date.now() + ADMIN_TTL }), weakPasscode: weakPasscode(settings) })
  }

  if (!ADMIN_ACTIONS.includes(a) && !a.startsWith('admin')) return bad('Unknown action.')

  // ---- Owner (signed-in session, or the passcode itself) ----
  const session = body.adminToken ? readToken(settings.sessionSecret, body.adminToken) : null
  if (!(session && session.k === 'a')) {
    if (body.adminPin == null || body.adminPin === '') return bad(body.adminToken ? 'Your login timed out. Sign in again.' : 'Sign in first.', 401, { relogin: true })
    const lock = await lockState(s, 'admin', ip)
    if (lock.locked) return bad(lockMsg(lock.until), 429)
    if (!adminPassMatches(settings, body.adminPin)) {
      const f = await recordFail(s, 'admin', ip)
      return f.locked ? bad(lockMsg(f.until), 429) : bad('Wrong admin PIN.', 401)
    }
    if (lock.hadFails) await clearFails(s, 'admin', ip)
  }

  if (a === 'admin-bootstrap') {
    const bs = await backupStore().get('latest', { type: 'json' }).catch(() => null)
    return ok({
      employees: employees.map((e) => ownerEmployee(e, today)), jobs, ...ownerSettings(settings), hasPin: true,
      weakPasscode: weakPasscode(settings), connected: { email: emailReady(), sms: smsReady() },
      backup: bs ? { takenAt: bs.takenAt, entries: bs.counts?.entries ?? null } : null,
    })
  }
  if (a === 'admin-entries') {
    const [entries, trash] = await Promise.all([listEntries(s), s.list({ prefix: 'trash:' })])
    return ok({ entries, trashCount: trash.blobs.length })
  }
  if (a === 'admin-trash') {
    const { blobs } = await s.list({ prefix: 'trash:' })
    const rows = (await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' }).catch(() => null)))).filter(Boolean)
    return ok({ trash: rows.sort((x, y) => String(y.deletedAt).localeCompare(String(x.deletedAt))) })
  }

  // ---- Settings ----
  if (a === 'set-week-start') {
    const wd = Number(body.weekStartDay)
    if (!(wd >= 0 && wd <= 6)) return bad('Pick a valid day.')
    await s.setJSON('settings', { ...settings, weekStartDay: wd })
    return ok({ ok: true })
  }
  if (a === 'set-lock') {
    const lt = body.lockedThrough ? String(body.lockedThrough) : null
    if (lt && !isDate(lt)) return bad('Bad date.')
    await s.setJSON('settings', { ...settings, lockedThrough: lt })
    return ok({ ok: true })
  }
  if (a === 'save-settings') {
    const next = { ...settings }
    if (body.locationStamp !== undefined) next.locationStamp = body.locationStamp === true
    if (body.payrollEmail) {
      const p = body.payrollEmail
      const to = String(p.to || '').trim()
      if (p.on && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return bad('Enter the email address the payroll summary should go to.')
      const day = Number(p.day)
      next.payrollEmail = { on: p.on === true, to, day: day >= 0 && day <= 6 ? day : 1 }
    }
    if (body.quickbooks) next.quickbooks = cleanQb(body.quickbooks)
    if (body.reminders) {
      const h = Number(body.reminders.afterHours)
      if (!(h >= 4 && h <= 16)) return bad('Pick a number of hours between 4 and 16.')
      next.reminders = { on: body.reminders.on === true, afterHours: h }
    }
    await s.setJSON('settings', next)
    return ok({ ok: true, ...ownerSettings(next) })
  }
  if (a === 'set-admin-pin') return bad('Passcodes are now at least 6 characters. Refresh this page, then set one under Settings.')
  if (a === 'set-admin-passcode') {
    const p = String(body.newPasscode || '')
    if (p.length < 6 || p.length > 64) return bad('Use at least 6 characters.')
    if (/^(.)\1+$/.test(p) || ['123456', '1234567', '12345678', 'password', '111111', '000000'].includes(p.toLowerCase())) return bad('That one is too easy to guess. Pick another.')
    // A new secret signs out every other phone and computer.
    const { adminPin, ...rest } = settings
    const next = { ...rest, adminHash: hashPass(p), sessionSecret: hashPass(rand() + Date.now()).hash }
    await s.setJSON('settings', next)
    return ok({ ok: true, token: signToken(next.sessionSecret, { k: 'a', exp: Date.now() + ADMIN_TTL }) })
  }

  // ---- Crew records ----
  if (a === 'save-employee') {
    const e = body.employee || {}
    // Merge with the existing record so an edit keeps the same id (and login link) and anything not sent.
    const existing = e.id ? employees.find((x) => x.id === e.id) : null
    if (e.id && !existing) return bad('That crew member is no longer on the list. Refresh and try again.', 404)
    const name = String(e.name ?? existing?.name ?? '').trim()
    const pin = String(e.pin ?? existing?.pin ?? '')
    const oldRate = existing ? rateFor(existing, today) : null
    const rate = r2(Number(e.rate ?? oldRate ?? 0))
    if (!name || !/^\d{4}$/.test(pin)) return bad('Name and a 4-digit PIN are required.')
    if (!Number.isFinite(rate) || rate < 0) return bad('Enter an hourly rate.')
    let phone = existing?.phone || ''
    if (e.phone !== undefined) {
      phone = String(e.phone || '').trim() ? e164(e.phone) : ''
      if (phone === null) return bad('That cell number does not look right. Use all 10 digits.')
    }
    const from = e.effectiveFrom ? String(e.effectiveFrom) : today
    if (!isDate(from)) return bad('Pick the day the new rate starts.')
    const rateChanged = existing && rate !== oldRate
    let rates = existing ? rateList(existing) : [{ rate, from: '0000-00-00' }]
    // A new change replaces anything dated on or after its start day.
    if (rateChanged) rates = [...rates.filter((x) => x.from < from), { rate, from }]
    else if (e.cancelNextRate === true) rates = rates.filter((x) => x.from <= today)
    const rec = {
      ...(existing || {}), id: existing ? existing.id : rand(), name, pin, phone,
      rate: rateFor({ rates }, today), rates, active: (e.active ?? existing?.active) !== false,
    }
    // Replace in place so the crew list keeps its order.
    const list = existing ? employees.map((x) => (x.id === rec.id ? rec : x)) : [...employees, rec]
    await s.setJSON('employees', list)

    // Bring shifts already logged on or after the start day up to the new rate. Locked weeks stay as paid.
    let rerated = 0, lockedSkipped = 0
    if (rateChanged) {
      const mine = (await listEntries(s, { from, useArchives: false })).filter((x) => x.employeeId === rec.id && x.rate !== rate)
      for (const x of mine) {
        if (locked(x.date)) { lockedSkipped++; continue }
        await putEntry(s, { ...x, rate, pay: r2(x.hours * rate), history: withHistory(x, 'rate') })
        rerated++
      }
    }
    return ok({ ok: true, employees: list.map((x) => ownerEmployee(x, today)), rerated, lockedSkipped })
  }
  if (a === 'set-employee-active') {
    const existing = employees.find((x) => x.id === body.id)
    if (!existing) return bad('That crew member is no longer on the list. Refresh and try again.', 404)
    const active = body.active === true
    const list = employees.map((x) => (x.id === existing.id ? { ...x, active, deactivatedAt: active ? null : new Date().toISOString() } : x))
    await s.setJSON('employees', list)
    if (!active) await s.delete(`open:${existing.id}`).catch(() => {})
    return ok({ ok: true })
  }
  if (a === 'delete-employee') {
    const has = (await listEntries(s)).some((x) => x.employeeId === body.id)
    if (has) return bad('This person has shifts on file. Mark them as no longer on the crew instead, so their hours stay under their name.', 409)
    await s.setJSON('employees', employees.filter((x) => x.id !== body.id))
    await s.delete(`open:${body.id}`).catch(() => {})
    return ok({ ok: true })
  }

  // ---- Jobs ----
  if (a === 'save-job') {
    const j = body.job || {}
    // Merge with the existing record so a partial update (e.g. just a status change) keeps the rest.
    const existing = jobs.find((x) => x.id === j.id) || {}
    const customer = (j.customer ?? existing.customer ?? '').trim()
    const workType = (j.workType ?? existing.workType ?? '').trim()
    // Display label used in the crew dropdown, entries, and reports.
    const name = [customer, workType].filter(Boolean).join(' · ') || (j.name ?? existing.name ?? '').trim()
    if (!name) return bad('Add a customer (and the type of work).')
    const status = JOB_STATUSES.includes(j.status) ? j.status : (existing.status || 'active')
    // Profitability fields (admin only; never sent to the crew via config).
    const contractValue = j.contractValue !== undefined ? Math.max(0, Number(j.contractValue) || 0) : (existing.contractValue || 0)
    const materials = Array.isArray(j.materials)
      ? j.materials.map((m) => ({ desc: String(m.desc || '').trim(), amount: Math.max(0, Number(m.amount) || 0) })).filter((m) => m.desc || m.amount)
      : (existing.materials || [])
    // Bid estimate (entered at bid time) for the bid-vs-actual comparison.
    const num = (val, fb) => (val !== undefined ? Math.max(0, Number(val) || 0) : fb)
    const estHours = num(j.estHours, existing.estHours || 0)
    const estLabor = num(j.estLabor, existing.estLabor || 0)
    const estMaterials = num(j.estMaterials, existing.estMaterials || 0)
    const rec = { id: existing.id || rand(), customer, workType, name, address: (j.address ?? existing.address ?? '').trim(), status, contractValue, materials, estHours, estLabor, estMaterials }
    const list = existing.id ? jobs.map((x) => (x.id === rec.id ? rec : x)) : [...jobs, rec]
    await s.setJSON('jobs', list)
    return ok({ ok: true, jobs: list })
  }
  if (a === 'delete-job') {
    await s.setJSON('jobs', jobs.filter((x) => x.id !== body.id))
    return ok({ ok: true })
  }
  // Tie hours logged under an old job name to a job, so they count toward its labor.
  if (a === 'link-job-name') {
    const job = jobs.find((x) => x.id === body.jobId)
    const from = String(body.jobName || '')
    if (!job || !from) return bad('Pick the job those hours belong to.')
    const rows = (await listEntries(s, { useArchives: false })).filter((x) => !x.jobId && x.jobName === from)
    for (const x of rows) await putEntry(s, { ...x, jobId: job.id })
    return ok({ ok: true, linked: rows.length })
  }

  // ---- Shifts ----
  if (a === 'delete-entry') {
    const cur = await getEntry(s, body.id)
    if (!cur) return ok({ ok: true })
    if (locked(cur.date)) return bad('That entry is in a locked pay period.')
    // Deleted shifts are kept for 90 days so a mistake can be undone.
    await s.setJSON(`trash:${cur.id}`, { ...cur, deletedAt: new Date().toISOString() })
    await s.delete(entryKey(cur.id))
    return ok({ ok: true })
  }
  if (a === 'restore-entry') {
    const cur = await s.get(`trash:${body.id}`, { type: 'json' })
    if (!cur) return bad('That shift is no longer in the deleted list.', 404)
    if (locked(cur.date)) return bad('That shift belongs to a locked pay period. Unlock it first.')
    const { deletedAt, ...entry } = cur
    await putEntry(s, entry)
    await s.delete(`trash:${body.id}`)
    return ok({ ok: true, entry })
  }
  if (a === 'update-entry') {
    const cur = await getEntry(s, body.id)
    if (!cur) return bad('Entry not found.', 404)
    const date = body.date || cur.date
    if (!isDate(date)) return bad('Bad date.')
    if (locked(cur.date) || locked(date)) return bad('That entry is in a locked pay period.')
    const clockIn = body.clockIn || cur.clockIn
    const clockOut = body.clockOut || cur.clockOut
    if (!isTime(clockIn) || !isTime(clockOut)) return bad('Missing clock times.')
    const lunch = body.lunch !== undefined ? lunchMins(body.lunch) : lunchMins(cur.lunch)
    const hours = calcHours(clockIn, clockOut, lunch)
    let jobId = cur.jobId || '', jobName = cur.jobName
    if (body.jobId !== undefined) {
      const job = jobs.find((x) => x.id === body.jobId)
      jobId = job ? job.id : ''
      jobName = job ? job.name : String(body.jobName ?? '')
    } else if (body.jobName !== undefined && body.jobName !== cur.jobName) {
      const job = jobs.find((x) => x.name === body.jobName)
      jobId = job ? job.id : ''
      jobName = String(body.jobName)
    }
    const updated = {
      ...cur, date, clockIn, clockOut, lunch, jobId, jobName, address: body.address ?? cur.address,
      hours, pay: r2(hours * cur.rate), history: withHistory(cur, 'edit'),
    }
    // The id carries the date, so a shift moved to another day gets a new id.
    if (date !== cur.date || !/^\d{8}-/.test(cur.id)) {
      updated.id = entryId(date)
      await putEntry(s, updated)
      await s.delete(entryKey(cur.id))
    } else {
      await putEntry(s, updated)
    }
    return ok({ ok: true, entry: updated })
  }

  // ---- Backups and the weekly email ----
  if (a === 'backup-now') {
    const snap = await takeSnapshot(s, 'manual')
    return ok({ ok: true, backup: { takenAt: snap.takenAt, entries: snap.counts.entries } })
  }
  if (a === 'backup-download') {
    const { keys } = await listSnapshots()
    const entries = await listEntries(s, { useArchives: false })
    // The downloaded copy leaves out the login secrets.
    const { adminPin, adminHash, sessionSecret, ...safeSettings } = settings
    return ok({ takenAt: new Date().toISOString(), employees, jobs, settings: safeSettings, entries, snapshotsOnFile: keys.length })
  }
  if (a === 'send-payroll-email') {
    const cfg = ownerSettings(settings).payrollEmail
    if (!emailReady()) return bad('Email is not connected to this site yet.', 409)
    if (!cfg.to) return bad('Save the email address first.')
    const weekOf = isDate(body.weekOf) ? weekStart(body.weekOf, wsd) : addDays(weekStart(today, wsd), -7)
    const entries = await listEntries(s, { from: weekOf, to: addDays(weekOf, 6) })
    const mail = payrollEmail({ payroll: weekPayroll(entries, employees, weekOf), siteUrl: siteUrl() })
    const sent = await sendEmail({ to: cfg.to, ...mail })
    return sent.ok ? ok({ ok: true, to: cfg.to, weekOf }) : bad('The email did not send. Try again in a minute.', 502)
  }
  return bad('Unknown action.')
}
