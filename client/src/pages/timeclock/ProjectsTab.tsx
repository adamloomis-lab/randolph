import { useMemo, useState } from "react";
import { Entry, Job, JobStatus, JOB_STATUS_LABEL, Material, PostFn, Refresh, Counts, SectionHead, btn, csvText, downloadFile, errorText, hairline, laborForJob, money0 as money } from "./shared";

const matTotalOf = (j: Job) => (j.materials || []).reduce((s, m) => s + (m.amount || 0), 0);

/* ---------------- Projects: profit & loss per job (admin only) ---------------- */
export default function ProjectsTab({ jobs, entries, post, onChange }: { jobs: Job[]; entries: Entry[]; post: PostFn; onChange: Refresh }) {
  // Portfolio totals across jobs that have a contract value entered (real priced projects).
  const totals = useMemo(() => {
    let revenue = 0, cost = 0, count = 0;
    for (const j of jobs) {
      const value = j.contractValue || 0;
      if (value <= 0) continue;
      revenue += value; cost += laborForJob(j, entries).pay + matTotalOf(j); count++;
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
      const c = m.get(type) || { count: 0, revenue: 0, cost: 0 };
      c.count++; c.revenue += value; c.cost += laborForJob(j, entries).pay + matTotalOf(j); m.set(type, c);
    }
    return Array.from(m.entries())
      .map(([type, d]) => ({ type, count: d.count, revenue: d.revenue, profit: d.revenue - d.cost, margin: d.revenue > 0 ? ((d.revenue - d.cost) / d.revenue) * 100 : 0 }))
      .sort((a, b) => b.margin - a.margin);
  }, [jobs, entries]);

  const csv = () => {
    const head = ["Project", "Status", "Contract Value", "Labor Hours", "Labor $", "Materials $", "Total Cost", "Profit", "Margin %"];
    const rows = jobs.filter((j) => (j.contractValue || 0) > 0).map((j) => {
      const l = laborForJob(j, entries);
      const mat = matTotalOf(j);
      const cost = l.pay + mat; const value = j.contractValue || 0; const profit = value - cost;
      return [j.name, j.status || "active", value, l.hours.toFixed(2), Math.round(l.pay), Math.round(mat), Math.round(cost), Math.round(profit), (value > 0 ? (profit / value) * 100 : 0).toFixed(1)];
    });
    downloadFile("randolph-projects-pnl.csv", csvText([head, ...rows]));
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-on-surface-variant text-sm max-w-2xl">Your money side, private to you. Add the contract value and materials for a job and the labor pulls straight from the time clock. Profit and margin add up automatically, and every job stays on file so you can look back years later.</p>
        <Counts items={[
          { n: money(totals.revenue), label: `revenue across ${totals.count} priced job${totals.count === 1 ? "" : "s"}` },
          { n: money(totals.cost), label: "cost" },
          { n: money(totals.profit), label: "profit", tone: totals.profit >= 0 ? "good" : "bad" },
          { n: `${totals.margin.toFixed(0)}%`, label: "average margin" },
        ]} />
      </div>

      {byType.length > 0 && (
        <div>
          <SectionHead title="Profit by Type of Work" note="Across all priced jobs. Shows which kind of work actually makes you money, so you know what to chase." />
          <ul>
            {byType.map((r) => (
              <li key={r.type} className={`py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`}>
                <span className="font-label-bold min-w-[9rem] flex-1 break-words">{r.type}</span>
                <span className="text-on-surface-variant">{r.count} job{r.count === 1 ? "" : "s"}</span>
                <span className="text-on-surface-variant">{money(r.revenue)} revenue</span>
                <span className={`font-label-bold ${r.profit >= 0 ? "text-[#5ec26a]" : "text-error"}`}>{money(r.profit)} profit</span>
                <span className="font-label-bold text-primary">{r.margin.toFixed(0)}% margin</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <SectionHead title="Jobs">
          <button className={btn} onClick={csv} disabled={totals.count === 0}>Export P&amp;L CSV</button>
        </SectionHead>
        {jobs.length === 0 && <p className="text-on-surface-variant">No jobs yet. Add one under the Jobs tab first.</p>}
        <div className="space-y-10">
          {sorted.map((j) => <ProjectCard key={j.id} job={j} labor={laborForJob(j, entries)} post={post} onChange={onChange} />)}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ job, labor, post, onChange }: { job: Job; labor: { hours: number; pay: number }; post: PostFn; onChange: Refresh }) {
  const [value, setValue] = useState(job.contractValue ? String(job.contractValue) : "");
  const [materials, setMaterials] = useState<Material[]>(job.materials?.length ? job.materials.map((m) => ({ ...m })) : []);
  const [estH, setEstH] = useState(job.estHours ? String(job.estHours) : "");
  const [estL, setEstL] = useState(job.estLabor ? String(job.estLabor) : "");
  const [estM, setEstM] = useState(job.estMaterials ? String(job.estMaterials) : "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

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
    setBusy(true); setErr("");
    try {
      await post({ action: "save-job", job: { id: job.id, contractValue: v, materials: materials.map((m) => ({ desc: m.desc, amount: Number(m.amount) || 0 })), estHours: eH, estLabor: eL, estMaterials: eM } });
      setSaved(true); setTimeout(() => setSaved(false), 1600); await onChange();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  const status = (job.status || "active") as JobStatus;
  const mInput = `bg-surface-container border-b ${hairline} p-2 text-on-surface focus:border-primary focus:outline-none w-full min-w-0`;
  const line = `flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 border-b ${hairline}`;
  const pid = `p-${job.id}`;
  const over = (n: number) => (n > 0 ? "text-error" : "text-[#5ec26a]");

  return (
    <section aria-label={job.name}>
      <div className={`flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2 ${hairline}`}>
        <h4 className="font-headline-md text-headline-md uppercase break-words min-w-0">{job.customer || job.name}{job.workType ? `, ${job.workType}` : ""}</h4>
        <span className="text-xs font-label-bold uppercase tracking-widest text-on-surface-variant">{JOB_STATUS_LABEL[status]}</span>
      </div>

      <div className={line}>
        <label htmlFor={`${pid}-value`} className="text-on-surface">Contract value <span className="text-on-surface-variant text-xs">(approved estimate)</span></label>
        <div className="flex items-center gap-1 w-40"><span className="text-on-surface-variant">$</span><input id={`${pid}-value`} className={mInput} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
      </div>

      <div className={`py-3 border-b ${hairline}`}>
        <div className="text-on-surface mb-2">Your bid <span className="text-on-surface-variant text-xs">(what you estimated, optional)</span></div>
        <div className="grid grid-cols-3 gap-2">
          <div><label htmlFor={`${pid}-eh`} className="block text-on-surface-variant text-xs mb-1">Est. hours</label><input id={`${pid}-eh`} className={mInput} inputMode="decimal" value={estH} onChange={(e) => setEstH(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
          <div><label htmlFor={`${pid}-el`} className="block text-on-surface-variant text-xs mb-1">Est. labor $</label><input id={`${pid}-el`} className={mInput} inputMode="decimal" value={estL} onChange={(e) => setEstL(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
          <div><label htmlFor={`${pid}-em`} className="block text-on-surface-variant text-xs mb-1">Est. materials $</label><input id={`${pid}-em`} className={mInput} inputMode="decimal" value={estM} onChange={(e) => setEstM(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" /></div>
        </div>
      </div>

      <div className={line}>
        <span className="text-on-surface">Labor <span className="text-primary text-xs">{labor.hours.toFixed(1)} hrs, from the time clock</span></span>
        <span className="font-label-bold">{money(labor.pay)}</span>
      </div>

      <div className={`py-3 border-b ${hairline}`}>
        <div className="flex items-center justify-between mb-2"><span className="text-on-surface">Materials <span className="text-on-surface-variant text-xs">(itemized)</span></span><span className="font-label-bold">{money(matTotal)}</span></div>
        <div className="space-y-2">
          {materials.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input aria-label={`Material ${i + 1} description`} className={`${mInput} flex-1`} value={m.desc} onChange={(e) => setLine(i, { desc: e.target.value })} placeholder="e.g. Block & stone" />
              <div className="flex items-center gap-1 w-28 shrink-0"><span className="text-on-surface-variant">$</span><input aria-label={`Material ${i + 1} cost`} className={mInput} inputMode="decimal" value={m.amount || ""} onChange={(e) => setLine(i, { amount: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })} placeholder="0" /></div>
              <button type="button" onClick={() => rmLine(i)} className="text-on-surface-variant hover:text-error text-sm px-2 py-1" aria-label={`Remove material ${i + 1}`}>✕</button>
            </div>
          ))}
          <button type="button" onClick={addLine} className="text-primary text-sm font-label-bold hover:underline">+ Add line item</button>
        </div>
      </div>

      <div className={line}>
        <span className="text-on-surface">Total cost <span className="text-on-surface-variant text-xs">(labor + materials)</span></span>
        <span className="font-label-bold">{money(cost)}</span>
      </div>

      {hasBid && (
        <div className={`py-3 border-b ${hairline} text-sm space-y-1`}>
          <div className="text-on-surface-variant text-xs uppercase tracking-widest font-label-bold">Bid against actual</div>
          {eH > 0 && <p>Hours: bid {eH.toFixed(0)}, actual {labor.hours.toFixed(1)}, <span className={`font-label-bold ${over(labor.hours - eH)}`}>{labor.hours - eH > 0 ? "over by" : "under by"} {Math.abs(labor.hours - eH).toFixed(1)}</span></p>}
          <p>Cost: bid {money(estCost)}, actual {money(cost)}, <span className={`font-label-bold ${over(cost - estCost)}`}>{cost - estCost > 0 ? "over by" : "under by"} {money(Math.abs(cost - estCost))}</span></p>
          {v > 0 && <p>Margin: bid {estMargin.toFixed(0)}%, actual {margin.toFixed(0)}%, <span className={`font-label-bold ${over(estMargin - margin)}`}>{margin - estMargin >= 0 ? "up" : "down"} {Math.abs(margin - estMargin).toFixed(0)} points</span></p>}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
        <p className="text-lg">
          {v > 0
            ? <><strong className={`font-display-lg text-3xl ${profit >= 0 ? "text-[#5ec26a]" : "text-error"}`}>{money(profit)}</strong> <span className="text-on-surface-variant">profit at</span> <strong className="font-display-lg text-3xl text-primary">{margin.toFixed(0)}%</strong> <span className="text-on-surface-variant">margin</span></>
            : <span className="text-on-surface-variant text-sm">Add a contract value to see profit.</span>}
        </p>
        <button className={btn} disabled={busy} onClick={save}>{busy ? "Saving…" : saved ? "Saved" : "Save"}</button>
      </div>
      {err && <p role="alert" className={`${errorText} mt-2`}>{err}</p>}
    </section>
  );
}
