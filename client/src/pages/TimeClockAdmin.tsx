import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EntriesTab from "./timeclock/EntriesTab";
import PayrollTab from "./timeclock/PayrollTab";
import ProjectsTab from "./timeclock/ProjectsTab";
import CrewTab from "./timeclock/CrewTab";
import JobsTab from "./timeclock/JobsTab";
import SettingsTab from "./timeclock/SettingsTab";
import { Backup, Connected, Emp, Entry, Job, OwnerSettings, PasscodeField, btn, btnGhost, errorText, label } from "./timeclock/shared";

const API = "/.netlify/functions/timeclock";
const TOKEN_KEY = "rc_tc_admin";
const TABS = ["entries", "payroll", "projects", "crew", "jobs", "settings"] as const;
type Tab = (typeof TABS)[number];

const readToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } };
const writeToken = (t: string) => { try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ } };

const NO_SETTINGS: OwnerSettings = {
  weekStartDay: 0, lockedThrough: null, locationStamp: false,
  payrollEmail: { on: false, to: "", day: 1 }, reminders: { on: false, afterHours: 10 },
  quickbooks: { serviceItem: "", payrollItem: "", otPayrollItem: "", companyName: "", companyCreateTime: "" },
};

export default function TimeClockAdmin() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("entries");
  const token = useRef("");

  const [employees, setEmployees] = useState<Emp[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [trashCount, setTrashCount] = useState(0);
  const [settings, setSettings] = useState<OwnerSettings>(NO_SETTINGS);
  const [connected, setConnected] = useState<Connected>({ email: false, sms: false });
  const [backup, setBackup] = useState<Backup>(null);
  const [weak, setWeak] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  const setToken = (t: string) => { token.current = t; writeToken(t); };
  const signOut = useCallback((why = "") => { setToken(""); setAuthed(false); setPasscode(""); setEntries([]); setEmployees([]); setJobs([]); setErr(why); }, []);

  const call = async (body: Record<string, unknown>) => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, d };
  };
  const post = useCallback(async (body: Record<string, unknown>) => {
    const { ok, d } = await call({ ...body, adminToken: token.current });
    if (!ok) {
      if (d.relogin) signOut("You were signed out. Sign in again.");
      throw new Error(d.error || "Something went wrong.");
    }
    return d;
  }, [signOut]);

  const refresh = useCallback(async () => {
    const [a, e] = await Promise.all([post({ action: "admin-bootstrap" }), post({ action: "admin-entries" })]);
    const crew: Emp[] = a.employees || [];
    const jobList: Job[] = a.jobs || [];
    setEmployees(crew); setJobs(jobList);
    setSettings({ ...NO_SETTINGS, weekStartDay: a.weekStartDay ?? 0, lockedThrough: a.lockedThrough ?? null, locationStamp: a.locationStamp === true, payrollEmail: a.payrollEmail || NO_SETTINGS.payrollEmail, reminders: a.reminders || NO_SETTINGS.reminders, quickbooks: a.quickbooks || NO_SETTINGS.quickbooks });
    setConnected(a.connected || { email: false, sms: false });
    setBackup(a.backup || null);
    setWeak(a.weakPasscode === true);
    // Show every shift under the crew member's and the job's current name, so renaming
    // either one never splits their hours in two.
    const nameById = new Map<string, string>(crew.map((x) => [x.id, x.name]));
    const jobById = new Map<string, string>(jobList.map((x) => [x.id, x.name]));
    setEntries((e.entries || []).map((x: Entry) => ({
      ...x,
      employeeName: (x.employeeId && nameById.get(x.employeeId)) || x.employeeName,
      jobName: (x.jobId && jobById.get(x.jobId)) || x.jobName,
    })));
    setTrashCount(e.trashCount || 0);
  }, [post]);

  // Refresh wrapper for the tabs: a failed reload shows a message instead of going quiet.
  const reload = useCallback(async () => {
    setLoadErr("");
    try { await refresh(); } catch (e) { setLoadErr((e as Error).message); }
  }, [refresh]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Time Clock Admin | Randolph Construction";
    // Stay signed in across a page refresh.
    const saved = readToken();
    if (!saved) { setChecking(false); return; }
    token.current = saved;
    refresh().then(() => setAuthed(true)).catch(() => { setToken(""); setErr(""); }).finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (!passcode) return setErr("Enter your passcode.");
    setBusy(true);
    try {
      const { ok, d } = await call({ action: "admin-login", passcode });
      if (!ok) throw new Error(d.error || "Something went wrong.");
      setToken(d.token); setPasscode("");
      await refresh();
      setAuthed(true);
    } catch (e2) { setErr((e2 as Error).message); }
    finally { setBusy(false); }
  };

  if (!authed) {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen">
        <Nav />
        <main id="main-content" className="pt-32 pb-24">
          <section className="max-w-sm mx-auto px-margin-mobile">
            <h1 className="font-display-lg text-3xl uppercase mb-6">Owner <span className="text-primary">Login</span></h1>
            {checking ? <p className="text-on-surface-variant">Loading…</p> : (
              <form onSubmit={login} className="space-y-5">
                <div>
                  <label className={label} htmlFor="apin">Passcode</label>
                  <PasscodeField id="apin" value={passcode} onChange={setPasscode} autoComplete="current-password" />
                </div>
                {err && <p role="alert" className={errorText}>{err}</p>}
                <button className={`${btn} w-full`} disabled={busy}>{busy ? "Checking…" : "Sign In"}</button>
              </form>
            )}
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
            <div className="flex flex-wrap gap-3">
              <button className={btnGhost} onClick={reload}>Refresh</button>
              <button className={btnGhost} onClick={() => signOut()}>Sign Out</button>
            </div>
          </div>

          {weak && (
            <p className="mb-8 border border-primary p-4 text-on-surface">
              Your login is still a 4-digit PIN, which is easy to guess. <button className="underline underline-offset-4 text-primary font-label-bold" onClick={() => setTab("settings")}>Set a longer passcode</button>. It takes a minute.
            </p>
          )}
          {loadErr && <p role="alert" className={`${errorText} mb-6`}>{loadErr}</p>}

          <div role="tablist" aria-label="Time clock sections" className="flex flex-wrap gap-x-2 mb-10 border-b border-surface-container-highest">
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={`font-label-bold text-label-bold uppercase px-4 sm:px-5 py-3 -mb-px border-b-2 transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === "entries" && <EntriesTab entries={entries} jobs={jobs} lockedThrough={settings.lockedThrough} trashCount={trashCount} showLocation={settings.locationStamp} post={post} onChange={reload} />}
          {tab === "payroll" && <PayrollTab entries={entries} jobs={jobs} settings={settings} post={post} onChange={reload} />}
          {tab === "projects" && <ProjectsTab jobs={jobs} entries={entries} post={post} onChange={reload} />}
          {tab === "crew" && <CrewTab employees={employees} entries={entries} smsOn={connected.sms} post={post} onChange={reload} />}
          {tab === "jobs" && <JobsTab jobs={jobs} entries={entries} post={post} onChange={reload} />}
          {tab === "settings" && <SettingsTab settings={settings} connected={connected} backup={backup} weakPasscode={weak} post={post} onChange={reload} onToken={setToken} onSignOut={() => signOut()} />}
        </section>
      </main>
      <Footer />
    </div>
  );
}
