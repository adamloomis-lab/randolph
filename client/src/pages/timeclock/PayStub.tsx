// Printable earnings statements. Shown on white over the owner screen; the print
// styles in index.css put each one alone on its own sheet of paper.
import { useEffect } from "react";
import { createPortal } from "react-dom";
// @ts-expect-error plain JS config shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { PayrollRow, addDays, fmtDate, fmtDay, fmtTime, hrs, lunchToMins, money } from "./shared";

export default function PayStubs({ rows, onClose }: { rows: PayrollRow[]; onClose: () => void }) {
  useEffect(() => {
    document.body.classList.add("printing-stubs");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("printing-stubs"); window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return createPortal(
    <div className="stub-sheet fixed inset-0 z-[200] bg-white text-black overflow-y-auto" role="dialog" aria-modal="true" aria-label="Pay stubs">
      <div className="stub-toolbar sticky top-0 bg-white border-b border-neutral-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-neutral-700">{rows.length} pay stub{rows.length === 1 ? "" : "s"}. Choose "Save as PDF" in the print window to keep a copy.</span>
        <span className="flex gap-3">
          <button onClick={() => window.print()} className="bg-black text-white font-bold uppercase text-sm px-5 py-2.5">Print</button>
          <button onClick={onClose} className="border border-neutral-400 text-neutral-800 font-bold uppercase text-sm px-5 py-2.5">Close</button>
        </span>
      </div>
      {rows.map((r) => <Stub key={r.key} row={r} />)}
    </div>,
    document.body,
  );
}

function Stub({ row }: { row: PayrollRow }) {
  const cell = "py-1.5 pr-3 align-top";
  return (
    <article className="stub-page max-w-3xl mx-auto px-6 py-10 text-[14px] leading-snug">
      <header className="flex flex-wrap justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <div className="text-2xl font-extrabold uppercase tracking-wide">{BUSINESS.name}</div>
          <div className="text-neutral-700">{BUSINESS.address.locality}, {BUSINESS.address.regionFull} · {BUSINESS.phone}</div>
        </div>
        <div className="text-right">
          <div className="font-bold uppercase tracking-wide">Earnings Statement</div>
          <div className="text-neutral-700">Pay period {fmtDate(row.week)} to {fmtDate(addDays(row.week, 6))}</div>
        </div>
      </header>

      <div className="flex flex-wrap justify-between gap-4 py-5">
        <div><div className="text-neutral-600 text-xs uppercase tracking-wide">Employee</div><div className="text-lg font-bold">{row.employee}</div></div>
        <div className="text-right"><div className="text-neutral-600 text-xs uppercase tracking-wide">Gross pay</div><div className="text-2xl font-extrabold">{money(row.gross)}</div></div>
      </div>

      <h2 className="font-bold uppercase text-xs tracking-wide border-b border-neutral-400 pb-1 mb-1">Earnings</h2>
      <table className="w-full mb-6">
        <thead><tr className="text-left text-neutral-600 text-xs uppercase"><th className={cell}>Type</th><th className={`${cell} text-right`}>Hours</th><th className={`${cell} text-right`}>Rate</th><th className="py-1.5 text-right">Amount</th></tr></thead>
        <tbody>
          {row.lines.map((l) => (
            <tr key={`${l.kind}${l.rate}`} className="border-t border-neutral-200">
              <td className={cell}>{l.kind}{l.kind === "Overtime" ? " (1.5 times the hourly rate)" : ""}</td>
              <td className={`${cell} text-right`}>{hrs(l.hours)}</td>
              <td className={`${cell} text-right`}>{money(l.rate)}</td>
              <td className="py-1.5 text-right">{money(l.amount)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-black font-bold"><td className={cell}>Total</td><td className={`${cell} text-right`}>{hrs(row.total)}</td><td className={cell}></td><td className="py-1.5 text-right">{money(row.gross)}</td></tr>
        </tbody>
      </table>

      <h2 className="font-bold uppercase text-xs tracking-wide border-b border-neutral-400 pb-1 mb-1">Shifts</h2>
      <table className="w-full mb-6">
        <thead><tr className="text-left text-neutral-600 text-xs uppercase"><th className={cell}>Day</th><th className={cell}>In</th><th className={cell}>Out</th><th className={cell}>Lunch</th><th className="py-1.5 text-right">Hours</th></tr></thead>
        {/* The job sits on its own line under each shift so the sheet fits a phone screen as well as paper. */}
        {row.shifts.map((e) => (
          <tbody key={e.id} className="border-t border-neutral-200">
            <tr>
              <td className={`${cell} whitespace-nowrap`}>{fmtDay(e.date)}</td>
              <td className={`${cell} whitespace-nowrap`}>{fmtTime(e.clockIn)}</td>
              <td className={`${cell} whitespace-nowrap`}>{fmtTime(e.clockOut)}</td>
              <td className={`${cell} whitespace-nowrap`}>{lunchToMins(e.lunch) ? `${lunchToMins(e.lunch)} min` : "None"}</td>
              <td className="py-1.5 text-right">{hrs(e.hours)}</td>
            </tr>
            {e.jobName && <tr><td colSpan={5} className="pb-1.5 text-neutral-600 text-xs break-words">{e.jobName}</td></tr>}
          </tbody>
        ))}
      </table>

      <p className="text-neutral-700 text-xs">Gross pay is the amount earned before taxes and other withholdings. Overtime is paid on hours past 40 in the workweek.</p>
    </article>
  );
}
