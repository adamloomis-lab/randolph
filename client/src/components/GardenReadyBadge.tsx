import Img from "@/components/Img";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";

interface GardenReadyBadgeProps {
  variant?: "band" | "inline";
}

/**
 * "Preferred Installer Partner of GardenReady" attribution.
 * - variant="band": full-width strip (used on the homepage).
 * - variant="inline": compact lockup (used in the footer).
 */
export default function GardenReadyBadge({ variant = "band" }: GardenReadyBadgeProps) {
  const partner = BUSINESS.partners.find((p: { name: string }) => p.name === "GardenReady");
  if (!partner) return null;

  if (variant === "inline") {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 group"
        aria-label={`${partner.relationship} of GardenReady (opens in a new tab)`}
      >
        <span className="font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
          {partner.relationship} of
        </span>
        <Img src={partner.logoWhite} alt="GardenReady" loading="eager" className="h-4 w-auto opacity-80 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  }

  return (
    <section className="py-12 bg-background border-b border-surface-container-highest">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 group"
          aria-label={`${partner.relationship} of GardenReady (opens in a new tab)`}
        >
          <span className="font-label-bold text-label-bold uppercase tracking-[0.25em] text-on-surface-variant text-center">
            {partner.relationship} of
          </span>
          <Img
            src={partner.logoWhite}
            alt="GardenReady"
            loading="eager"
            className="h-8 md:h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    </section>
  );
}
