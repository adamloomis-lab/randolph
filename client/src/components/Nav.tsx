import { useState, useEffect } from "react";
import Img from "@/components/Img";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight, Phone, MapPin, Clock, ThumbsUp, Camera } from "lucide-react";
import { RC } from "@/lib/rc";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.serviceCity}, ${BUSINESS.address.regionFull}`
)}`;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Scroll lock + Esc to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b-2 border-surface-container-highest bg-background/95 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,0.5)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary-container focus:text-on-primary-container focus:px-4 focus:py-2 focus:font-label-bold focus:text-label-bold focus:uppercase"
      >
        Skip to content
      </a>
      <nav className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Img src={RC.logo} alt="Randolph Construction" className="h-12 w-12 object-contain" />
          <span className="font-display-lg text-2xl md:text-headline-md uppercase tracking-tight text-on-surface leading-none">
            Randolph <span className="text-primary">Construction</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-label-bold text-label-bold uppercase transition-colors ${
                isActive(l.href) ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-block bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95"
        >
          Get an Estimate
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-on-surface p-1"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={26} />
        </button>
      </nav>
      </header>

      {/* Elevated mobile menu: full-screen overlay (sibling of header so its fixed
          positioning is viewport-relative; the header's backdrop-blur would otherwise
          trap a nested fixed element to the header height) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute right-0 top-0 h-full w-[88%] max-w-sm bg-surface-container-lowest border-l-2 border-surface-container-highest shadow-[-20px_0_60px_-10px_rgba(0,0,0,0.85)] concrete-texture flex flex-col transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-20 border-b-2 border-surface-container-highest shrink-0">
            <div className="flex items-center gap-3">
              <Img src={RC.logo} alt="Randolph Construction" className="h-10 w-10 object-contain" />
              <span className="font-display-lg text-xl uppercase tracking-tight text-on-surface leading-none">
                Randolph
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-colors active:scale-95"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Trust badge with pulsing dot */}
            <div className="px-6 pt-6">
              <span className="inline-flex items-center gap-2 bg-primary-container/15 border border-primary/40 text-primary font-label-bold text-[11px] uppercase tracking-widest px-3 py-1.5">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="alm-dot-pulse absolute inline-flex h-full w-full rounded-full bg-primary" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Free Estimates · One Crew, All the Skills
              </span>
            </div>

            {/* Nav links */}
            <nav className="px-6 pt-6 pb-2 flex flex-col">
              {LINKS.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
                  className={`group flex items-center justify-between py-4 border-b border-surface-container-highest font-display-lg text-3xl uppercase tracking-tight transition-all duration-300 ${
                    open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  } ${isActive(l.href) ? "text-primary" : "text-on-surface hover:text-primary"}`}
                >
                  {l.label}
                  <ArrowUpRight
                    size={22}
                    className="text-on-surface-variant transition-all group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            {/* Primary + secondary CTAs */}
            <div className="px-6 pt-6 space-y-3">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center justify-center gap-2 w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-4 metallic-gradient beveled-edge industrial-glow active:scale-95 transition-all"
              >
                <Phone size={18} strokeWidth={2} aria-hidden="true" /> Call {BUSINESS.phone}
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full border-2 border-surface-container-highest text-on-surface font-label-bold text-label-bold uppercase py-4 hover:border-primary hover:text-primary active:scale-95 transition-all"
              >
                Request an Estimate
              </Link>
            </div>

            {/* Contact footer */}
            <div className="px-6 py-7 mt-2 border-t border-surface-container-highest space-y-4">
              <a href={MAPS_HREF} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-on-surface-variant hover:text-primary transition-colors">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <span className="font-body-md text-sm">{BUSINESS.serviceAreaCopy}</span>
              </a>
              <div className="flex items-start gap-3 text-on-surface-variant">
                <Clock size={18} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <span className="font-body-md text-sm">By appointment · We reply within one business day</span>
              </div>
              <div className="flex gap-3 pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                >
                  <ThumbsUp size={18} aria-hidden="true" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                >
                  <Camera size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
