import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Emp = { id: string; name: string };
type Job = { id: string; name: string; customer?: string; workType?: string; address?: string };
type LocResult = { loc?: { lat: number; lng: number; acc: number }; locNote?: "denied" | "unavailable" | "timeout" };

// Lunch break options (minutes deducted from the shift)
const LUNCH_OPTIONS = [
  { v: 0, label: "No lunch" },
  { v: 30, label: "30 min" },
  { v: 45, label: "45 min" },
  { v: 60, label: "1 hour" },
  { v: 90, label: "1.5 hours" },
];

const API = "/.netlify/functions/timeclock";
class ApiError extends Error {
  relogin: boolean;
  constructor(message: string, relogin: boolean) { super(message); this.relogin = relogin; }
}
const post = async (body: Record<string, unknown>) => {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(d.error || "Something went wrong.", d.relogin === true);
  return d;
};

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const fmtTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

// hours = (out - in) - lunch minutes, clamped >= 0
function calcHours(clockIn: string, clockOut: string, lunchMinutes: number) {
  if (!clockIn || !clockOut) return 0;
  const m = (t: string) => { const [h, mi] = t.split(":").map(Number); return h * 60 + mi; };
  let mins = m(clockOut) - m(clockIn);
  if (mins < 0) mins += 24 * 60;
  mins -= Math.max(0, Number(lunchMinutes) || 0);
  return Math.max(0, Math.round((mins / 60) * 100) / 100);
}

// One reading of where the phone is, taken only at clock-in and clock-out.
// A refusal or a weak signal never blocks the punch; it is noted instead.
const getLoc = (): Promise<LocResult> => new Promise((resolve) => {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) return resolve({ locNote: "unavailable" });
  navigator.geolocation.getCurrentPosition(
    (p) => resolve({ loc: { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy } }),
    (e) => resolve({ locNote: e.code === 1 ? "denied" : e.code === 3 ? "timeout" : "unavailable" }),
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
  );
});

const label = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input = "bg-surface-container border-b border-surface-container-highest p-4 text-on-surface focus:border-primary focus:outline-none transition-all w-full text-lg";
const btn = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50 w-full text-center";

export default function TimeClock() {
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [locationStamp, setLocationStamp] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // login
  const [empId, setEmpId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [token, setToken] = useState("");
  const [me, setMe] = useState<{ id: string; name: string; rate: number } | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");

  // entry
  const [date, setDate] = useState(todayStr());
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [lunch, setLunch] = useState(30);
  const [jobId, setJobId] = useState("");
  const [address, setAddress] = useState("");

  // Pick a job -> auto-fill its saved address so the crew don't retype it daily.
  const onJobChange = (id: string) => {
    setJobId(id);
    const j = jobs.find((x) => x.id === id);
    if (j) setAddress(j.address || "");
  };
  const [done, setDone] = useState<null | { hours: number; pay: number }>(null);
  const [week, setWeek] = useState<null | { totalHours: number; regHours: number; otHours: number; gross: number }>(null);
  const [openPunch, setOpenPunch] = useState<null | { date: string; clockIn: string }>(null);
  const [mode, setMode] = useState<"home" | "manual">("home");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Crew Time Clock | Randolph Construction";
    post({ action: "config" })
      .then((d) => {
        setEmployees(d.employees || []);
        setJobs(d.jobs || []);
        setLocationStamp(d.locationStamp === true);
        // A personal link (?u=<id>) preselects this crew member; otherwise remember the last one.
        const u = new URLSearchParams(window.location.search).get("u");
        let remembered = "";
        try { remembered = localStorage.getItem("rc_tc_emp") || ""; } catch { /* storage unavailable */ }
        setEmpId(u || remembered);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const weekBanner = week && (
    <div className="bg-surface-container border border-surface-container-highest p-4 text-left">
      <div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest mb-1">This week so far</div>
      <div className="font-display-lg text-2xl text-primary">{week.totalHours} hrs · ${week.gross.toFixed(2)}</div>
      <div className="text-on-surface-variant text-xs mt-1">
        {week.regHours} regular{week.otHours > 0 ? ` + ${week.otHours} overtime (1.5×)` : ""} · gross, before taxes
      </div>
    </div>
  );

  const hours = calcHours(clockIn, clockOut, lunch);
  const pay = me ? Math.round(hours * me.rate * 100) / 100 : 0;

  const resetEntry = () => { setClockIn(""); setClockOut(""); setLunch(30); setJobId(""); setAddress(""); setDate(todayStr()); };
  const switchUser = () => { setMe(null); setToken(""); setPin(""); setShowPin(false); setDone(null); setOpenPunch(null); setWeek(null); setMode("home"); resetEntry(); };
  // A timed-out login goes back to the PIN screen with the reason shown.
  const fail = (e: unknown) => {
    const x = e as ApiError;
    if (x.relogin) switchUser();
    setErr(x.message);
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!empId) return setErr("Pick your name.");
    if (!/^\d{4}$/.test(pin)) return setErr("Enter your 4-digit PIN.");
    setBusy("Checking…");
    try {
      const d = await post({ action: "employee-login", employeeId: empId, pin });
      setMe(d.employee); setToken(d.token); setPin("");
      try { localStorage.setItem("rc_tc_emp", empId); } catch { /* storage unavailable */ }
      post({ action: "my-week", token: d.token, date: todayStr() }).then((w) => setWeek(w.week)).catch(() => {});
      post({ action: "punch-status", token: d.token }).then((p) => setOpenPunch(p.open || null)).catch(() => {});
    } catch (e2) { setErr((e2 as Error).message); }
    finally { setBusy(""); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!clockIn || !clockOut) return setErr("Enter your clock-in and clock-out times.");
    try {
      let where: LocResult = {};
      if (locationStamp) { setBusy("Finding your location…"); where = await getLoc(); }
      setBusy("Saving…");
      const d = await post({ action: "submit", token, date, clockIn, clockOut, lunch, jobId, address, ...where });
      if (d.week) setWeek(d.week);
      setOpenPunch(null);
      setDone({ hours: d.entry.hours, pay: d.entry.pay });
    } catch (e2) { fail(e2); }
    finally { setBusy(""); }
  };

  const clockInNow = async () => {
    setErr("");
    try {
      let where: LocResult = {};
      if (locationStamp) { setBusy("Finding your location…"); where = await getLoc(); }
      setBusy("Clocking in…");
      const d = await post({ action: "punch-in", token, ...where });
      setOpenPunch(d.open);
    } catch (e2) { fail(e2); }
    finally { setBusy(""); }
  };
  const clockOutNow = () => {
    if (!openPunch) return;
    setDate(openPunch.date); setClockIn(openPunch.clockIn); setClockOut(nowTime());
    setLunch(30); setJobId(""); setAddress(""); setMode("manual");
  };
  const cancelPunch = async () => {
    if (!confirm("Cancel your clock-in?")) return;
    setBusy("…");
    try { await post({ action: "punch-cancel", token }); setOpenPunch(null); }
    catch (e2) { fail(e2); }
    finally { setBusy(""); }
  };
  const startManual = () => {
    // Default to a typical workday (8:00 AM - 4:00 PM); the crew adjust from there.
    setClockIn("08:00"); setClockOut("16:00"); setLunch(30); setJobId(""); setAddress(""); setDate(todayStr()); setMode("manual");
  };

  const logAnother = () => { setDone(null); setMode("home"); resetEntry(); };

  const locationNote = locationStamp && (
    <p className="text-on-surface-variant text-xs">Your location is saved when you clock in and when you clock out. It is not followed during your shift.</p>
  );

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      <Nav />
      <main id="main-content" className="pt-32 pb-24">
        <section className="max-w-xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-8">
            <h1 className="font-display-lg text-4xl md:text-5xl uppercase leading-none">
              Log Your <span className="text-primary">Hours</span>
            </h1>
            <p className="text-on-surface-variant font-body-md mt-4">
              End of the day, takes about 20 seconds. Your hours and pay add up automatically.
            </p>
          </div>

          {!loaded ? (
            <p className="text-on-surface-variant">Loading…</p>
          ) : !me ? (
            /* ---- Login ---- */
            <form onSubmit={login} className="bg-surface-container-lowest p-6 md:p-8 border-2 border-surface-container-highest space-y-6">
              <div>
                <label className={label} htmlFor="emp">Your Name</label>
                <select id="emp" className={input} value={empId} onChange={(e) => setEmpId(e.target.value)}>
                  <option value="">Select your name…</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="pin">4-Digit PIN</label>
                <div className="relative">
                  <input id="pin" className={`${input} tracking-[0.5em] pr-20`} type={showPin ? "text" : "password"} inputMode="numeric" autoComplete="off"
                    maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
                  <button type="button" onClick={() => setShowPin(!showPin)} aria-pressed={showPin} aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    className="absolute right-0 top-0 h-full px-4 text-on-surface-variant hover:text-primary text-xs uppercase tracking-widest font-label-bold">{showPin ? "Hide" : "Show"}</button>
                </div>
              </div>
              {err && <p role="alert" className="text-error text-sm font-label-bold">{err}</p>}
              <button className={btn} disabled={!!busy}>{busy || "Continue"}</button>
            </form>
          ) : done ? (
            /* ---- Confirmation ---- */
            <div className="bg-surface-container-lowest p-8 border-2 border-primary text-center">
              <span aria-hidden className="material-symbols-outlined text-primary" style={{ fontSize: 56 }}>check_circle</span>
              <h2 className="font-headline-md text-headline-md uppercase mt-3">Logged It, {me.name.split(" ")[0]}</h2>
              <div className="flex justify-center gap-10 my-6">
                <div><div className="font-display-lg text-4xl text-primary">{done.hours}</div><div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest">Hours Today</div></div>
                <div><div className="font-display-lg text-4xl text-primary">${done.pay.toFixed(2)}</div><div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest">Pay Today</div></div>
              </div>
              {weekBanner && <div className="mb-6">{weekBanner}</div>}
              <button className={btn} onClick={logAnother}>Log Another Day</button>
              <button className="mt-3 text-on-surface-variant text-sm underline w-full" onClick={switchUser}>Not {me.name.split(" ")[0]}? Switch user</button>
            </div>
          ) : mode === "home" ? (
            /* ---- Punch home ---- */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-surface-container-lowest p-6 border-2 border-surface-container-highest">
                <div><div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest">Logged in as</div><div className="font-headline-md text-headline-md text-primary">{me.name}</div></div>
                <button type="button" onClick={switchUser} className="text-on-surface-variant text-xs underline">Switch</button>
              </div>

              {weekBanner}

              {openPunch ? (
                <div className="bg-surface-container-lowest p-8 border-2 border-primary text-center space-y-5">
                  <div>
                    <div className="text-label-bold uppercase text-on-surface-variant text-xs tracking-widest">You're on the clock</div>
                    <div className="font-display-lg text-3xl text-primary mt-1">In at {fmtTime(openPunch.clockIn)}</div>
                    <div className="text-on-surface-variant text-sm mt-1">{openPunch.date === todayStr() ? "Today" : `Started ${openPunch.date}`}</div>
                  </div>
                  <button className={btn} disabled={!!busy} onClick={clockOutNow}>Clock Out Now</button>
                  <button className="text-on-surface-variant text-xs underline" onClick={cancelPunch} disabled={!!busy}>Cancel clock-in</button>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-8 border-2 border-surface-container-highest text-center space-y-4">
                  <p className="text-on-surface-variant">Tap to start your shift. It stamps the time for you.</p>
                  <button className={btn} disabled={!!busy} onClick={clockInNow}>{busy || "Clock In Now"}</button>
                  <button className="text-on-surface-variant text-sm underline" onClick={startManual}>Or log a past shift by hand</button>
                  {locationNote}
                </div>
              )}
              {err && <p role="alert" className="text-error text-sm font-label-bold text-center">{err}</p>}
            </div>
          ) : (
            /* ---- Entry (manual or finishing a punch) ---- */
            <form onSubmit={submit} className="bg-surface-container-lowest p-6 md:p-8 border-2 border-surface-container-highest space-y-6">
              <div className="flex items-center justify-between border-b border-surface-container-highest pb-4">
                <button type="button" onClick={() => setMode("home")} className="text-on-surface-variant text-sm hover:text-primary transition-colors">&larr; Back</button>
                <div className="text-right"><div className="text-label-bold uppercase text-on-surface-variant text-[10px] tracking-widest">Logged in as</div><div className="font-label-bold text-primary">{me.name}</div></div>
              </div>

              {weekBanner}

              <div>
                <label className={label} htmlFor="date">Date</label>
                <input id="date" type="date" className={input} value={date} max={todayStr()} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label} htmlFor="in">Clock In</label>
                  <input id="in" type="time" className={input} value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
                </div>
                <div>
                  <label className={label} htmlFor="out">Clock Out</label>
                  <input id="out" type="time" className={input} value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="lunch">Lunch Break</label>
                <select id="lunch" className={input} value={lunch} onChange={(e) => setLunch(Number(e.target.value))}>
                  {LUNCH_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                </select>
                <p className="text-on-surface-variant text-xs mt-1">Unpaid lunch is subtracted from your hours.</p>
              </div>

              <div>
                <label className={label} htmlFor="job">Job</label>
                <select id="job" className={input} value={jobId} onChange={(e) => onJobChange(e.target.value)}>
                  <option value="">Select a job…</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>

              <div>
                <label className={label} htmlFor="addr">Job Address</label>
                <input id="addr" className={input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Auto-fills when you pick a job" />
                <p className="text-on-surface-variant text-xs mt-1">Picks up the saved address for the job. Edit it if you were somewhere else.</p>
              </div>

              {/* live total */}
              <div className="flex justify-between items-center bg-surface-container p-4 border border-surface-container-highest">
                <span className="font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest">Today's Total</span>
                <span className="font-display-lg text-2xl text-primary">{hours} hrs · ${pay.toFixed(2)}</span>
              </div>

              {locationNote}
              {err && <p role="alert" className="text-error text-sm font-label-bold">{err}</p>}
              <button className={btn} disabled={!!busy}>{busy || "Submit Today's Hours"}</button>
            </form>
          )}

          <p className="text-center text-on-surface-variant/70 text-xs mt-6">
            Private to Randolph Construction.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
