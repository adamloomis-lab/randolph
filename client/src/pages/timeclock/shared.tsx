// Types, styles, and helpers shared by the owner screens of the time clock.
import { useState } from "react";

export type Rate = { rate: number; from: string };
export type Emp = { id: string; name: string; rate: number; pin: string; active: boolean; phone: string; nextRate: Rate | null; rates: Rate[] };
export type JobStatus = "active" | "future" | "finished";
export type Material = { desc: string; amount: number };
export type Job = { id: string; name: string; customer?: string; workType?: string; address?: string; status?: JobStatus; contractValue?: number; materials?: Material[]; estHours?: number; estLabor?: number; estMaterials?: number };
export type Loc = { lat: number; lng: number; acc: number; at: string };
export type Before = { date: string; clockIn: string; clockOut: string; lunch: number; jobName: string; address: string; hours: number; rate: number; pay: number };
export type HistoryItem = { at: string; by: string; what: "edit" | "rate"; before: Before };
export type Entry = {
  id: string; employeeName: string; employeeId?: string; date: string; clockIn: string; clockOut: string; lunch: number | boolean;
  jobId?: string; jobName: string; address: string; hours: number; rate: number; pay: number; createdAt?: string; source?: "punch" | "manual";
  locIn?: Loc; locOut?: Loc; locInNote?: string; locOutNote?: string; history?: HistoryItem[]; deletedAt?: string;
};
export type QbSettings = { serviceItem: string; payrollItem: string; otPayrollItem: string; companyName: string; companyCreateTime: string };
export type OwnerSettings = {
  weekStartDay: number; lockedThrough: string | null; locationStamp: boolean;
  payrollEmail: { on: boolean; to: string; day: number };
  reminders: { on: boolean; afterHours: number };
  quickbooks: QbSettings;
};
export type Connected = { email: boolean; sms: boolean };
export type Backup = { takenAt: string; entries: number | null } | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PostFn = (b: Record<string, unknown>) => Promise<any>;
export type Refresh = () => void | Promise<void>;

export const JOB_STATUS_LABEL: Record<JobStatus, string> = { active: "Active", future: "Future", finished: "Finished" };

// ---------- Styles ----------
export const label = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
export const input = "bg-surface-container border-b border-surface-container-highest p-3 text-on-surface focus:border-primary focus:outline-none transition-all w-full";
export const btn = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50";
export const btnGhost = "border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-4 py-2 hover:text-primary hover:border-primary transition-all disabled:opacity-50";
export const textLink = "text-on-surface-variant hover:text-primary text-sm underline underline-offset-4 disabled:opacity-50";
export const hairline = "border-surface-container-highest";
export const errorText = "text-error text-sm font-label-bold";
export const okText = "text-primary text-sm font-label-bold";

// ---------- Lunch ----------
// Lunch break options (minutes). Legacy entries stored a boolean (true = 30 min).
export const LUNCH_OPTIONS = [
  { v: 0, label: "No lunch" },
  { v: 30, label: "30 min" },
  { v: 45, label: "45 min" },
  { v: 60, label: "1 hour" },
  { v: 90, label: "1.5 hours" },
];
export const lunchToMins = (l: number | boolean) => (l === true ? 30 : Math.max(0, Number(l) || 0));
export const lunchLabel = (l: number | boolean) => {
  const n = lunchToMins(l);
  if (!n) return "no lunch";
  if (n % 60 === 0) return `${n / 60} hr lunch`;
  if (n > 60) return `${Math.floor(n / 60)} hr ${n % 60} min lunch`;
  return `${n} min lunch`;
};

// ---------- Dates, money ----------
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const money = (n: number) => `$${(Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const money0 = (n: number) => "$" + Math.round(n || 0).toLocaleString("en-US");
export const hrs = (n: number) => (Number(n) || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
export const fmtDay = (iso: string) => utc(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
export const fmtDate = (iso: string) => utc(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const fmtWeek = (iso: string) => utc(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const fmtStamp = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export const fmtTime = (t: string) => {
  if (!/^\d{2}:\d{2}$/.test(t || "")) return t || "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export function addDays(dateStr: string, n: number) {
  const d = utc(dateStr);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
// Workweek key for a YYYY-MM-DD date (UTC-safe). startDay: 0=Sun … 6=Sat.
export function weekStart(dateStr: string, startDay = 0) {
  const d = utc(dateStr);
  const off = (d.getUTCDay() - startDay + 7) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
}
export const fmtPhone = (p: string) => {
  const d = (p || "").replace(/\D/g, "").replace(/^1/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : p;
};
export const mapLink = (l: Loc) => `https://www.google.com/maps?q=${l.lat},${l.lng}`;
export const LOC_NOTE: Record<string, string> = {
  denied: "location turned off on the phone",
  timeout: "no signal for location",
  unavailable: "location not available",
};

// ---------- Payroll ----------
export type PayLine = { kind: "Regular" | "Overtime"; hours: number; rate: number; amount: number };
export type PayrollRow = { key: string; employee: string; week: string; reg: number; ot: number; total: number; gross: number; shifts: Entry[]; lines: PayLine[] };
// Per employee, per workweek: regular hours up to 40, the rest at 1.5x, using each shift's own rate.
export function computePayroll(entries: Entry[], startDay = 0): PayrollRow[] {
  const groups = new Map<string, Entry[]>();
  for (const e of entries) {
    const key = `${e.employeeId || e.employeeName}|${weekStart(e.date, startDay)}`;
    const arr = groups.get(key) || [];
    arr.push(e);
    groups.set(key, arr);
  }
  const rows: PayrollRow[] = [];
  for (const [key, list] of Array.from(groups.entries())) {
    const week = key.split("|")[1];
    const shifts = [...list].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
    let cum = 0, reg = 0, ot = 0, gross = 0;
    const lines = new Map<string, PayLine>();
    const add = (kind: PayLine["kind"], hours: number, rate: number) => {
      if (hours <= 0) return;
      const k = `${kind}|${rate}`;
      const cur = lines.get(k) || { kind, hours: 0, rate, amount: 0 };
      cur.hours += hours; cur.amount += hours * rate;
      lines.set(k, cur);
    };
    for (const e of shifts) {
      const h = e.hours || 0;
      const regPart = Math.min(h, Math.max(0, 40 - cum));
      const otPart = h - regPart;
      reg += regPart; ot += otPart; gross += regPart * e.rate + otPart * e.rate * 1.5; cum += h;
      add("Regular", regPart, e.rate);
      add("Overtime", otPart, r2(e.rate * 1.5));
    }
    rows.push({
      key, employee: shifts[0].employeeName, week, reg: r2(reg), ot: r2(ot), total: r2(reg + ot), gross: r2(gross), shifts,
      lines: Array.from(lines.values()).map((l) => ({ ...l, hours: r2(l.hours), amount: r2(l.amount) })).sort((a, b) => a.kind.localeCompare(b.kind) * -1 || a.rate - b.rate),
    });
  }
  rows.sort((a, b) => b.week.localeCompare(a.week) || a.employee.localeCompare(b.employee));
  return rows;
}

// A shift counts toward a job by its id. Shifts logged before ids existed match on the name.
export const entryIsForJob = (e: Entry, j: Job) => (e.jobId ? e.jobId === j.id : !!e.jobName && e.jobName === j.name);
export function laborForJob(job: Job, entries: Entry[]) {
  let hours = 0, pay = 0;
  for (const e of entries) { if (entryIsForJob(e, job)) { hours += e.hours || 0; pay += e.pay || 0; } }
  return { hours, pay };
}

// ---------- Files ----------
export const csvText = (rows: unknown[][]) => rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
export function downloadFile(name: string, content: string, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- Small pieces ----------
// A heading over a hairline, with room for an action on the right.
export function SectionHead({ title, note, children }: { title: string; note?: string; children?: React.ReactNode }) {
  return (
    <div className={`border-b ${hairline} pb-3 mb-4`}>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h3 className="font-headline-md text-headline-md uppercase">{title}</h3>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
      {note && <p className="text-on-surface-variant text-sm mt-1 max-w-2xl">{note}</p>}
    </div>
  );
}

// Totals as one sentence: bold number, plain label.
export function Counts({ items }: { items: { n: string; label: string; tone?: "good" | "bad" }[] }) {
  return (
    <p className="text-on-surface-variant text-lg leading-relaxed">
      {items.map((it, i) => (
        <span key={it.label}>
          <strong className={`font-label-bold ${it.tone === "good" ? "text-[#5ec26a]" : it.tone === "bad" ? "text-error" : "text-on-surface"}`}>{it.n}</strong> {it.label}
          {i < items.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export function PasscodeField({ id, value, onChange, placeholder, autoComplete }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} className={`${input} pr-20`} type={show ? "text" : "password"} autoComplete={autoComplete || "off"} autoCapitalize="none" spellCheck={false}
        maxLength={64} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      <button type="button" onClick={() => setShow(!show)} aria-pressed={show} aria-label={show ? "Hide passcode" : "Show passcode"}
        className="absolute right-0 top-0 h-full px-4 text-on-surface-variant hover:text-primary text-xs uppercase tracking-widest font-label-bold">{show ? "Hide" : "Show"}</button>
    </div>
  );
}

// An on/off switch with its label. A checkbox underneath, so it works with a keyboard and a screen reader.
export function Toggle({ id, checked, onChange, children, disabled }: { id: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <label htmlFor={id} className={`flex items-start gap-3 ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <input id={id} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#d32f2f]" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-on-surface">{children}</span>
    </label>
  );
}
