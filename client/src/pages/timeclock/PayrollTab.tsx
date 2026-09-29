import { useMemo, useState } from "react";
import PayStubs from "./PayStub";
import { desktopIif, qboCsv } from "./exports";
import {
  DAYS, Entry, Job, OwnerSettings, PayrollRow, PostFn, QbSettings, Refresh, Counts, SectionHead, addDays, btn, btnGhost, computePayroll, csvText, downloadFile,
  errorText, fmtDate, fmtWeek, hairline, hrs, input, label, money, okText, textLink,
} from "./shared";

/* ---------------- Payroll (weekly, with overtime) ---------------- */
export default function PayrollTab({ entries, jobs, settings, post, onChange }: { entries: Entry[]; jobs: Job[]; settings: OwnerSettings; post: PostFn; onChange: Refresh }) {
  const { weekStartDay, lockedThrough } = settings;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lockDate, setLockDate] = useState(lockedThrough || "");
  const [lockErr, setLockErr] = useState("");
  const [stubs, setStubs] = useState<PayrollRow[] | null>(null);

  const saveLock = async (clear = false) => {
    setLockErr("");
    try { await post({ action: "set-lock", lockedThrough: clear ? "" : lockDate }); await onChange(); }
    catch (e) { setLockErr((e as Error).message); }
  };
  const filtered = useMemo(() => entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to)), [entries, from, to]);
  const rows = useMemo(() => computePayroll(filtered, weekStartDay), [filtered, weekStartDay]);
  const weeks = useMemo(() => {
    const m = new Map<string, PayrollRow[]>();
    for (const r of rows) { const list = m.get(r.week) || []; list.push(r); m.set(r.week, list); }
    return Array.from(m.entries());
  }, [rows]);
  const grossTotal = rows.reduce((s, r) => s + r.gross, 0);
  const otTotal = rows.reduce((s, r) => s + r.ot, 0);
  const hoursTotal = rows.reduce((s, r) => s + r.total, 0);

  const csv = () => {
    const head = ["Week of", "Employee", "Regular Hrs", "Overtime Hrs", "Total Hrs", "Gross Pay"];
    downloadFile(`randolph-payroll${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`, csvText([head, ...rows.map((r) => [r.week, r.employee, r.reg, r.ot, r.total, r.gross.toFixed(2)])]));
  };

  return (
    <div className="space-y-12">
      {stubs && <PayStubs rows={stubs} onClose={() => setStubs(null)} />}

      <div>
        <SectionHead title="Lock Payroll" note="Once you've paid a period, lock it so nobody can add or change times on or before that date." />
        {lockedThrough ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-label-bold text-primary uppercase tracking-widest text-sm">Locked through {fmtDate(lockedThrough)}</span>
            <button className={btnGhost} onClick={() => saveLock(true)}>Unlock</button>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <div><label className={label} htmlFor="lock-date">Lock Through</label><input id="lock-date" type="date" className={input} value={lockDate} onChange={(e) => setLockDate(e.target.value)} /></div>
            <button className={btn} disabled={!lockDate} onClick={() => saveLock()}>Lock</button>
          </div>
        )}
        {lockErr && <p role="alert" className={`${errorText} mt-3`}>{lockErr}</p>}
      </div>

      <div>
        <SectionHead title="Weekly Payroll">
          <button className={btn} onClick={csv} disabled={!rows.length}>Export Payroll CSV</button>
        </SectionHead>
        <div className="grid grid-cols-2 gap-4 max-w-md mb-6">
          <div><label className={label} htmlFor="p-from">From</label><input id="p-from" type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><label className={label} htmlFor="p-to">To</label><input id="p-to" type="date" className={input} value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <Counts items={[
          { n: money(grossTotal), label: "gross pay" },
          { n: hrs(hoursTotal), label: "hours" },
          { n: hrs(otTotal), label: "of them overtime" },
        ]} />

        {rows.length === 0 && <p className="py-6 text-on-surface-variant">No hours logged in this range.</p>}
        {weeks.map(([week, list]) => (
          <div key={week} className="mt-8">
            <div className={`flex flex-wrap items-baseline justify-between gap-3 border-b ${hairline} pb-2`}>
              <h4 className="font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant">Week of {fmtWeek(week)} to {fmtWeek(addDays(week, 6))}</h4>
              <span className="flex items-baseline gap-4">
                <span className="font-label-bold text-primary">{money(list.reduce((s, r) => s + r.gross, 0))}</span>
                <button className={textLink} onClick={() => setStubs(list)}>Print pay stubs</button>
              </span>
            </div>
            <ul>
              {list.map((r) => (
                <li key={r.key} className={`py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`}>
                  <span className="font-label-bold min-w-[9rem] flex-1">{r.employee}</span>
                  <span className="text-on-surface-variant">{hrs(r.reg)} regular</span>
                  <span className={r.ot > 0 ? "text-primary font-label-bold" : "text-on-surface-variant"}>{hrs(r.ot)} overtime</span>
                  <span className="font-label-bold">{hrs(r.total)} hrs</span>
                  <span className="font-label-bold text-primary">{money(r.gross)}</span>
                  <button className={`${textLink} ml-auto`} onClick={() => setStubs([r])}>Pay stub</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-on-surface-variant/80 text-xs mt-6">
          Overtime is calculated at 1.5× the hourly rate for hours over 40 in a workweek (starts {DAYS[weekStartDay]}). Gross pay shown is before taxes and withholdings. Change the workweek under Settings.
        </p>
      </div>

      <QuickBooksExport entries={filtered} jobs={jobs} settings={settings} from={from} to={to} post={post} onChange={onChange} />
    </div>
  );
}

/* ---------------- QuickBooks ---------------- */
function QuickBooksExport({ entries, jobs, settings, from, to, post, onChange }: { entries: Entry[]; jobs: Job[]; settings: OwnerSettings; from: string; to: string; post: PostFn; onChange: Refresh }) {
  const [kind, setKind] = useState<"online" | "desktop">("online");
  const [qb, setQb] = useState<QbSettings>(settings.quickbooks);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof QbSettings, v: string) => setQb({ ...qb, [k]: v });
  const noJob = entries.filter((e) => !e.jobName).length;
  const range = `${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}`;

  const download = async () => {
    setErr(""); setMsg("");
    if (kind === "desktop" && !qb.payrollItem.trim()) return setErr("Enter the payroll item name from QuickBooks first.");
    try { await post({ action: "save-settings", quickbooks: qb }); onChange(); }
    catch (e) { return setErr((e as Error).message); }
    if (kind === "online") downloadFile(`randolph-time-quickbooks-online${range}.csv`, qboCsv(entries, jobs, qb));
    else downloadFile(`randolph-time-quickbooks-desktop${range}.iif`, desktopIif(entries, jobs, qb, settings.weekStartDay), "text/plain");
    setMsg(`Downloaded ${entries.length} shift${entries.length === 1 ? "" : "s"}.`);
  };

  return (
    <div>
      <SectionHead title="Send Hours to QuickBooks" note="Downloads the shifts in the date range above as a file QuickBooks can read, so nobody retypes hours. Names have to match QuickBooks exactly: the employee, the customer, and the items below." />
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 max-w-3xl">
        <div className="md:col-span-2 max-w-sm">
          <label className={label} htmlFor="qb-kind">Which QuickBooks</label>
          <select id="qb-kind" className={input} value={kind} onChange={(e) => setKind(e.target.value as "online" | "desktop")}>
            <option value="online">QuickBooks Online</option>
            <option value="desktop">QuickBooks Desktop</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="qb-service">Service item</label>
          <input id="qb-service" className={input} value={qb.serviceItem} onChange={(e) => set("serviceItem", e.target.value)} placeholder="As named in QuickBooks" />
        </div>
        {kind === "desktop" && (
          <>
            <div>
              <label className={label} htmlFor="qb-pay">Payroll item for regular hours</label>
              <input id="qb-pay" className={input} value={qb.payrollItem} onChange={(e) => set("payrollItem", e.target.value)} placeholder="As named in QuickBooks" />
            </div>
            <div>
              <label className={label} htmlFor="qb-ot">Payroll item for overtime</label>
              <input id="qb-ot" className={input} value={qb.otPayrollItem} onChange={(e) => set("otPayrollItem", e.target.value)} placeholder="As named in QuickBooks" />
            </div>
            <div>
              <label className={label} htmlFor="qb-co">Company name (2021 and older only)</label>
              <input id="qb-co" className={input} value={qb.companyName} onChange={(e) => set("companyName", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="qb-cct">Company create time (2021 and older only)</label>
              <input id="qb-cct" className={input} inputMode="numeric" value={qb.companyCreateTime} onChange={(e) => set("companyCreateTime", e.target.value.replace(/\D/g, ""))} />
            </div>
          </>
        )}
      </div>
      <div className="text-on-surface-variant text-sm mt-5 max-w-3xl space-y-2">
        {kind === "online" ? (
          <p>QuickBooks Online cannot import hours by itself. This file loads through an importer app, Transaction Pro or SaasAnt Transactions, and is laid out in their column order.</p>
        ) : (
          <>
            <p>In QuickBooks 2022 and newer, import it under File, Utilities, Import, IIF Files, and leave the two company fields blank.</p>
            <p>In 2021 and older, import it under File, Utilities, Import, Timer Activities. That version needs both company fields. To find them, export Timer Lists from QuickBooks, open that file, and copy the company name and the number at the end of the TIMERHDR line.</p>
          </>
        )}
        {noJob > 0 && <p>{noJob} shift{noJob === 1 ? " has" : "s have"} no job picked, so the customer will be blank. Set the job under Entries first, or QuickBooks will reject those lines.</p>}
      </div>
      {err && <p role="alert" className={`${errorText} mt-4`}>{err}</p>}
      {msg && <p role="status" className={`${okText} mt-4`}>{msg}</p>}
      <div className="mt-5"><button className={btn} onClick={download} disabled={!entries.length}>Download for QuickBooks</button></div>
    </div>
  );
}
