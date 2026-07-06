import { Link } from "wouter";
import Img from "@/components/Img";
import GardenReadyBadge from "@/components/GardenReadyBadge";
import { RC, COMPANY } from "@/lib/rc";
// @ts-expect-error - plain JS module shared with the prerender script
import { CITIES } from "@/lib/seoData.js";

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-12 border-t-4 border-surface-container-highest bg-surface-container-lowest concrete-texture">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-16">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Img src={RC.logo} alt="Randolph Construction" className="h-12 w-12 object-contain" />
            <span className="font-display-lg text-headline-md text-primary uppercase leading-none">Randolph</span>
          </div>
          <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
            Quality landscaping, hardscaping, custom decks, and concrete for homeowners across Wadsworth and
            Northeast Ohio. Built strong, built to last.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <span aria-hidden="true" className="material-symbols-outlined">thumb_up</span>
            </a>
            <a
              className="w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary transition-colors"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <span aria-hidden="true" className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
          <div className="mt-6">
            <GardenReadyBadge variant="inline" />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h5 className="font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest">Navigation</h5>
          <ul className="space-y-4">
            {[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Project Gallery", href: "/gallery" },
              { label: "Request an Estimate", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-on-surface-variant font-label-bold text-label-bold uppercase hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h5 className="font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest">Services</h5>
          <ul className="space-y-4">
            {["Landscaping", "Hardscaping", "Decks", "Concrete"].map((s) => (
              <li key={s}>
                <Link
                  href="/services"
                  className="text-on-surface-variant font-label-bold text-label-bold uppercase hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 className="font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest">Contact</h5>
          <p className="text-on-surface-variant font-body-md text-body-md mb-4">
            {COMPANY.city}
            <br />
            Serving Northeast Ohio
          </p>
          <a href={COMPANY.phoneHref} className="text-primary font-label-bold text-label-bold block mb-4 hover:underline">
            {COMPANY.phone}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors break-all"
          >
            {COMPANY.email}
          </a>
        </div>
      </div>

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <p className="font-label-bold text-label-bold uppercase text-on-surface mb-4 tracking-widest">Service Areas</p>
        <p className="text-on-surface-variant font-body-md text-body-md">
          Proudly serving Wadsworth and{" "}
          {CITIES.map((c: { slug: string; name: string }, i: number) => (
            <span key={c.slug}>
              <Link href={`/service-area/${c.slug}`} className="text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-surface-container-highest">
                {c.name}
              </Link>
              {i < CITIES.length - 1 ? ", " : ""}
            </span>
          ))}
          , Ohio.
        </p>
      </div>

      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-12 border-t border-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-on-surface-variant font-label-bold text-sm tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} Randolph Construction. Built Strong. Built to Last.
        </span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Legal">
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Use", href: "/terms" },
            { label: "Accessibility", href: "/accessibility" },
            { label: "Crew Login", href: "/timeclock" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70">
          Site built by{" "}
          <a
            href="https://adamloomismarketing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-on-surface transition-colors"
          >
            Adam Loomis Marketing
          </a>
        </span>
      </div>
    </footer>
  );
}
