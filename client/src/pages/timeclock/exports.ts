// Files that carry hours into QuickBooks so nobody retypes them.
//
// QuickBooks Online has no time import of its own. It takes this CSV through an
// importer app (Transaction Pro or SaasAnt Transactions); the columns below are
// Transaction Pro's, and SaasAnt maps them on its import screen.
// QuickBooks Desktop takes a tab-separated IIF file of time activities.
// Both files carry net hours, after the unpaid lunch.
import { Entry, Job, QbSettings, csvText, r2, weekStart } from "./shared";

const usDate = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${m}/${d}/${y}`; };
const usDatePadded = (iso: string) => { const [y, m, d] = iso.split("-"); return `${m}/${d}/${y}`; };
// QuickBooks matches a shift to a customer by name, so use the customer on the job when there is one.
const customerFor = (e: Entry, jobs: Job[]) => {
  const j = jobs.find((x) => (e.jobId ? x.id === e.jobId : x.name === e.jobName));
  return (j?.customer || e.jobName || "").trim();
};
const noteFor = (e: Entry, jobs: Job[]) => {
  const j = jobs.find((x) => (e.jobId ? x.id === e.jobId : x.name === e.jobName));
  return [j?.workType, e.address].filter(Boolean).join(", ");
};
const byDate = (list: Entry[]) => [...list].sort((a, b) => (a.date + a.employeeName + (a.createdAt || "")).localeCompare(b.date + b.employeeName + (b.createdAt || "")));

export function qboCsv(entries: Entry[], jobs: Job[], qb: QbSettings) {
  const head = ["TXNDATE", "NAME", "TIME", "DESCRIPTION", "BILLABLESTATUS", "CUSTOMER", "SERVICEITEM"];
  const rows = byDate(entries).filter((e) => e.hours > 0).map((e) => [usDatePadded(e.date), e.employeeName, r2(e.hours), noteFor(e, jobs), "NotBillable", customerFor(e, jobs), qb.serviceItem]);
  return csvText([head, ...rows]);
}

const tab = (v: unknown) => String(v ?? "").replace(/[\t\r\n]+/g, " ").trim();
const duration = (hours: number) => { const mins = Math.round(hours * 60); return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`; };

// One line per shift. A shift that crosses 40 hours in its workweek is split so the
// hours past 40 land on the overtime payroll item.
export function desktopIif(entries: Entry[], jobs: Job[], qb: QbSettings, startDay: number) {
  const lines: string[] = [];
  if (qb.companyName.trim() && qb.companyCreateTime.trim()) {
    lines.push(["!TIMERHDR", "VER", "REL", "COMPANYNAME", "IMPORTEDBEFORE", "FROMTIMER", "COMPANYCREATETIME"].join("\t"));
    lines.push(["TIMERHDR", "8", "0", tab(qb.companyName), "N", "Y", tab(qb.companyCreateTime)].join("\t"));
  }
  lines.push(["!TIMEACT", "DATE", "JOB", "EMP", "ITEM", "PITEM", "DURATION", "PROJ", "NOTE", "XFERTOPAYROLL", "BILLINGSTATUS"].join("\t"));
  const soFar = new Map<string, number>();
  const chrono = [...entries].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
  const out: { e: Entry; hours: number; item: string }[] = [];
  for (const e of chrono) {
    const key = `${e.employeeId || e.employeeName}|${weekStart(e.date, startDay)}`;
    const cum = soFar.get(key) || 0;
    const reg = Math.min(e.hours, Math.max(0, 40 - cum));
    const ot = r2(e.hours - reg);
    soFar.set(key, cum + e.hours);
    if (reg > 0) out.push({ e, hours: reg, item: qb.payrollItem });
    if (ot > 0) out.push({ e, hours: ot, item: qb.otPayrollItem || qb.payrollItem });
  }
  out.sort((a, b) => (a.e.date + a.e.employeeName).localeCompare(b.e.date + b.e.employeeName));
  for (const { e, hours, item } of out) {
    lines.push(["TIMEACT", usDate(e.date), tab(customerFor(e, jobs)), tab(e.employeeName), tab(qb.serviceItem), tab(item), duration(hours), "", tab(noteFor(e, jobs)), "Y", "0"].join("\t"));
  }
  return lines.join("\r\n") + "\r\n";
}
