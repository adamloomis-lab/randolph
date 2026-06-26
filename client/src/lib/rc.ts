// Randolph Construction image assets + a back-compat COMPANY re-export.
// Business facts live in client/src/config/business.js — import from there.
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "../config/business.js";

const B = "/images/randolph";

export const RC = {
  logo: `${B}/logo-randolph.webp`,
  collage: `${B}/brand-collage.webp`,

  // Home
  hero: `${B}/hero-firepit.webp`,
  svcHardscapes: `${B}/home-3.webp`,
  svcLawns: `${B}/home-4.webp`,
  svcConcrete: `${B}/home-5.webp`,
  svcPavers: `${B}/home-6.webp`,
  portfolioMain: `${B}/home-7.webp`,
  portfolioSteps: `${B}/home-8.webp`,
  portfolioFleet: `${B}/home-9.webp`,

  // Services
  svcHero: `${B}/services-1.webp`,
  svcPaving: `${B}/services-2.webp`,
  svcRetaining: `${B}/services-3.webp`,
  svcOutdoor: `${B}/services-4.webp`,
  svcConcrete2: `${B}/services-5.webp`,
  svcLawns2: `${B}/services-6.webp`,
  svcCta: `${B}/services-7.webp`,

  // Gallery
  galHero: `${B}/gallery-1.webp`,
  gal2: `${B}/gallery-2.webp`,
  gal3: `${B}/gallery-3.webp`,
  gal4: `${B}/gallery-4.webp`,
  gal5: `${B}/gallery-5.webp`,
  gal6: `${B}/gallery-6.webp`,

  // Estimate
  estHero: `${B}/estimate-1.webp`,
  est2: `${B}/estimate-2.webp`,
  est3: `${B}/estimate-3.webp`,
};

// Back-compat shape used by existing components. All values flow from BUSINESS.
export const COMPANY = {
  name: BUSINESS.name,
  tagline: BUSINESS.tagline,
  phone: BUSINESS.phone,
  phoneHref: BUSINESS.phoneHref,
  email: BUSINESS.email,
  emailHref: BUSINESS.emailHref,
  city: `${BUSINESS.address.locality}, ${BUSINESS.address.regionFull}`,
  area: BUSINESS.serviceAreaCopy,
};
