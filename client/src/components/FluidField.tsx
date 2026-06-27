import type { ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";

// Shared "fluid" form controls for Randolph Construction, tuned for the dark
// industrial brand (charcoal surfaces, brand-red #d32f2f accent, Anton + Hanken).
// Floating-label fields with a center-out red underline + focus glow, single-select
// icon cards for project type, a sheened submit button, and an animated thank-you
// checkmark. Used by the Contact and Home estimate forms.

interface FloatFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  idPrefix?: string;
  autoComplete?: string;
}

export function FloatField({
  name, label, value, onChange, type = "text", required, textarea, rows = 5, idPrefix = "f", autoComplete,
}: FloatFieldProps) {
  const id = `${idPrefix}-${name}`;
  const input =
    "peer w-full bg-transparent px-4 pt-6 pb-2 font-body-md text-on-surface text-base placeholder-transparent outline-none";
  const labelCls =
    "pointer-events-none absolute left-4 top-4 origin-left font-body-md text-base text-on-surface-variant transition-all duration-200 " +
    "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary " +
    "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-on-surface-variant";
  return (
    <div className="group relative border border-surface-container-highest bg-surface-container transition-all duration-300 focus-within:border-primary/70 focus-within:bg-surface-container-high focus-within:shadow-[0_0_26px_-8px_rgba(211,47,47,0.6)]">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder=" "
          value={value}
          onChange={onChange}
          className={`${input} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          value={value}
          onChange={onChange}
          className={input}
        />
      )}
      <label htmlFor={id} className={labelCls}>
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-0.5 w-[calc(100%-2rem)] -translate-x-1/2 scale-x-0 bg-primary transition-transform duration-300 peer-focus:scale-x-100"
      />
    </div>
  );
}

export interface IconCardOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface IconCardSelectProps {
  options: IconCardOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  legend: string;
}

// Single-select icon cards. Active card = brand-red fill. Responsive 2-col on
// mobile. A hidden input keeps the submitted value identical to the old <select>.
export function IconCardSelect({ options, value, onChange, name, legend }: IconCardSelectProps) {
  return (
    <fieldset>
      <legend className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-3">
        {legend}
      </legend>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className={`group flex flex-col items-center justify-center gap-2 px-3 py-4 border-2 text-center transition-all duration-200 beveled-edge active:scale-95 ${
                active
                  ? "bg-primary-container text-on-primary-container border-primary metallic-gradient shadow-[0_0_22px_-6px_rgba(211,47,47,0.7)]"
                  : "bg-surface-container border-surface-container-highest text-on-surface-variant hover:border-primary/60 hover:text-on-surface"
              }`}
            >
              <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
              <span className="font-label-bold text-[11px] leading-tight uppercase tracking-wide">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// Animated drawn checkmark for the personalized thank-you state.
export function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
      <circle
        cx="26" cy="26" r="24" fill="none" stroke="#f04540" strokeWidth="3"
        strokeDasharray="151" strokeDashoffset="151"
        style={{ animation: "alm-draw-check 0.6s ease forwards" }}
      />
      <path
        d="M15 27 l7 7 l15 -16" fill="none" stroke="#f04540" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="40" strokeDashoffset="40"
        style={{ animation: "alm-draw-check 0.4s 0.5s ease forwards" }}
      />
    </svg>
  );
}
