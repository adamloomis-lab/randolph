import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Emp = { id: string; name: string; rate: number; pin: string; active?: boolean };
type JobStatus = "active" | "future" | "finished";
type Material = { desc: string; amount: number };
type Job = { id: string; name: string; customer?: string; workType?: string; address?: string; status?: JobStatus; contractValue?: number; materials?: Material[]; estHours?: number; estLabor?: number; estMaterials?: number };
const JOB_STATUS_META: Record<JobStatus, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-primary-container text-on-primary-container" },
  future: { label: "Future", cls: "bg-surface-container-highest text-on-surface-variant" },
  finished: { label: "Finished", cls: "bg-surface-container text-on-surface-variant/70" },
};
type Entry = { id: string; employeeName: string; employeeId?: string; date: string; clockIn: string; clockOut: string; lunch: number | boolean; jobName: string; address: string; hours: number; rate: number; pay: number; createdAt?: string };

// Lunch break options (minutes). Legacy entries stored a boolean (true = 30 min).
const LUNCH_OPTIONS = [
  { v: 0, label: "No lunch" },
  { v: 30, label: "30 min" },
  { v: 45, label: "45 min" },
  { v: 60, label: "1 hour" },
  { v: 90, label: "1.5 hours" },
];
const lunchToMins = (l: number | boolean) => (l === true ? 30 : Math.max(0, Number(l) || 0));
const lunchLabel = (l: number | boolean) => {
  const n = lunchToMins(l);
  if (!n) return "None";
  if (n % 60 === 0) return `${n / 60} hr`;
  if (n > 60) return `${Math.floor(n / 60)} hr ${n % 60} min`;
  return `${n} min`;
};

const API = "/.netlify/functions/timeclock";
const label = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input = "bg-surface-container border-b border-surface-container-highest p-3 text-on-surface focus:border-primary focus:outline-none transition-all w-full";
const btn = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50";
const btnGhost = "border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-4 py-2 hover:text-primary hover:border-primary transition-all";

export default function TimeClockAdmin() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"entries" | "payroll" | "projects" | "crew" | "jobs" | "settings">("entries");

  const [employees, setEmployees] = useState<Emp[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weekStartDay, setWeekStartDay] = useState(0);
  const [lockedThrough, setLockedThrough] = useState<string | null>(null);

  const post = async (body: Record<string, unknown>) => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, adminPin: pin }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Something went wrong.");
    return d;
  };

  const refresh = async () => {
    const a = await post({ action: "admin-bootstrap" });
    setEmployees(a.employees || []); setJobs(a.jobs || []); setWeekStartDay(a.weekStartDay ?? 0); setLockedThrough(a.lockedThrough ?? null);
    const e = await post({ action: "admin-entries" });
    setEntries(e.entries || []);
  };

  useEffect(() => { window.scrollTo(0, 0); document.title = "Time Clock Admin | Randolph Construction"; }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await refresh(); setAuthed(true); }
    catch (e2) { setErr((e2 as Error).message); }
    finally { setBusy(false); }
  };

  if (!authed) {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen">
        <Nav />
        <main id="main-content" className="pt-32 pb-24">
          <section className="max-w-sm mx-auto px-margin-mobile">
            <h1 className="font-display-lg text-3xl uppercase mb-6">Owner <span className="text-primary">Login</span></h1>
            <form onSubmit={login} className="bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5">
              <div>
                <label className={label} htmlFor="apin">Admin PIN</label>
                <input id="apin" className={`${input} tracking-[0.5em] text-lg`} type="password" inputMode="numeric" maxLength={4}
                  value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
              </div>
              {err && <p className="text-error text-sm font-label-bold">{err}</p>}
              <button className={`${btn} w-full`} disabled={busy}>{busy ? "Checking…" : "Sign In"}</button>
              <p className="text-on-surface-variant/70 text-xs text-center">Default PIN is 1111 — change it under Settings.</p>
            </form>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <Nav />
      <main id="main-content" className="pt-32 pb-24">
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h1 className="font-display-lg text-3xl md:text-4xl uppercase">Time Clock <span className="text-primary">Admin</span></h1>
            <button className={btnGhost} onClick={refresh}>Refresh</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 border-b border-surface-container-highest">
            {(["entries", "payroll", "projects", "crew", "jobs", "settings"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`font-label-bold text-label-bold uppercase px-5 py-3 -mb-px border-b-2 transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === "entries" && <EntriesTab entries={entries} jobs={jobs} lockedThrough={lockedThrough} post={post} onChange={refresh} />}
          {tab === "payroll" && <PayrollTab entries={entries} weekStartDay={weekStartDay} lockedThrough={lockedThrough} post={post} onChange={refresh} />}
          {tab === "projects" && <ProjectsTab jobs={jobs} entries={entries} post={post} onChange={refresh} />}
          {tab === "crew" && <CrewTab employees={employees} post={post} onChange={refresh} />}
          {tab === "jobs" && <JobsTab jobs={jobs} entries={entries} post={post} onChange={refresh} />}
          {tab === "settings" && <SettingsTab post={post} weekStartDay={weekStartDay} onChange={refresh} />}
        </section>
      </main>
      <Footer />
    </div>
  );
}

type PostFn = (b: Record<string, unknown>) => Promise<any>;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const r2 = (n: number) => Math.round(n * 100) / 100;
const fmtWeek = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};
// Workweek key for a YYYY-MM-DD date (UTC-safe). startDay: 0=Sun … 6=Sat.
function weekStart(dateStr: string, startDay = 0) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const off = (d.getUTCDay() - startDay + 7) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
}

type PayrollRow = { employee: string; week: string; reg: number; ot: number; total: number; gross: number };
// Per employee, per workweek: regular hours up to 40, the rest at 1.5x, using each shift's own rate.
function computePayroll(entries: Entry[], startDay = 0): PayrollRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    const key = `${e.employeeName}|${weekStart(e.date, startDay)}`;
    const arr = groups.get(key) || [];
    arr.push(e);
    groups.set(key, arr);
  }
  const rows: PayrollRow[] = [];
  for (const [key, list] of Array.from(groups.entries())) {
    const [employee, week] = key.split("|");
    const sorted = [...list].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
    let cum = 0, reg = 0, ot = 0, gross = 0;
    for (const e of sorted) {
      const h = e.hours || 0;
      const regPart = Math.min(h, Math.max(0, 40 - cum));
      const otPart = h - regPart;
      reg += regPart; ot += otPart; gross += regPart * e.rate + otPart * e.rate * 1.5; cum += h;
    }
    rows.push({ employee, week, reg: r2(reg), ot: r2(ot), total: r2(reg + ot), gross: r2(gross) });
  }
  rows.sort((a, b) => b.week.localeCompare(a.week) || a.employee.localeCompare(b.employee));
  return rows;
}

/* ---------------- Payroll (weekly, with overtime) ---------------- */
function PayrollTab({ entries, weekStartDay, lockedThrough, post, onChange }: { entries: Entry[]; weekStartDay: number; lockedThrough: string | null; post: PostFn; onChange: () => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lockDate, setLockDate] = useState(lockedThrough || "");
  const saveLock = async (clear = false) => { await post({ action: "set-lock", lockedThrough: clear ? "" : lockDate }); onChange(); };
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));
  const rows = computePayroll(filtered, weekStartDay);
  const grossTotal = rows.reduce((s, r) => s + r.gross, 0);
  const otTotal = rows.reduce((s, r) => s + r.ot, 0);

  const csv = () => {
    const head = ["Week of", "Employee", "Regular Hrs", "Overtime Hrs", "Total Hrs", "Gross Pay"];
    const body = [head, ...rows.map((r) => [r.week, r.employee, r.reg, r.ot, r.total, r.gross.toFixed(2)])]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = `randolph-payroll${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Lock payroll */}
      <div className="bg-surface-container-lowest p-5 border-2 border-surface-container-highest">
        <h3 className="font-headline-md text-headline-md uppercase mb-1">Lock Payroll</h3>
        <p className="text-on-surface-variant text-sm mb-4">Once you've paid a period, lock it so nobody can add or change times on or before that date.</p>
        {lockedThrough ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-label-bold text-primary uppercase tracking-widest text-sm">Locked through {lockedThrough}</span>
            <button className={btnGhost} onClick={() => saveLock(true)}>Unlock</button>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div><label className={label}>Lock Through</label><input type="date" className={input} value={lockDate} onChange={(e) => setLockDate(e.target.value)} /></div>
            <button className={btn} disabled={!lockDate} onClick={() => saveLock()}>Lock</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-surface-container-lowest p-5 border-2 border-surface-container-highest max-w-md">
        <div><label className={label}>From</label><input type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className={label}>To</label><input type="date" className={input} value={to} onChange={(e) => setTo(e.target.value)} /></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Stat label="Overtime Hours" value={otTotal.toFixed(2)} />
        <Stat label="Total Gross Pay" value={`$${grossTotal.toFixed(2)}`} />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md uppercase">Weekly Payroll</h3>
        <button className={btn} onClick={csv} disabled={!rows.length}>Export Payroll CSV</button>
      </div>

      <div className="overflow-x-auto border-2 border-surface-container-highest">
        <table className="w-full text-sm">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-xs tracking-wider">
            <tr>{["Week of", "Employee", "Regular", "Overtime", "Total Hrs", "Gross Pay"].map((h) => <th key={h} className="text-left p-3 font-label-bold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-on-surface-variant">No hours logged yet.</td></tr>}
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-surface-container-highest">
                <td className="p-3 whitespace-nowrap">Week of {fmtWeek(r.week)}</td>
                <td className="p-3 whitespace-nowrap font-label-bold">{r.employee}</td>
                <td className="p-3">{r.reg}</td>
                <td className="p-3">{r.ot > 0 ? <span className="text-primary font-label-bold">{r.ot}</span> : "0"}</td>
                <td className="p-3 font-label-bold">{r.total}</td>
                <td className="p-3 font-label-bold text-primary">${r.gross.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-on-surface-variant/80 text-xs">
        Overtime is calculated at 1.5× the hourly rate for hours over 40 in a workweek (starts {DAYS[weekStartDay]}). Gross pay shown is before taxes and withholdings. Change the workweek under Settings.
      </p>
    </div>
  );
}

/* ---------------- Entries + reporting ---------------- */
function EntriesTab({ entries, jobs, lockedThrough, post, onChange }: { entries: Entry[]; jobs: Job[]; lockedThrough: string | null; post: PostFn; onChange: () => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [emp, setEmp] = useState("");
  const [job, setJob] = useState("");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [saveErr, setSaveErr] = useState("");

  const empNames = useMemo(() => Array.from(new Set(entries.map((e) => e.employeeName))).sort(), [entries]);
  const jobNames = useMemo(() => Array.from(new Set(entries.map((e) => e.jobName).filter(Boolean))).sort(), [entries]);

  const filtered = entries.filter((e) =>
    (!from || e.date >= from) && (!to || e.date <= to) && (!emp || e.employeeName === emp) && (!job || e.jobName === job));

  const totalHrs = filtered.reduce((s, e) => s + e.hours, 0);
  const totalPay = filtered.reduce((s, e) => s + e.pay, 0);

  const byKey = (key: "employeeName" | "jobName") => {
    const m = new Map<string, { hours: number; pay: number }>();
    for (const e of filtered) {
      const k = (e[key] as string) || "(none)";
      const cur = m.get(k) || { hours: 0, pay: 0 };
      m.set(k, { hours: cur.hours + e.hours, pay: cur.pay + e.pay });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].pay - a[1].pay);
  };

  const csv = () => {
    const head = ["Date", "Employee", "Job", "Address", "Clock In", "Clock Out", "Lunch", "Hours", "Rate", "Pay"];
    const rows = filtered.map((e) => [e.date, e.employeeName, e.jobName, e.address, e.clockIn, e.clockOut, lunchLabel(e.lunch), e.hours, e.rate, e.pay]);
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
    const body = [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
    const blob = new Blob([body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `randolph-hours${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`;
    a.click();
  };

  const del = async (id: string) => { if (confirm("Delete this entry?")) { await post({ action: "delete-entry", id }); onChange(); } };
  const saveEdit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaveErr("");
    if (!editing) return;
    try {
      await post({ action: "update-entry", id: editing.id, date: editing.date, clockIn: editing.clockIn, clockOut: editing.clockOut, lunch: editing.lunch, jobName: editing.jobName, address: editing.address });
      setEditing(null); onChange();
    } catch (e2) { setSaveErr((e2 as Error).message); }
  };

  return (
    <div className="space-y-8">
      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(ev) => ev.stopPropagation()} onSubmit={saveEdit} className="bg-surface-container-lowest border-2 border-primary p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md uppercase">Edit Entry — {editing.employeeName}</h3>
            <div><label className={label}>Date</label><input type="date" className={input} value={editing.date} onChange={(ev) => setEditing({ ...editing, date: ev.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Clock In</label><input type="time" className={input} value={editing.clockIn} onChange={(ev) => setEditing({ ...editing, clockIn: ev.target.value })} /></div>
              <div><label className={label}>Clock Out</label><input type="time" className={input} value={editing.clockOut} onChange={(ev) => setEditing({ ...editing, clockOut: ev.target.value })} /></div>
            </div>
            <div><label className={label}>Lunch Break</label>
              <select className={input} value={lunchToMins(editing.lunch)} onChange={(ev) => setEditing({ ...editing, lunch: Number(ev.target.value) })}>
                {LUNCH_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                {!LUNCH_OPTIONS.some((o) => o.v === lunchToMins(editing.lunch)) && <option value={lunchToMins(editing.lunch)}>{lunchLabel(editing.lunch)}</option>}
              </select>
            </div>
            <div><label className={label}>Job</label>
              <select className={input} value={editing.jobName} onChange={(ev) => { const name = ev.target.value; const j = jobs.find((x) => x.name === name); setEditing({ ...editing, jobName: name, address: j ? (j.address || "") : editing.address }); }}>
                <option value="">—</option>
                {jobs.map((j) => <option key={j.id} value={j.name}>{j.name}</option>)}
                {editing.jobName && !jobs.some((j) => j.name === editing.jobName) && <option value={editing.jobName}>{editing.jobName}</option>}
              </select>
            </div>
            <div><label className={label}>Address</label><input className={input} value={editing.address} onChange={(ev) => setEditing({ ...editing, address: ev.target.value })} /></div>
            {saveErr && <p className="text-error text-sm font-label-bold">{saveErr}</p>}
            <div className="flex gap-3"><button className={btn}>Save</button><button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancel</button></div>
            <p className="text-on-surface-variant/70 text-xs">Hours and pay recalculate automatically when you save.</p>
          </form>
        </div>
      )}
      {/* filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest p-5 border-2 border-surface-container-highest">
        <div><label className={label}>From</label><input type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className={label}>To</label><input type="date" className={input} value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div><label className={label}>Employee</label><select className={input} value={emp} onChange={(e) => setEmp(e.target.value)}><option value="">All</option>{empNames.map((n) => <option key={n}>{n}</option>)}</select></div>
        <div><label className={label}>Job</label><select className={input} value={job} onChange={(e) => setJob(e.target.value)}><option value="">All</option>{jobNames.map((n) => <option key={n}>{n}</option>)}</select></div>
      </div>

      {/* totals */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Entries" value={String(filtered.length)} />
        <Stat label="Total Hours" value={totalHrs.toFixed(2)} />
        <Stat label="Total Pay" value={`$${totalPay.toFixed(2)}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RollUp title="By Employee" rows={byKey("employeeName")} />
        <RollUp title="By Job" rows={byKey("jobName")} />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md uppercase">Entries</h3>
        <button className={btn} onClick={csv} disabled={!filtered.length}>Export CSV</button>
      </div>

      <div className="overflow-x-auto border-2 border-surface-container-highest">
        <table className="w-full text-sm">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-xs tracking-wider">
            <tr>{["Date", "Employee", "Job", "In", "Out", "Lunch", "Hours", "Pay", ""].map((h) => <th key={h} className="text-left p-3 font-label-bold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-on-surface-variant">No entries yet.</td></tr>}
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-surface-container-highest">
                <td className="p-3 whitespace-nowrap">{e.date}</td>
                <td className="p-3 whitespace-nowrap">{e.employeeName}</td>
                <td className="p-3">{e.jobName || <span className="text-on-surface-variant">—</span>}</td>
                <td className="p-3">{e.clockIn}</td>
                <td className="p-3">{e.clockOut}</td>
                <td className="p-3">{lunchLabel(e.lunch)}</td>
                <td className="p-3 font-label-bold">{e.hours}</td>
                <td className="p-3 font-label-bold text-primary">${e.pay.toFixed(2)}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  {lockedThrough && e.date <= lockedThrough ? (
                    <span className="text-on-surface-variant/70 text-xs uppercase tracking-wider">Locked</span>
                  ) : (
                    <>
                      <button onClick={() => setEditing(e)} className="text-on-surface-variant hover:text-primary text-xs underline mr-3">edit</button>
                      <button onClick={() => del(e.id)} className="text-on-surface-variant hover:text-error text-xs underline">delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-lowest p-5 border-2 border-surface-container-highest">
      <div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest">{l}</div>
      <div className="font-display-lg text-3xl text-primary mt-1">{value}</div>
    </div>
  );
}

function RollUp({ title, rows }: { title: string; rows: [string, { hours: number; pay: number }][] }) {
  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container-highest">
      <div className="bg-surface-container px-4 py-3 font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest">{title}</div>
      {rows.length === 0 ? <div className="p-4 text-on-surface-variant text-sm">No data.</div> :
        rows.map(([k, v]) => (
          <div key={k} className="flex justify-between items-center px-4 py-3 border-t border-surface-container-highest">
            <span className="truncate pr-3">{k}</span>
            <span className="whitespace-nowrap"><strong className="text-on-surface">{v.hours.toFixed(2)} hrs</strong> <span className="text-primary font-label-bold">${v.pay.toFixed(2)}</span></span>
          </div>
        ))}
    </div>
  );
}

/* ---------------- Crew ---------------- */
function CrewTab({ employees, post, onChange }: { employees: Emp[]; post: PostFn; onChange: () => void }) {
  const blank = { id: "", name: "", rate: "", pin: "" };
  const [f, setF] = useState<{ id: string; name: string; rate: string; pin: string }>(blank);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ }
    setCopied(id); setTimeout(() => setCopied(""), 1500);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    try {
      await post({ action: "save-employee", employee: { id: f.id || undefined, name: f.name, rate: Number(f.rate), pin: f.pin } });
      setF(blank); onChange();
    } catch (e2) { setErr((e2 as Error).message); }
  };
  const del = async (id: string) => { if (confirm("Remove this person?")) { await post({ action: "delete-employee", id }); onChange(); } };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={save} className="bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit">
        <h3 className="font-headline-md text-headline-md uppercase">{f.id ? "Edit Crew Member" : "Add Crew Member"}</h3>
        <div><label className={label}>Name</label><input className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label className={label}>Hourly Rate ($)</label><input className={input} inputMode="decimal" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} placeholder="25" /></div>
        <div><label className={label}>4-Digit PIN</label><input className={`${input} tracking-[0.4em]`} inputMode="numeric" maxLength={4} value={f.pin} onChange={(e) => setF({ ...f, pin: e.target.value.replace(/\D/g, "") })} placeholder="0000" /></div>
        {err && <p className="text-error text-sm font-label-bold">{err}</p>}
        <div className="flex gap-3">
          <button className={btn}>{f.id ? "Save Changes" : "Add Member"}</button>
          {f.id && <button type="button" className={btnGhost} onClick={() => setF(blank)}>Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {employees.length === 0 && <p className="text-on-surface-variant">No crew yet. Add your first person.</p>}
        {employees.map((e) => {
          const link = `${typeof window !== "undefined" ? window.location.origin : ""}/employee?u=${e.id}`;
          return (
            <div key={e.id} className="bg-surface-container-lowest p-4 border-2 border-surface-container-highest space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-headline-md text-headline-md">{e.name}</div>
                  <div className="text-on-surface-variant text-sm">${e.rate}/hr · PIN {e.pin}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className={btnGhost} onClick={() => setF({ id: e.id, name: e.name, rate: String(e.rate), pin: e.pin })}>Edit</button>
                  <button className="text-on-surface-variant hover:text-error text-xs underline" onClick={() => del(e.id)}>Remove</button>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface-container p-2 border border-surface-container-highest">
                <input readOnly value={link} onFocus={(ev) => ev.currentTarget.select()} className="flex-1 min-w-0 bg-transparent text-on-surface-variant text-xs outline-none" />
                <button type="button" onClick={() => copy(e.id, link)} className="shrink-0 bg-primary-container text-on-primary-container font-label-bold text-xs uppercase px-3 py-1.5 metallic-gradient beveled-edge">{copied === e.id ? "Copied!" : "Copy link"}</button>
              </div>
              <p className="text-on-surface-variant/70 text-xs">Text this link to {e.name.split(" ")[0]} — it opens straight to their name; they just enter PIN {e.pin}.</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Jobs (with man-hours / labor history) ---------------- */
function JobsTab({ jobs, entries, post, onChange }: { jobs: Job[]; entries: Entry[]; post: PostFn; onChange: () => void }) {
  const blank = { id: "", customer: "", workType: "", address: "", status: "active" as JobStatus };
  const [f, setF] = useState<{ id: string; customer: string; workType: string; address: string; status: JobStatus }>(blank);
  const [err, setErr] = useState("");
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    try { await post({ action: "save-job", job: { id: f.id || undefined, customer: f.customer, workType: f.workType, address: f.address, status: f.status } }); setF(blank); onChange(); }
    catch (e2) { setErr((e2 as Error).message); }
  };
  // For older jobs saved before this split, drop the old name into Customer so it can be tidied up.
  const editJob = (j: Job) => setF({ id: j.id, customer: j.customer || (j.workType ? "" : j.name || ""), workType: j.workType || "", address: j.address || "", status: j.status || "active" });
  // Quick status change from the job card (merges server-side, so only status changes).
  const setStatus = async (j: Job, status: JobStatus) => { await post({ action: "save-job", job: { id: j.id, status } }); onChange(); };
  const del = async (id: string) => { if (confirm("Remove this job? Its logged hours stay in your records.")) { await post({ action: "delete-job", id }); if (f.id === id) setF(blank); onChange(); } };

  // Show Active first, then Future, then Finished.
  const order: Record<JobStatus, number> = { active: 0, future: 1, finished: 2 };
  const sortedJobs = [...jobs].sort((a, b) => order[a.status || "active"] - order[b.status || "active"]);

  // Lifetime man-hours + straight-time labor cost per job name.
  const stats = useMemo(() => {
    const m = new Map<string, { hours: number; pay: number }>();
    for (const e of entries) {
      if (!e.jobName) continue;
      const c = m.get(e.jobName) || { hours: 0, pay: 0 };
      m.set(e.jobName, { hours: c.hours + e.hours, pay: c.pay + e.pay });
    }
    return m;
  }, [entries]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <form onSubmit={save} className="bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit">
        <h3 className="font-headline-md text-headline-md uppercase">{f.id ? "Edit Job" : "Add a Job"}</h3>
        <p className="text-on-surface-variant text-sm">Only <strong className="text-primary">Active</strong> jobs show in the crew's dropdown. Future and Finished jobs are hidden from them, so their list stays short.</p>
        <div><label className={label}>Customer</label><input className={input} value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value })} placeholder="e.g. Chick-fil-A or Mr. Smith" /></div>
        <div><label className={label}>Type of Work</label><input className={input} value={f.workType} onChange={(e) => setF({ ...f, workType: e.target.value })} placeholder="e.g. Retaining Wall" /></div>
        <div><label className={label}>Job Site Address</label><input className={input} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="123 Main St, Wadsworth, OH" /></div>
        <div><label className={label}>Status</label>
          <select className={input} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as JobStatus })}>
            <option value="active">Active (crew can pick it)</option>
            <option value="future">Future (hidden from crew)</option>
            <option value="finished">Finished (hidden from crew)</option>
          </select>
        </div>
        {err && <p className="text-error text-sm font-label-bold">{err}</p>}
        <div className="flex gap-3">
          <button className={btn}>{f.id ? "Save Changes" : "Add Job"}</button>
          {f.id && <button type="button" className={btnGhost} onClick={() => setF(blank)}>Cancel</button>}
        </div>
      </form>
      <div className="space-y-3">
        {jobs.length === 0 && <p className="text-on-surface-variant">No jobs yet.</p>}
        {sortedJobs.map((j) => {
          const s = stats.get(j.name);
          const status = (j.status || "active") as JobStatus;
          return (
            <div key={j.id} className={`bg-surface-container-lowest p-4 border-2 border-surface-container-highest ${status !== "active" ? "opacity-75" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-bold">{j.customer || j.name}</span>
                    <span className={`text-[10px] font-label-bold uppercase tracking-wider px-2 py-0.5 ${JOB_STATUS_META[status].cls}`}>{JOB_STATUS_META[status].label}</span>
                  </div>
                  {j.workType && <div className="text-on-surface-variant text-sm mt-0.5">{j.workType}</div>}
                  {j.address
                    ? <div className="text-on-surface-variant text-sm mt-0.5">{j.address}</div>
                    : <div className="text-on-surface-variant/60 text-xs mt-0.5 italic">No address saved</div>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className={btnGhost} onClick={() => editJob(j)}>Edit</button>
                  <button className="text-on-surface-variant hover:text-error text-xs underline" onClick={() => del(j.id)}>Remove</button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="text-on-surface-variant text-xs uppercase tracking-wider font-label-bold">Status</label>
                <select className="bg-surface-container border border-surface-container-highest text-on-surface text-sm px-2 py-1 focus:border-primary focus:outline-none" value={status} onChange={(e) => setStatus(j, e.target.value as JobStatus)}>
                  <option value="active">Active</option>
                  <option value="future">Future</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
              <div className="text-on-surface-variant text-sm mt-2">
                <span className="text-primary font-label-bold">{(s?.hours || 0).toFixed(2)} man-hours</span>
                {" · "}${(s?.pay || 0).toFixed(2)} labor to date
              </div>
            </div>
          );
        })}
        <p className="text-on-surface-variant/70 text-xs pt-1">Labor shown is straight-time hours logged against each job, totaled across all time.</p>
      </div>
    </div>
  );
}

/* ---------------- Projects: profit & loss per job (admin only) ---------------- */
const money = (n: number) => "$" + Math.round(n || 0).toLocaleString("en-US");
function laborForJob(name: string, entries: Entry[]) {
  let hours = 0, pay = 0;
  for (const e of entries) { if (e.jobName === name) { hours += e.hours || 0; pay += e.pay || 0; } }
  return { hours, pay };
}

function ProjectsTab({ jobs, entries, post, onChange }: { jobs: Job[]; entries: Entry[]; post: PostFn; onChange: () => void }) {
  // Portfolio totals across jobs that have a contract value entered (real priced projects).
  const totals = useMemo(() => {
    let revenue = 0, cost = 0, count = 0;
    for (const j of jobs) {
      const value = j.contractValue || 0;
      if (value <= 0) continue;
      const labor = laborForJob(j.name, entries).pay;
      const mat = (j.materials || []).reduce((s, m) => s + (m.amount || 0), 0);
      revenue += value; cost += labor + mat; count++;
    }
    const profit = revenue - cost;
    return { revenue, cost, profit, margin: revenue > 0 ? (profit / revenue) * 100 : 0, count };
  }, [jobs, entries]);

  const sorted = useMemo(() => [...jobs].sort((a, b) => (b.contractValue || 0) - (a.contractValue || 0)), [jobs]);

  // Profit rolled up by type of work (priced jobs only).
  const byType = useMemo(() => {
    const m = new Map<string, { count: number; revenue: number; cost: number }>();
    for (const j of jobs) {
      const value = j.contractValue || 0; if (value <= 0) continue;
      const type = (j.workType || "Other").trim() || "Other";
      const labor = laborForJob(j.name, entries).pay;
      const mat = (j.materials || []).reduce((s, x) => s + (x.amount || 0), 0);
      const c = m.get(type) || { count: 0, revenue: 0, cost: 0 };
      c.count++; c.revenue += value; c.cost += labor + mat; m.set(type, c);
    }
    return Array.from(m.entries())
      .map(([type, d]) => ({ type, count: d.count, revenue: d.revenue, profit: d.revenue - d.cost, margin: d.revenue > 0 ? ((d.revenue - d.cost) / d.revenue) * 100 : 0 }))
      .sort((a, b) => b.margin - a.margin);
  }, [jobs, entries]);

  const csv = () => {
    const head = ["Project", "Status", "Contract Value", "Labor Hours", "Labor $", "Materials $", "Total Cost", "Profit", "Margin %"];
    const rows = jobs.filter((j) => (j.contractValue || 0) > 0).map((j) => {
      const l = laborForJob(j.name, entries);
      const mat = (j.materials || []).reduce((s, m) => s + (m.amount || 0), 0);
      const cost = l.pay + mat; const value = j.contractValue || 0; const profit = value - cost;
      return [j.name, j.status || "active", value, l.hours.toFixed(2), Math.round(l.pay), Math.round(mat), Math.round(cost), Math.round(profit), (value > 0 ? (profit / value) * 100 : 0).toFixed(1)];
    });
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
    const body = [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "randolph-projects-pnl.csv"; a.click();
  };

  return (
    <div className="space-y-8">
      <p className="text-on-surface-variant text-sm max-w-2xl">Your money side, private to you. Add the contract value and materials for a job and the labor pulls straight from the time clock. Profit and margin add up automatically, and every job stays on file so you can look back years later.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label={`Revenue (${totals.count})`} value={money(totals.revenue)} />
        <Stat label="Total Cost" value={money(totals.cost)} />
        <Stat label="Profit" value={money(totals.profit)} />
        <Stat label="Avg Margin" value={`${totals.margin.toFixed(0)}%`} />
      </div>

      {byType.length > 0 && (
        <div className="border-2 border-surface-container-highest">
          <div className="bg-surface-container px-4 py-3 font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest">Profit by Type of Work</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-on-surface-variant uppercase text-xs tracking-wider">
                <tr>{["Type of Work", "Jobs", "Revenue", "Profit", "Avg Margin"].map((h, i) => <th key={h} className={`p-3 font-label-bold ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {byType.map((r) => (
                  <tr key={r.type} className="border-t border-surface-container-highest">
                    <td className="p-3 font-label-bold">{r.type}</td>
                    <td className="p-3 text-right">{r.count}</td>
                    <td className="p-3 text-right">{money(r.revenue)}</td>
                    <td className="p-3 text-right font-label-bold" style={{ color: r.profit >= 0 ? "#5ec26a" : undefined }}>{money(r.profit)}</td>
                    <td className="p-3 text-right font-label-bold text-primary">{r.margin.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-on-surface-variant/70 text-xs p-3">Across all priced jobs. Shows which kind of work actually makes you money, so you know what to chase.</p>
        </div>
      )}

      <div className="flex justify-end">
        <button className={btn} onClick={csv} disabled={totals.count === 0}>Export P&amp;L CSV</button>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 && <p className="text-on-surface-variant">No jobs yet. Add one under the Jobs tab first.</p>}
        {sorted.map((j) => <ProjectCard key={j.id} job={j} labor={laborForJob(j.name, entries)} post={post} onChange={onChange} />)}
      </div>
    </div>
  );
}

function ProjectCard({ job, labor, post, onChange }: { job: Job; labor: { hours: number; pay: number }; post: PostFn; onChange: () => void }) {
  const [value, setValue] = useState(job.contractValue ? String(job.contractValue) : "");
  const [materials, setMaterials] = useState<Material[]>(job.materials?.length ? job.materials.map((m) => ({ ...m })) : []);
  const [estH, setEstH] = useState(job.estHours ? String(job.estHours) : "");
  const [estL, setEstL] = useState(job.estLabor ? String(job.estLabor) : "");
  const [estM, setEstM] = useState(job.estMaterials ? String(job.estMaterials) : "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const matTotal = materials.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const v = Number(value) || 0;
  const cost = labor.pay + matTotal;
  const profit = v - cost;
  const margin = v > 0 ? (profit / v) * 100 : 0;
  // Bid estimate + comparison
  const eH = Number(estH) || 0, eL = Number(estL) || 0, eM = Number(estM) || 0;
  const estCost = eL + eM;
  const estMargin = v > 0 ? ((v - estCost) / v) * 100 : 0;
  const hasBid = eH > 0 || eL > 0 || eM > 0;

  const addLine = () => setMaterials([...materials, { desc: "", amount: 0 }]);
  const setLine = (i: number, patch: Partial<Material>) => setMaterials(materials.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const rmLine = (i: number) => setMaterials(materials.filter((_, idx) => idx !== i));

  const save = async () => {
    setBusy(true);
    try {
      await post({ action: "save-job", job: { id: job.id, contractValue: v, materials: materials.map((m) => ({ desc: m.desc, amount: Number(m.amount) || 0 })), estHours: eH, estLabor: eL, estMaterials: eM } });
      setSaved(true); setTimeout(() => setSaved(false), 1600); onChange();
    } finally { setBusy(false); }
  };

  const status = (job.status || "active") as JobStatus;
  const mInput = "bg-surface-container border-b border-surface-container-highest p-2 text-on-surface focus:border-primary focus:outline-none w-full";

  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container-highest">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-surface-container-highest">
        <div className="font-headline-md text-headline-md uppercase">{job.customer || job.name}{job.workType ? ` · ${job.workType}` : ""}</div>
        <span className={`text-[10px] font-label-bold uppercase tracking-wider px-2 py-0.5 ${JOB_STATUS_META[status].cls}`}>{JOB_STATUS_META[status].label}</span>
      </div>

      <div className="px-5 py-2">
        <div className="flex items-center justify-between gap-4 py-3 border-b border-surface-container-highest">
          <label className="text-on-surface">Contract value <span className="text-on-surface-variant text-xs">(approved estimate)</span></label>
          <div className="flex items-center gap-1 w-40"><span className="text-on-surface-variant">$</span><input className={mInput} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
        </div>

        <div className="py-3 border-b border-surface-container-highest">
          <div className="text-on-surface mb-2">Your bid <span className="text-on-surface-variant text-xs">(what you estimated, optional)</span></div>
          <div className="grid grid-cols-3 gap-2">
            <div><div className="text-on-surface-variant text-xs mb-1">Est. hours</div><input className={mInput} inputMode="decimal" value={estH} onChange={(e) => setEstH(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
            <div><div className="text-on-surface-variant text-xs mb-1">Est. labor $</div><input className={mInput} inputMode="decimal" value={estL} onChange={(e) => setEstL(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
            <div><div className="text-on-surface-variant text-xs mb-1">Est. materials $</div><input className={mInput} inputMode="decimal" value={estM} onChange={(e) => setEstM(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-surface-container-highest">
          <span className="text-on-surface">Labor <span className="text-primary text-xs">· {labor.hours.toFixed(1)} hrs, from the time clock</span></span>
          <span className="font-label-bold">{money(labor.pay)}</span>
        </div>

        <div className="py-3 border-b border-surface-container-highest">
          <div className="flex items-center justify-between mb-2"><span className="text-on-surface">Materials <span className="text-on-surface-variant text-xs">(itemized)</span></span><span className="font-label-bold">{money(matTotal)}</span></div>
          <div className="space-y-2">
            {materials.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={`${mInput} flex-1`} value={m.desc} onChange={(e) => setLine(i, { desc: e.target.value })} placeholder="e.g. Block & stone" />
                <div className="flex items-center gap-1 w-32"><span className="text-on-surface-variant">$</span><input className={mInput} inputMode="decimal" value={m.amount || ""} onChange={(e) => setLine(i, { amount: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })} placeholder="0" /></div>
                <button type="button" onClick={() => rmLine(i)} className="text-on-surface-variant hover:text-error text-sm px-1" aria-label="Remove line item">✕</button>
              </div>
            ))}
            <button type="button" onClick={addLine} className="text-primary text-sm font-label-bold hover:underline">+ Add line item</button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-on-surface">Total cost <span className="text-on-surface-variant text-xs">(labor + materials)</span></span>
          <span className="font-label-bold">{money(cost)}</span>
        </div>

        {hasBid && (
          <div className="mt-1 mb-3 border border-surface-container-highest text-sm">
            <div className="grid grid-cols-4 bg-surface-container text-on-surface-variant text-[10px] uppercase tracking-wider">
              <div className="p-2">Bid vs actual</div><div className="p-2 text-right">Bid</div><div className="p-2 text-right">Actual</div><div className="p-2 text-right">Off by</div>
            </div>
            {eH > 0 && (
              <div className="grid grid-cols-4 border-t border-surface-container-highest">
                <div className="p-2 text-on-surface-variant">Hours</div>
                <div className="p-2 text-right">{eH.toFixed(0)}</div>
                <div className="p-2 text-right text-on-surface">{labor.hours.toFixed(1)}</div>
                <div className={`p-2 text-right font-label-bold ${labor.hours - eH > 0 ? "text-error" : "text-[#5ec26a]"}`}>{labor.hours - eH > 0 ? "+" : ""}{(labor.hours - eH).toFixed(1)} hrs</div>
              </div>
            )}
            <div className="grid grid-cols-4 border-t border-surface-container-highest">
              <div className="p-2 text-on-surface-variant">Cost</div>
              <div className="p-2 text-right">{money(estCost)}</div>
              <div className="p-2 text-right text-on-surface">{money(cost)}</div>
              <div className={`p-2 text-right font-label-bold ${cost - estCost > 0 ? "text-error" : "text-[#5ec26a]"}`}>{cost - estCost >= 0 ? "+" : "-"}{money(Math.abs(cost - estCost))}</div>
            </div>
            {v > 0 && (
              <div className="grid grid-cols-4 border-t border-surface-container-highest bg-[#15110f]">
                <div className="p-2 text-on-surface font-label-bold">Margin</div>
                <div className="p-2 text-right text-[#5ec26a]">{estMargin.toFixed(0)}%</div>
                <div className="p-2 text-right font-label-bold text-primary">{margin.toFixed(0)}%</div>
                <div className={`p-2 text-right font-label-bold ${margin - estMargin < 0 ? "text-error" : "text-[#5ec26a]"}`}>{margin - estMargin >= 0 ? "+" : ""}{(margin - estMargin).toFixed(0)} pts</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-surface-container-highest bg-[#15110f]">
        <div>
          <div className="text-label-bold uppercase text-on-surface-variant text-[10px] tracking-widest">Profit</div>
          {v > 0 ? <div className={`font-display-lg text-3xl ${profit >= 0 ? "text-[#5ec26a]" : "text-error"}`}>{money(profit)}</div> : <div className="text-on-surface-variant text-sm pt-2">Add a contract value</div>}
        </div>
        <div className="text-right">
          <div className="text-label-bold uppercase text-on-surface-variant text-[10px] tracking-widest">Margin</div>
          <div className="font-display-lg text-3xl text-primary">{v > 0 ? `${margin.toFixed(0)}%` : ""}</div>
        </div>
        <button className={btn} disabled={busy} onClick={save}>{busy ? "Saving…" : saved ? "Saved" : "Save"}</button>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsTab({ post, weekStartDay, onChange }: { post: PostFn; weekStartDay: number; onChange: () => void }) {
  const [newPin, setNewPin] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const savePin = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setMsg("");
    try { await post({ action: "set-admin-pin", newPin }); setMsg("Admin PIN updated."); setNewPin(""); }
    catch (e2) { setErr((e2 as Error).message); }
  };

  const [wd, setWd] = useState(String(weekStartDay));
  const [wmsg, setWmsg] = useState("");
  const [werr, setWerr] = useState("");
  const saveWeek = async (e: React.FormEvent) => {
    e.preventDefault(); setWerr(""); setWmsg("");
    try { await post({ action: "set-week-start", weekStartDay: Number(wd) }); setWmsg(`Workweek now starts ${DAYS[Number(wd)]}.`); onChange(); }
    catch (e2) { setWerr((e2 as Error).message); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
      <form onSubmit={savePin} className="bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit">
        <h3 className="font-headline-md text-headline-md uppercase">Change Admin PIN</h3>
        <div><label className={label}>New 4-Digit PIN</label><input className={`${input} tracking-[0.4em]`} inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))} placeholder="0000" /></div>
        {msg && <p className="text-primary text-sm font-label-bold">{msg}</p>}
        {err && <p className="text-error text-sm font-label-bold">{err}</p>}
        <button className={btn}>Update PIN</button>
      </form>

      <form onSubmit={saveWeek} className="bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit">
        <h3 className="font-headline-md text-headline-md uppercase">Workweek for Overtime</h3>
        <p className="text-on-surface-variant text-sm">Overtime pays 1.5× for hours over 40 in a week. Pick the day your pay week starts so the totals match your payroll.</p>
        <div><label className={label}>Week Starts On</label>
          <select className={input} value={wd} onChange={(e) => setWd(e.target.value)}>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
        {wmsg && <p className="text-primary text-sm font-label-bold">{wmsg}</p>}
        {werr && <p className="text-error text-sm font-label-bold">{werr}</p>}
        <button className={btn}>Save Workweek</button>
      </form>
    </div>
  );
}
