import { useState, useEffect } from "react";
import Img from "@/components/Img";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { RC } from "@/lib/rc";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
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
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-1 px-margin-mobile pb-6 pt-2 bg-surface-container-lowest border-t border-surface-container-highest">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-label-bold text-label-bold uppercase py-3 border-b border-surface-container-highest ${
                isActive(l.href) ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-center mt-4 bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-4 metallic-gradient beveled-edge"
          >
            Get an Estimate
          </Link>
        </div>
      )}
    </header>
  );
}
