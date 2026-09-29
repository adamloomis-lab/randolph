import { useState } from "react";
import { Backup, Connected, DAYS, OwnerSettings, PasscodeField, PostFn, Refresh, SectionHead, Toggle, btn, btnGhost, downloadFile, errorText, fmtStamp, input, label, okText, todayStr } from "./shared";

type Note = { ok?: string; err?: string };
const NotConnected = ({ what }: { what: string }) => (
  <p className="text-on-surface-variant text-sm">{what} is not connected to this site yet, so nothing is sent. Your choices here are saved and start working the day it is connected. Adam Loomis Marketing sets that up.</p>
);
const Said = ({ note }: { note: Note }) => (
  <>
    {note.ok && <p role="status" className={okText}>{note.ok}</p>}
    {note.err && <p role="alert" className={errorText}>{note.err}</p>}
  </>
);

/* ---------------- Settings ---------------- */
export default function SettingsTab({ settings, connected, backup, weakPasscode, post, onChange, onToken, onSignOut }: {
  settings: OwnerSettings; connected: Connected; backup: Backup; weakPasscode: boolean; post: PostFn; onChange: Refresh; onToken: (t: string) => void; onSignOut: () => void;
}) {
  const run = async (set: (n: Note) => void, fn: () => Promise<string>) => {
    set({});
    try { set({ ok: await fn() }); } catch (e) { set({ err: (e as Error).message }); }
  };

  // Passcode
  const [pass, setPass] = useState("");
  const [passNote, setPassNote] = useState<Note>({});
  const savePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < 6) return setPassNote({ err: "Use at least 6 characters." });
    run(setPassNote, async () => {
      const d = await post({ action: "set-admin-passcode", newPasscode: pass });
      onToken(d.token); setPass(""); await onChange();
      return "Passcode updated. Any other phone or computer that was signed in has been signed out.";
    });
  };

  // Workweek
  const [wd, setWd] = useState(String(settings.weekStartDay));
  const [weekNote, setWeekNote] = useState<Note>({});
  const saveWeek = (e: React.FormEvent) => {
    e.preventDefault();
    run(setWeekNote, async () => { await post({ action: "set-week-start", weekStartDay: Number(wd) }); await onChange(); return `Workweek now starts ${DAYS[Number(wd)]}.`; });
  };

  // Location
  const [locNote, setLocNote] = useState<Note>({});
  const saveLoc = (on: boolean) => run(setLocNote, async () => {
    await post({ action: "save-settings", locationStamp: on }); await onChange();
    return on ? "On. Tell the crew before their next shift. Their phone will ask permission the first time." : "Off. No location is saved.";
  });

  // Weekly email
  const [mail, setMail] = useState(settings.payrollEmail);
  const [mailNote, setMailNote] = useState<Note>({});
  const saveMail = (e: React.FormEvent) => {
    e.preventDefault();
    run(setMailNote, async () => { await post({ action: "save-settings", payrollEmail: mail }); await onChange(); return mail.on ? `Saved. The summary goes to ${mail.to} every ${DAYS[mail.day]} morning.` : "Saved. The weekly email is off."; });
  };
  const sendNow = () => run(setMailNote, async () => {
    await post({ action: "save-settings", payrollEmail: mail });
    const d = await post({ action: "send-payroll-email" });
    return `Sent last week's summary to ${d.to}.`;
  });

  // Reminder texts
  const [rem, setRem] = useState(settings.reminders);
  const [remNote, setRemNote] = useState<Note>({});
  const saveRem = (e: React.FormEvent) => {
    e.preventDefault();
    run(setRemNote, async () => { await post({ action: "save-settings", reminders: rem }); await onChange(); return rem.on ? `Saved. Anyone on the clock longer than ${rem.afterHours} hours gets one text.` : "Saved. Reminder texts are off."; });
  };

  // Backups
  const [backNote, setBackNote] = useState<Note>({});
  const backupNow = () => run(setBackNote, async () => { const d = await post({ action: "backup-now" }); await onChange(); return `Backed up ${d.backup.entries} shifts just now.`; });
  const downloadCopy = () => run(setBackNote, async () => {
    const d = await post({ action: "backup-download" });
    downloadFile(`randolph-timeclock-${todayStr()}.json`, JSON.stringify(d, null, 2), "application/json");
    return `Downloaded ${d.entries.length} shifts, your crew list, and your jobs.`;
  });

  return (
    <div className="grid lg:grid-cols-2 gap-x-14 gap-y-14 max-w-5xl">
      <form onSubmit={savePass} className="space-y-4">
        <SectionHead title="Owner Passcode" note={weakPasscode ? "You are still on the 4-digit PIN. Set a longer passcode here. Letters, numbers, or both, at least 6 characters." : "Letters, numbers, or both, at least 6 characters."} />
        <div><label className={label} htmlFor="new-pass">New Passcode</label><PasscodeField id="new-pass" value={pass} onChange={setPass} autoComplete="new-password" /></div>
        <Said note={passNote} />
        <div className="flex flex-wrap gap-3"><button className={btn}>Update Passcode</button><button type="button" className={btnGhost} onClick={onSignOut}>Sign Out</button></div>
        <p className="text-on-surface-variant/70 text-xs">Five wrong tries locks the login for 15 minutes. This phone stays signed in for a week.</p>
      </form>

      <form onSubmit={saveWeek} className="space-y-4">
        <SectionHead title="Workweek for Overtime" note="Overtime pays 1.5× for hours over 40 in a week. Pick the day your pay week starts so the totals match your payroll." />
        <div><label className={label} htmlFor="week-day">Week Starts On</label>
          <select id="week-day" className={input} value={wd} onChange={(e) => setWd(e.target.value)}>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
        <Said note={weekNote} />
        <button className={btn}>Save Workweek</button>
      </form>

      <div className="space-y-4">
        <SectionHead title="Location at Clock-In" note="Saves where the phone is at the moment someone clocks in and again when they clock out, with a map link on each shift. Nobody is followed during the day." />
        <Toggle id="loc-on" checked={settings.locationStamp} onChange={saveLoc}>Save location at clock-in and clock-out</Toggle>
        <Said note={locNote} />
        <p className="text-on-surface-variant/70 text-xs">If someone turns location off on their phone, they can still clock in. The shift is marked so you can see it.</p>
      </div>

      <form onSubmit={saveMail} className="space-y-4">
        <SectionHead title="Weekly Payroll Email" note="Last week's hours and gross pay for each person, in your inbox, with every shift attached as a spreadsheet." />
        <Toggle id="mail-on" checked={mail.on} onChange={(on) => setMail({ ...mail, on })}>Email me the payroll summary every week</Toggle>
        <div><label className={label} htmlFor="mail-to">Send To</label><input id="mail-to" type="email" autoComplete="email" className={input} value={mail.to} onChange={(e) => setMail({ ...mail, to: e.target.value })} placeholder="you@example.com" /></div>
        <div><label className={label} htmlFor="mail-day">Send On</label>
          <select id="mail-day" className={input} value={mail.day} onChange={(e) => setMail({ ...mail, day: Number(e.target.value) })}>
            {DAYS.map((d, i) => <option key={i} value={i}>{d} morning</option>)}
          </select>
        </div>
        {!connected.email && <NotConnected what="Email" />}
        <Said note={mailNote} />
        <div className="flex flex-wrap gap-3">
          <button className={btn}>Save</button>
          {connected.email && <button type="button" className={btnGhost} onClick={sendNow} disabled={!mail.to}>Send Last Week Now</button>}
        </div>
      </form>

      <form onSubmit={saveRem} className="space-y-4">
        <SectionHead title="Clock-Out Reminder Texts" note="When someone is still on the clock long after a normal day, they get one text with their clock-out link. Add each person's cell number under Crew." />
        <Toggle id="rem-on" checked={rem.on} onChange={(on) => setRem({ ...rem, on })}>Text a reminder to anyone who forgets to clock out</Toggle>
        <div><label className={label} htmlFor="rem-hours">Send After This Many Hours on the Clock</label>
          <select id="rem-hours" className={input} value={rem.afterHours} onChange={(e) => setRem({ ...rem, afterHours: Number(e.target.value) })}>
            {[8, 9, 10, 11, 12, 13, 14].map((h) => <option key={h} value={h}>{h} hours</option>)}
          </select>
        </div>
        {!connected.sms && <NotConnected what="Texting" />}
        <Said note={remNote} />
        <button className={btn}>Save</button>
      </form>

      <div className="space-y-4">
        <SectionHead title="Backups" note="Every night at 3:00 AM a full copy of your shifts, crew, and jobs is saved. The last 35 nights are kept, plus one from the start of every month." />
        <p className="text-on-surface">{backup ? <>Last backup <strong className="font-label-bold">{fmtStamp(backup.takenAt)}</strong>{backup.entries != null ? `, ${backup.entries.toLocaleString("en-US")} shifts` : ""}.</> : "The first nightly backup runs tonight."}</p>
        <Said note={backNote} />
        <div className="flex flex-wrap gap-3">
          <button className={btn} onClick={backupNow}>Back Up Now</button>
          <button className={btnGhost} onClick={downloadCopy}>Download a Copy</button>
        </div>
        <p className="text-on-surface-variant/70 text-xs">Payroll records have to be kept for three years. The downloaded copy is yours to store wherever you keep business records.</p>
      </div>
    </div>
  );
}
