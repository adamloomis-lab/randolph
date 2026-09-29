import { useMemo, useRef, useState } from "react";
import { Entry, Job, JobStatus, JOB_STATUS_LABEL, PostFn, Refresh, SectionHead, btn, btnGhost, errorText, hairline, hrs, input, label, laborForJob, money, okText, textLink } from "./shared";

/* ---------------- Jobs (with man-hours / labor history) ---------------- */
export default function JobsTab({ jobs, entries, post, onChange }: { jobs: Job[]; entries: Entry[]; post: PostFn; onChange: Refresh }) {
  const blank = { id: "", customer: "", workType: "", address: "", status: "active" as JobStatus };
  const [f, setF] = useState<{ id: string; customer: string; workType: string; address: string; status: JobStatus }>(blank);
  const [err, setErr] = useState("");
  const [rowErr, setRowErr] = useState<{ id: string; note: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    try { await post({ action: "save-job", job: { id: f.id || undefined, customer: f.customer, workType: f.workType, address: f.address, status: f.status } }); setF(blank); await onChange(); }
    catch (e2) { setErr((e2 as Error).message); }
  };
  // For older jobs saved before this split, drop the old name into Customer so it can be tidied up.
  const editJob = (j: Job) => {
    setF({ id: j.id, customer: j.customer || (j.workType ? "" : j.name || ""), workType: j.workType || "", address: j.address || "", status: j.status || "active" });
    // The form sits above the job list on a phone, so bring it into view or Edit looks like it did nothing.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formRef.current?.querySelector("input")?.focus({ preventScroll: true });
  };
  const act = async (id: string, body: Record<string, unknown>) => {
    setRowErr(null);
    try { await post(body); await onChange(); } catch (e2) { setRowErr({ id, note: (e2 as Error).message }); }
  };
  // Quick status change from the job row (merges server-side, so only status changes).
  const setStatus = (j: Job, status: JobStatus) => act(j.id, { action: "save-job", job: { id: j.id, status } });
  const del = (j: Job) => {
    if (!confirm("Remove this job? Its logged hours stay in your records.")) return;
    if (f.id === j.id) setF(blank);
    act(j.id, { action: "delete-job", id: j.id });
  };

  // Show Active first, then Future, then Finished.
  const order: Record<JobStatus, number> = { active: 0, future: 1, finished: 2 };
  const sortedJobs = [...jobs].sort((a, b) => order[a.status || "active"] - order[b.status || "active"]);

  // Hours logged under a job name that no longer matches any job. This happens when a
  // job was renamed or removed before shifts carried the job's id.
  const loose = useMemo(() => {
    const m = new Map<string, { hours: number; pay: number; shifts: number }>();
    for (const e of entries) {
      if (e.jobId || !e.jobName || jobs.some((j) => j.name === e.jobName)) continue;
      const c = m.get(e.jobName) || { hours: 0, pay: 0, shifts: 0 };
      m.set(e.jobName, { hours: c.hours + e.hours, pay: c.pay + e.pay, shifts: c.shifts + 1 });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].hours - a[1].hours);
  }, [entries, jobs]);

  return (
    <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-x-12 gap-y-12">
      <form ref={formRef} onSubmit={save} className="space-y-5 h-fit scroll-mt-32">
        <SectionHead title={f.id ? "Edit Job" : "Add a Job"} note="Only Active jobs show in the crew's dropdown. Future and Finished jobs are hidden from them, so their list stays short." />
        <div><label className={label} htmlFor="job-customer">Customer</label><input id="job-customer" className={input} value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value })} placeholder="e.g. Chick-fil-A or Mr. Smith" /></div>
        <div><label className={label} htmlFor="job-type">Type of Work</label><input id="job-type" className={input} value={f.workType} onChange={(e) => setF({ ...f, workType: e.target.value })} placeholder="e.g. Retaining Wall" /></div>
        <div><label className={label} htmlFor="job-addr">Job Site Address</label><input id="job-addr" className={input} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="123 Main St, Wadsworth, OH" /></div>
        <div><label className={label} htmlFor="job-status">Status</label>
          <select id="job-status" className={input} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as JobStatus })}>
            <option value="active">Active (crew can pick it)</option>
            <option value="future">Future (hidden from crew)</option>
            <option value="finished">Finished (hidden from crew)</option>
          </select>
        </div>
        {f.id && <p className="text-on-surface-variant text-xs">Renaming a job keeps every hour already logged against it.</p>}
        {err && <p role="alert" className={errorText}>{err}</p>}
        <div className="flex gap-3">
          <button className={btn}>{f.id ? "Save Changes" : "Add Job"}</button>
          {f.id && <button type="button" className={btnGhost} onClick={() => setF(blank)}>Cancel</button>}
        </div>
      </form>

      <div className="min-w-0 space-y-12">
        <div>
          <SectionHead title={`Jobs (${jobs.length})`} />
          {jobs.length === 0 && <p className="text-on-surface-variant">No jobs yet.</p>}
          <ul>
            {sortedJobs.map((j) => {
              const s = laborForJob(j, entries);
              const status = (j.status || "active") as JobStatus;
              return (
                <li key={j.id} className={`py-4 border-b ${hairline} ${status !== "active" ? "opacity-75" : ""}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <div className="font-label-bold break-words">{j.customer || j.name}{j.workType ? <span className="text-on-surface-variant font-normal">, {j.workType}</span> : null}</div>
                      <div className="text-on-surface-variant text-sm break-words">{j.address || "No address saved"}</div>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-4">
                      <button className={btnGhost} onClick={() => editJob(j)}>Edit</button>
                      <button className="text-on-surface-variant hover:text-error text-sm underline underline-offset-4" onClick={() => del(j)}>Remove</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-sm">
                    <label className="flex items-center gap-2 text-on-surface-variant">
                      <span className="text-xs uppercase tracking-wider font-label-bold">Status</span>
                      <select aria-label={`Status for ${j.name}`} className={`bg-surface-container border ${hairline} text-on-surface text-sm px-2 py-1 focus:border-primary focus:outline-none`} value={status} onChange={(e) => setStatus(j, e.target.value as JobStatus)}>
                        {(Object.keys(JOB_STATUS_LABEL) as JobStatus[]).map((k) => <option key={k} value={k}>{JOB_STATUS_LABEL[k]}</option>)}
                      </select>
                    </label>
                    <span className="text-on-surface-variant"><span className="text-primary font-label-bold">{hrs(s.hours)} man-hours</span>, {money(s.pay)} labor to date</span>
                  </div>
                  {rowErr?.id === j.id && <p role="alert" className={`${errorText} mt-2`}>{rowErr.note}</p>}
                </li>
              );
            })}
          </ul>
          <p className="text-on-surface-variant/70 text-xs pt-3">Labor shown is straight-time hours logged against each job, totaled across all time.</p>
        </div>

        {loose.length > 0 && (
          <div>
            <SectionHead title="Hours Not Tied to a Job" note="These were logged under a job name that has since changed or been removed, so they are not counting toward any job. Pick the job each one belongs to." />
            <ul>
              {loose.map(([name, v]) => <LooseRow key={name} name={name} v={v} jobs={sortedJobs} post={post} onChange={onChange} />)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function LooseRow({ name, v, jobs, post, onChange }: { name: string; v: { hours: number; pay: number; shifts: number }; jobs: Job[]; post: PostFn; onChange: Refresh }) {
  const [jobId, setJobId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");
  const link = async () => {
    setErr(""); setBusy(true);
    try { const d = await post({ action: "link-job-name", jobName: name, jobId }); setDone(`${d.linked} shift${d.linked === 1 ? "" : "s"} tied to that job.`); await onChange(); }
    catch (e2) { setErr((e2 as Error).message); }
    finally { setBusy(false); }
  };
  return (
    <li className={`py-3 border-b ${hairline} flex flex-wrap items-center gap-x-4 gap-y-2`}>
      <span className="min-w-0 flex-1 break-words"><span className="font-label-bold">{name}</span> <span className="text-on-surface-variant text-sm">{v.shifts} shift{v.shifts === 1 ? "" : "s"}, {hrs(v.hours)} hrs, {money(v.pay)}</span></span>
      <select aria-label={`Job for hours logged as ${name}`} className={`bg-surface-container border ${hairline} text-on-surface text-sm px-2 py-2 max-w-full focus:border-primary focus:outline-none`} value={jobId} onChange={(e) => setJobId(e.target.value)}>
        <option value="">Pick the job…</option>
        {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
      </select>
      <button className={textLink} disabled={!jobId || busy} onClick={link}>{busy ? "Saving…" : "Tie to this job"}</button>
      {err && <p role="alert" className={`${errorText} basis-full`}>{err}</p>}
      {done && <p role="status" className={`${okText} basis-full`}>{done}</p>}
    </li>
  );
}
