import { useMemo, useState } from "react";
import { Emp, Entry, PostFn, Refresh, SectionHead, btn, btnGhost, errorText, fmtDate, fmtPhone, hairline, input, label, money, textLink, todayStr } from "./shared";

type CrewForm = { name: string; rate: string; pin: string; phone: string; effectiveFrom: string };
const blankCrew = (): CrewForm => ({ name: "", rate: "", pin: "", phone: "", effectiveFrom: todayStr() });
// Returns what's wrong with the form, or "" when it's good to save.
function crewFormError(f: CrewForm) {
  if (!f.name.trim()) return "Enter a name.";
  if (f.rate.trim() === "" || !(Number(f.rate) >= 0)) return "Enter an hourly rate.";
  if (!/^\d{4}$/.test(f.pin)) return "PIN must be 4 digits.";
  const digits = f.phone.replace(/\D/g, "").replace(/^1/, "");
  if (f.phone.trim() && digits.length !== 10) return "The cell number needs all 10 digits.";
  return "";
}

function CrewFields({ f, setF, idPrefix, autoFocus, currentRate, smsOn }: { f: CrewForm; setF: (f: CrewForm) => void; idPrefix: string; autoFocus?: boolean; currentRate?: number; smsOn: boolean }) {
  const rateChanged = currentRate !== undefined && f.rate.trim() !== "" && Number(f.rate) !== currentRate;
  return (
    <>
      <div><label className={label} htmlFor={`${idPrefix}-name`}>Name</label><input id={`${idPrefix}-name`} className={input} autoFocus={autoFocus} autoComplete="off" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><label className={label} htmlFor={`${idPrefix}-rate`}>Hourly Rate ($)</label><input id={`${idPrefix}-rate`} className={input} inputMode="decimal" autoComplete="off" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value.replace(/[^0-9.]/g, "") })} placeholder="25" /></div>
      {rateChanged && (
        <div>
          <label className={label} htmlFor={`${idPrefix}-from`}>New Rate Starts</label>
          <input id={`${idPrefix}-from`} type="date" className={input} value={f.effectiveFrom} onChange={(e) => setF({ ...f, effectiveFrom: e.target.value })} />
          <p className="text-on-surface-variant text-xs mt-1">
            {f.effectiveFrom > todayStr()
              ? `Shifts keep paying ${money(currentRate!)} until that day, then ${money(Number(f.rate))}.`
              : `Shifts already logged on or after this day move to ${money(Number(f.rate))}. Weeks you've locked stay as paid.`}
          </p>
        </div>
      )}
      <div><label className={label} htmlFor={`${idPrefix}-pin`}>4-Digit PIN</label><input id={`${idPrefix}-pin`} className={`${input} tracking-[0.4em]`} inputMode="numeric" autoComplete="off" maxLength={4} value={f.pin} onChange={(e) => setF({ ...f, pin: e.target.value.replace(/\D/g, "") })} placeholder="0000" /></div>
      <div>
        <label className={label} htmlFor={`${idPrefix}-phone`}>Cell Number (optional)</label>
        <input id={`${idPrefix}-phone`} className={input} type="tel" inputMode="tel" autoComplete="off" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="(330) 555-0100" />
        <p className="text-on-surface-variant text-xs mt-1">
          {smsOn ? "Used only to text a reminder when they forget to clock out. Get their OK before adding it." : "For clock-out reminder texts. Texting is not connected yet, so nothing is sent."}
        </p>
      </div>
    </>
  );
}

/* ---------------- Crew ---------------- */
export default function CrewTab({ employees, entries, smsOn, post, onChange }: { employees: Emp[]; entries: Entry[]; smsOn: boolean; post: PostFn; onChange: Refresh }) {
  // Adding a new person uses the form at the top. Editing happens inside that person's own row,
  // so the fields open right where the Edit button was tapped.
  const [f, setF] = useState<CrewForm>(blankCrew);
  const [err, setErr] = useState("");
  const [editId, setEditId] = useState("");
  const [ef, setEf] = useState<CrewForm>(blankCrew);
  const [editErr, setEditErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<{ id: string; note: string } | null>(null);
  const [rowErr, setRowErr] = useState<{ id: string; note: string } | null>(null);
  const [copied, setCopied] = useState("");
  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard unavailable */ }
    setCopied(id); setTimeout(() => setCopied(""), 1500);
  };

  const shiftCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of entries) if (e.employeeId) m.set(e.employeeId, (m.get(e.employeeId) || 0) + 1);
    return m;
  }, [entries]);
  const active = employees.filter((e) => e.active);
  const former = employees.filter((e) => !e.active);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = crewFormError(f);
    setErr(problem);
    if (problem) return;
    try {
      await post({ action: "save-employee", employee: { name: f.name, rate: Number(f.rate), pin: f.pin, phone: f.phone } });
      setF(blankCrew()); await onChange();
    } catch (e2) { setErr((e2 as Error).message); }
  };

  const startEdit = (e: Emp) => { setEditId(e.id); setEf({ name: e.name, rate: String(e.rate), pin: e.pin, phone: e.phone ? fmtPhone(e.phone) : "", effectiveFrom: todayStr() }); setEditErr(""); setRowErr(null); };
  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = crewFormError(ef);
    setEditErr(problem);
    if (problem) return;
    setBusy(true);
    try {
      const d = await post({ action: "save-employee", employee: { id: editId, name: ef.name, rate: Number(ef.rate), pin: ef.pin, phone: ef.phone, effectiveFrom: ef.effectiveFrom } });
      await onChange();
      const parts = ["Changes saved."];
      if (d.rerated) parts.push(`${d.rerated} shift${d.rerated === 1 ? "" : "s"} moved to the new rate.`);
      if (d.lockedSkipped) parts.push(`${d.lockedSkipped} in a locked week stayed as paid.`);
      setSaved({ id: editId, note: parts.join(" ") }); setTimeout(() => setSaved(null), 6000);
      setEditId("");
    } catch (e2) { setEditErr((e2 as Error).message); }
    finally { setBusy(false); }
  };
  const act = async (id: string, body: Record<string, unknown>) => {
    setRowErr(null);
    try { await post(body); if (editId === id) setEditId(""); await onChange(); }
    catch (e2) { setRowErr({ id, note: (e2 as Error).message }); }
  };
  const setActive = (e: Emp, on: boolean) => {
    if (!on && !confirm(`Take ${e.name} off the crew list? They won't be able to clock in. Their hours stay on file and you can bring them back any time.`)) return;
    act(e.id, { action: "set-employee-active", id: e.id, active: on });
  };
  const remove = (e: Emp) => { if (confirm(`Remove ${e.name} for good? This is for someone added by mistake.`)) act(e.id, { action: "delete-employee", id: e.id }); };
  const cancelRaise = (e: Emp) => act(e.id, { action: "save-employee", employee: { id: e.id, cancelNextRate: true } });

  return (
    <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-x-12 gap-y-12">
      <form onSubmit={add} className="space-y-5 h-fit">
        <SectionHead title="Add Crew Member" />
        <CrewFields f={f} setF={setF} idPrefix="crew-add" smsOn={smsOn} />
        {err && <p role="alert" className={errorText}>{err}</p>}
        <button className={btn}>Add Member</button>
      </form>

      <div className="min-w-0">
        <SectionHead title={`On the Crew (${active.length})`} />
        {active.length === 0 && <p className="text-on-surface-variant">No crew yet. Add your first person.</p>}
        <ul>
          {active.map((e) => {
            const link = `${typeof window !== "undefined" ? window.location.origin : ""}/employee?u=${e.id}`;
            if (editId === e.id) {
              return (
                <li key={e.id} className={`py-5 border-b ${hairline}`}>
                  <form onSubmit={saveEdit} className="space-y-4 max-w-md">
                    <h4 className="font-headline-md text-headline-md uppercase">Edit {e.name}</h4>
                    <CrewFields f={ef} setF={setEf} idPrefix={`crew-edit-${e.id}`} autoFocus currentRate={e.rate} smsOn={smsOn} />
                    {editErr && <p role="alert" className={errorText}>{editErr}</p>}
                    <div className="flex gap-3">
                      <button className={btn} disabled={busy}>{busy ? "Saving…" : "Save Changes"}</button>
                      <button type="button" className={btnGhost} disabled={busy} onClick={() => setEditId("")}>Cancel</button>
                    </div>
                    <p className="text-on-surface-variant/70 text-xs">Their login link stays the same. A new PIN signs them out until they enter it.</p>
                  </form>
                </li>
              );
            }
            return (
              <li key={e.id} className={`py-4 border-b ${hairline} space-y-2`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <div className="font-headline-md text-headline-md break-words">{e.name}</div>
                    <div className="text-on-surface-variant text-sm">{money(e.rate)} an hour, PIN {e.pin}{e.phone ? `, ${fmtPhone(e.phone)}` : ""}</div>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-4">
                    <button className={btnGhost} onClick={() => startEdit(e)}>Edit</button>
                    <button className={textLink} onClick={() => setActive(e, false)}>No longer on crew</button>
                  </div>
                </div>
                {e.nextRate && (
                  <p className="text-on-surface text-sm">
                    Goes to {money(e.nextRate.rate)} an hour on {fmtDate(e.nextRate.from)}. <button className={textLink} onClick={() => cancelRaise(e)}>Cancel this change</button>
                  </p>
                )}
                {saved?.id === e.id && <p role="status" className="text-primary text-sm font-label-bold">{saved.note}</p>}
                {rowErr?.id === e.id && <p role="alert" className={errorText}>{rowErr.note}</p>}
                <div className={`flex items-center gap-2 border ${hairline} p-2`}>
                  <input readOnly aria-label={`Login link for ${e.name}`} value={link} onFocus={(ev) => ev.currentTarget.select()} className="flex-1 min-w-0 bg-transparent text-on-surface-variant text-xs outline-none" />
                  <button type="button" onClick={() => copy(e.id, link)} className="shrink-0 bg-primary-container text-on-primary-container font-label-bold text-xs uppercase px-3 py-1.5 metallic-gradient beveled-edge">{copied === e.id ? "Copied" : "Copy link"}</button>
                </div>
                <p className="text-on-surface-variant/70 text-xs">Text this link to {e.name.split(" ")[0]}. It opens straight to their name, and they just enter PIN {e.pin}.</p>
              </li>
            );
          })}
        </ul>

        {former.length > 0 && (
          <div className="mt-12">
            <SectionHead title={`No Longer on Crew (${former.length})`} note="They can't clock in, and their hours stay in your records and reports." />
            <ul>
              {former.map((e) => (
                <li key={e.id} className={`py-3 border-b ${hairline} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`}>
                  <span className="min-w-0 break-words"><span className="font-label-bold">{e.name}</span> <span className="text-on-surface-variant text-sm">{money(e.rate)} an hour, {(shiftCount.get(e.id) || 0).toLocaleString("en-US")} shifts on file</span></span>
                  <span className="flex flex-wrap items-baseline gap-4">
                    <button className={textLink} onClick={() => setActive(e, true)}>Bring back</button>
                    {!shiftCount.get(e.id) && <button className="text-on-surface-variant hover:text-error text-sm underline underline-offset-4" onClick={() => remove(e)}>Remove for good</button>}
                  </span>
                  {rowErr?.id === e.id && <p role="alert" className={`${errorText} basis-full`}>{rowErr.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
