import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Phone, MapPin, Hammer } from "lucide-react";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";

const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.serviceCity}, ${BUSINESS.address.regionFull}`
)}`;

/**
 * Elevated floating mobile action bar: an off-edge capsule with a blurred
 * charcoal backdrop and big shadow. Glassy Call + Directions, and a brand-red
 * primary Estimate CTA with glow-pulse + sheen. Mobile only.
 */
export function MobileActionBar() {
  return (
    <div className="md:hidden fixed inset-x-3 bottom-3 z-40 print:hidden" role="region" aria-label="Quick actions">
      <div className="flex items-stretch gap-2 rounded-2xl border border-white/15 bg-surface-container-high/95 backdrop-blur-xl p-2 ring-1 ring-inset ring-white/5 shadow-[0_18px_50px_-10px_rgba(0,0,0,0.9),0_0_30px_-10px_rgba(211,47,47,0.5)]">
        <a
          href={BUSINESS.phoneHref}
          aria-label={`Call ${BUSINESS.name}`}
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.08] py-3 text-on-surface hover:bg-white/[0.12] active:scale-95 transition-all"
        >
          <Phone size={21} strokeWidth={2} className="text-primary" aria-hidden="true" />
          <span className="font-label-bold text-[11px] uppercase tracking-wide">Call</span>
        </a>
        <a
          href={MAPS_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get directions to our service area"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.08] py-3 text-on-surface hover:bg-white/[0.12] active:scale-95 transition-all"
        >
          <MapPin size={21} strokeWidth={2} className="text-primary" aria-hidden="true" />
          <span className="font-label-bold text-[11px] uppercase tracking-wide">Directions</span>
        </a>
        <Link
          href="/contact"
          aria-label="Request a free estimate"
          className="alm-sheen-auto alm-glow-pulse relative overflow-hidden flex flex-[1.5] flex-col items-center justify-center gap-1 rounded-xl bg-primary-container text-on-primary-container py-3 metallic-gradient beveled-edge active:scale-95 transition-transform"
        >
          <Hammer size={21} strokeWidth={2} aria-hidden="true" />
          <span className="font-label-bold text-[11px] uppercase tracking-wide">Free Estimate</span>
        </Link>
      </div>
    </div>
  );
}

/**
 * Desktop-only floating pill for the primary CTA. Scroll-reveals after the
 * viewport scrolls past the hero (~80vh).
 */
export function StickyEstimate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`hidden md:block fixed bottom-6 right-6 z-40 print:hidden transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <Link
        href="/contact"
        aria-label="Request a free estimate"
        className="alm-sheen alm-glow-pulse relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-primary-container text-on-primary-container px-7 py-4 font-label-bold text-label-bold uppercase tracking-wide metallic-gradient beveled-edge shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] hover:scale-[1.03] active:scale-95 transition-transform"
      >
        <Hammer size={20} strokeWidth={2} aria-hidden="true" />
        Get a Free Estimate
      </Link>
    </div>
  );
}
