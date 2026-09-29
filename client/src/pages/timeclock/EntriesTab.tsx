import { useMemo, useState } from "react";
import {
  Entry, Job, PostFn, Refresh, LUNCH_OPTIONS, LOC_NOTE, Counts, SectionHead, btn, btnGhost, csvText, downloadFile, errorText, fmtDay, fmtStamp, fmtTime,
  hairline, hrs, input, label, lunchLabel, lunchToMins, mapLink, money, textLink,
} from "./shared";

const PAGE = 100;

/* ---------------- Entries + reporting ---------------- */
export default function EntriesTab({ entries, jobs, lockedThrough, trashCount, showLocation, post, onChange }: {
  entries: Entry[]; jobs: Job[]; lockedThrough: string | null; trashCount: number; showLocation: boolean; post: PostFn; onChange: Refresh;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [emp, setEmp] = useState("");
  const [job, setJob] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [saveErr, setSaveErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [trash, setTrash] = useState<Entry[] | null>(null);
  const [trashErr, setTrashErr] = useState("");

  const empNames = useMemo(() => Array.from(new Set(entries.map((e) => e.employeeName))).sort(), [entries]);
  const jobNames = useMemo(() => Array.from(new Set(entries.map((e) => e.jobName).filter(Boolean))).sort(), [entries]);

  const filtered = entries.filter((e) =>
    (!from || e.date >= from) && (!to || e.date <= to) && (!emp || e.employeeName === emp) && (!job || e.jobName === job));

  const totalHrs = filtered.reduce((s, e) => s + e.hours, 0);
  const totalPay = filtered.reduce((s, e) => s + e.pay, 0);

  const byKey = (key: "employeeName" | "jobName") => {
    const m = new Map<string, { hours: number; pay: number }>();
    for (const e of filtered) {
      const k = (e[key] as string) || "(no job picked)";
      const cur = m.get(k) || { hours: 0, pay: 0 };
      m.set(k, { hours: cur.hours + e.hours, pay: cur.pay + e.pay });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].pay - a[1].pay);
  };

  const csv = () => {
    const head = ["Date", "Employee", "Job", "Address", "Clock In", "Clock Out", "Lunch (min)", "Hours", "Rate", "Pay"];
    const rows = filtered.map((e) => [e.date, e.employeeName, e.jobName, e.address, e.clockIn, e.clockOut, lunchToMins(e.lunch), e.hours, e.rate, e.pay]);
    downloadFile(`randolph-hours${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`, csvText([head, ...rows]));
  };

  const del = async (id: string) => {
    if (!confirm("Delete this shift? It stays in Deleted Shifts for 90 days in case you need it back.")) return;
    await post({ action: "delete-entry", id });
    setTrash(null); onChange();
  };
  const saveEdit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaveErr("");
    if (!editing) return;
    setBusy(true);
    try {
      await post({ action: "update-entry", id: editing.id, date: editing.date, clockIn: editing.clockIn, clockOut: editing.clockOut, lunch: lunchToMins(editing.lunch), jobId: editing.jobId || "", jobName: editing.jobName, address: editing.address });
      setEditing(null); await onChange();
    } catch (e2) { setSaveErr((e2 as Error).message); }
    finally { setBusy(false); }
  };
  const openTrash = async () => {
    setTrashErr("");
    if (trash) return setTrash(null);
    try { setTrash((await post({ action: "admin-trash" })).trash || []); } catch (e2) { setTrashErr((e2 as Error).message); }
  };
  const restore = async (id: string) => {
    setTrashErr("");
    try { await post({ action: "restore-entry", id }); setTrash((await post({ action: "admin-trash" })).trash || []); onChange(); }
    catch (e2) { setTrashErr((e2 as Error).message); }
  };

  // The job picker works by id. A shift logged under an old name keeps that name as its own option.
  const editingJobValue = editing ? (editing.jobId || (editing.jobName ? `name:${editing.jobName}` : "")) : "";
  const pickJob = (v: string) => {
    if (!editing) return;
    const j = jobs.find((x) => x.id === v);
    if (j) setEditing({ ...editing, jobId: j.id, jobName: j.name, address: j.address || editing.address });
    else if (!v) setEditing({ ...editing, jobId: "", jobName: "" });
  };

  return (
    <div className="space-y-10">
      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(ev) => ev.stopPropagation()} onSubmit={saveEdit} role="dialog" aria-modal="true" aria-label={`Edit shift for ${editing.employeeName}`}
            className="bg-surface-container-lowest border-2 border-primary p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline-md text-headline-md uppercase">Edit Shift: {editing.employeeName}</h3>
            <div><label className={label} htmlFor="ed-date">Date</label><input id="ed-date" type="date" className={input} value={editing.date} onChange={(ev) => setEditing({ ...editing, date: ev.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label} htmlFor="ed-in">Clock In</label><input id="ed-in" type="time" className={input} value={editing.clockIn} onChange={(ev) => setEditing({ ...editing, clockIn: ev.target.value })} /></div>
              <div><label className={label} htmlFor="ed-out">Clock Out</label><input id="ed-out" type="time" className={input} value={editing.clockOut} onChange={(ev) => setEditing({ ...editing, clockOut: ev.target.value })} /></div>
            </div>
            <div><label className={label} htmlFor="ed-lunch">Lunch Break</label>
              <select id="ed-lunch" className={input} value={lunchToMins(editing.lunch)} onChange={(ev) => setEditing({ ...editing, lunch: Number(ev.target.value) })}>
                {LUNCH_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                {!LUNCH_OPTIONS.some((o) => o.v === lunchToMins(editing.lunch)) && <option value={lunchToMins(editing.lunch)}>{lunchLabel(editing.lunch)}</option>}
              </select>
            </div>
            <div><label className={label} htmlFor="ed-job">Job</label>
              <select id="ed-job" className={input} value={editingJobValue} onChange={(ev) => pickJob(ev.target.value)}>
                <option value="">No job picked</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                {editingJobValue.startsWith("name:") && <option value={editingJobValue}>{editing.jobName} (old name)</option>}
              </select>
            </div>
            <div><label className={label} htmlFor="ed-addr">Address</label><input id="ed-addr" className={input} value={editing.address} onChange={(ev) => setEditing({ ...editing, address: ev.target.value })} /></div>
            {saveErr && <p role="alert" className={errorText}>{saveErr}</p>}
            <div className="flex gap-3"><button className={btn} disabled={busy}>{busy ? "Saving…" : "Save"}</button><button type="button" className={btnGhost} onClick={() => setEditing(null)}>Cancel</button></div>
            <p className="text-on-surface-variant/70 text-xs">Hours and pay recalculate when you save, at the rate this shift was logged at.</p>
            {!!editing.history?.length && (
              <div className={`border-t ${hairline} pt-3`}>
                <div className="text-on-surface-variant text-xs uppercase tracking-widest font-label-bold mb-2">Earlier versions</div>
                <ul className="space-y-1 text-on-surface-variant text-xs">
                  {editing.history.map((h, i) => (
                    <li key={i}>
                      Until {fmtStamp(h.at)}: {fmtDay(h.before.date)}, {fmtTime(h.before.clockIn)} to {fmtTime(h.before.clockOut)}, {hrs(h.before.hours)} hrs at {money(h.before.rate)}, {money(h.before.pay)}
                      {h.what === "rate" ? " (changed by a raise)" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      )}

      {/* filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><label className={label} htmlFor="f-from">From</label><input id="f-from" type="date" className={input} value={from} onChange={(e) => { setFrom(e.target.value); setShown(PAGE); }} /></div>
        <div><label className={label} htmlFor="f-to">To</label><input id="f-to" type="date" className={input} value={to} onChange={(e) => { setTo(e.target.value); setShown(PAGE); }} /></div>
        <div><label className={label} htmlFor="f-emp">Employee</label><select id="f-emp" className={input} value={emp} onChange={(e) => { setEmp(e.target.value); setShown(PAGE); }}><option value="">All</option>{empNames.map((n) => <option key={n}>{n}</option>)}</select></div>
        <div><label className={label} htmlFor="f-job">Job</label><select id="f-job" className={input} value={job} onChange={(e) => { setJob(e.target.value); setShown(PAGE); }}><option value="">All</option>{jobNames.map((n) => <option key={n}>{n}</option>)}</select></div>
      </div>

      <Counts items={[
        { n: filtered.length.toLocaleString("en-US"), label: filtered.length === 1 ? "shift" : "shifts" },
        { n: hrs(totalHrs), label: "hours" },
        { n: money(totalPay), label: "in pay before overtime" },
      ]} />

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        <RollUp title="By Employee" rows={byKey("employeeName")} />
        <RollUp title="By Job" rows={byKey("jobName")} />
      </div>

      <div>
        <SectionHead title="Shifts">
          <button className={btn} onClick={csv} disabled={!filtered.length}>Export CSV</button>
        </SectionHead>
        {filtered.length === 0 && <p className="py-6 text-on-surface-variant">No shifts match.</p>}
        <ul>
          {filtered.slice(0, shown).map((e) => {
            const isLocked = !!lockedThrough && e.date <= lockedThrough;
            return (
              <li key={e.id} className={`py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`}>
                <span className="w-28 shrink-0 text-on-surface-variant">{fmtDay(e.date)}</span>
                <span className="font-label-bold min-w-[9rem] flex-1">{e.employeeName}</span>
                <span className="basis-full md:basis-0 md:flex-[2] min-w-0 text-on-surface-variant break-words">{e.jobName || "No job picked"}</span>
                <span className="text-on-surface-variant text-sm md:w-[17rem] md:text-right">{fmtTime(e.clockIn)} to {fmtTime(e.clockOut)}, {lunchLabel(e.lunch)}</span>
                <span className="font-label-bold md:w-16 md:text-right">{hrs(e.hours)} hrs</span>
                <span className="font-label-bold text-primary md:w-24 md:text-right">{money(e.pay)}</span>
                <span className="ml-auto flex items-baseline justify-end gap-4 md:w-28">
                  {isLocked ? (
                    <span className="text-on-surface-variant/70 text-xs uppercase tracking-wider">Locked</span>
                  ) : (
                    <>
                      <button onClick={() => { setSaveErr(""); setEditing(e); }} className={textLink}>Edit</button>
                      <button onClick={() => del(e.id)} className="text-on-surface-variant hover:text-error text-sm underline underline-offset-4">Delete</button>
                    </>
                  )}
                </span>
                {(showLocation || e.locIn || e.locOut) && (e.locIn || e.locOut || e.locInNote || e.locOutNote) && (
                  <span className="basis-full text-on-surface-variant/80 text-xs">
                    Clocked in: {e.locIn ? <a className="underline underline-offset-2 hover:text-primary" href={mapLink(e.locIn)} target="_blank" rel="noreferrer">see on map</a> : e.source === "manual" ? "logged by hand" : (LOC_NOTE[e.locInNote || ""] || "no location")}
                    {" · "}
                    Clocked out: {e.locOut ? <a className="underline underline-offset-2 hover:text-primary" href={mapLink(e.locOut)} target="_blank" rel="noreferrer">see on map</a> : (LOC_NOTE[e.locOutNote || ""] || "no location")}
                  </span>
                )}
                {!!e.history?.length && <span className="basis-full text-on-surface-variant/70 text-xs">Changed {fmtStamp(e.history[0].at)}. Open Edit to see what it was before.</span>}
              </li>
            );
          })}
        </ul>
        {filtered.length > shown && (
          <div className="pt-5"><button className={btnGhost} onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, filtered.length - shown)} more</button></div>
        )}

        {trashCount > 0 && (
          <div className="pt-8">
            <button className={textLink} onClick={openTrash} aria-expanded={!!trash}>{trash ? "Hide deleted shifts" : `Deleted shifts (${trashCount})`}</button>
            {trashErr && <p role="alert" className={`${errorText} mt-2`}>{trashErr}</p>}
            {trash && (
              <ul className="mt-3">
                {trash.map((e) => (
                  <li key={e.id} className={`py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1 text-on-surface-variant`}>
                    <span className="w-28 shrink-0">{fmtDay(e.date)}</span>
                    <span className="font-label-bold text-on-surface min-w-[9rem] flex-1">{e.employeeName}</span>
                    <span className="text-sm">{fmtTime(e.clockIn)} to {fmtTime(e.clockOut)}, {hrs(e.hours)} hrs, {money(e.pay)}</span>
                    <span className="text-xs">deleted {e.deletedAt ? fmtStamp(e.deletedAt) : ""}</span>
                    <button className={`${textLink} ml-auto`} onClick={() => restore(e.id)}>Put back</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RollUp({ title, rows }: { title: string; rows: [string, { hours: number; pay: number }][] }) {
  return (
    <div>
      <SectionHead title={title} />
      {rows.length === 0 ? <p className="text-on-surface-variant text-sm">Nothing logged in this range.</p> : (
        <ul>
          {rows.map(([k, v]) => (
            <li key={k} className={`flex flex-wrap justify-between items-baseline gap-x-4 py-2 border-b ${hairline}`}>
              <span className="min-w-0 break-words">{k}</span>
              <span className="whitespace-nowrap"><strong className="text-on-surface">{hrs(v.hours)} hrs</strong> <span className="text-primary font-label-bold">{money(v.pay)}</span></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
