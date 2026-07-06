// Single source of truth for business facts.
// Imported by both the Vite client and the Node prerender script.
// If you're about to hardcode an address or phone number, stop and edit this file.

export const BUSINESS = {
  // Identity
  name: "Randolph Construction",
  legalName: "Randolph Construction",
  tagline: "Built Strong. Built to Last.",
  foundingDate: "2023", // 3 years in business as of 2026
  yearsInBusiness: 3,

  // Web
  url: "https://randolph.construction",
  defaultImage: "/images/randolph/hero-firepit.webp",

  // Phone / email (one set of formats — never hardcode these elsewhere)
  phone: "(330) 400-6338",
  phoneDigits: "+13304006338",
  phoneHref: "tel:+13304006338",
  email: "bmrandolph1111@gmail.com",
  emailHref: "mailto:bmrandolph1111@gmail.com",

  // Address — Wadsworth-based; no public street address
  address: {
    locality: "Wadsworth",
    region: "OH",
    regionFull: "Ohio",
    country: "US",
  },

  // Geo (approximate centroid of Wadsworth, OH)
  geo: {
    latitude: 41.0259,
    longitude: -81.7298,
  },

  // Service area
  serviceCity: "Wadsworth",
  serviceRegion: "Northeast Ohio",
  serviceAreaCities: ["Wadsworth", "Medina", "Norton", "Barberton", "Rittman", "Doylestown"],
  serviceAreaCopy:
    "Wadsworth, Medina, Norton, Barberton, and surrounding Northeast Ohio communities",

  // Services
  services: ["Landscaping", "Hardscaping", "Custom Composite Decks", "Concrete"],
  serviceFormOptions: [
    "Landscaping",
    "Hardscaping",
    "Custom Composite Deck",
    "Concrete Services",
    "Not Sure Yet",
  ],

  // Differentiator (the "why us")
  differentiator:
    "One crew, all the skills — from landscaping and hardscaping to custom decks and concrete, you hire one dependable team that handles the whole project.",

  // Hours — not yet confirmed; leaving null so we don't fabricate
  hours: null,

  // Social profiles — none confirmed yet; leaving null so they don't ship as schema sameAs
  social: {
    facebook: null,
    instagram: null,
  },

  // Schema.org type
  schemaType: "GeneralContractor",
  priceRange: "$$",

  // Partnerships
  partners: [
    {
      name: "GardenReady",
      relationship: "Preferred Installer Partner",
      url: "https://gardenready.co",
      logoWhite: "/images/randolph/gardenready-white.webp",
    },
  ],

  // USDA hardiness zone (Wadsworth / Medina County, NE Ohio)
  hardinessZone: "6a",
};

// Hour intervals formatted for schema.org `openingHoursSpecification` when filled in:
//   [{ dayOfWeek: ["Monday","Tuesday",…], opens: "08:00", closes: "18:00" }]

// ---------------------------------------------------------------------------
// JSON-LD helpers — used by both useSeo (client) and the prerender script (Node).
// ---------------------------------------------------------------------------

/** LocalBusiness/GeneralContractor schema. Pass {city, path} for a city page. */
export function localBusinessJsonLd({ path = "/", areaServedCity = null } = {}) {
  const sameAs = Object.values(BUSINESS.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": BUSINESS.schemaType,
    name: BUSINESS.name,
    url: `${BUSINESS.url}${path}`,
    telephone: BUSINESS.phoneDigits,
    email: BUSINESS.email,
    image: `${BUSINESS.url}${BUSINESS.defaultImage}`,
    priceRange: BUSINESS.priceRange,
    foundingDate: BUSINESS.foundingDate,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: areaServedCity
      ? { "@type": "City", name: `${areaServedCity}, OH` }
      : [BUSINESS.serviceCity, ...BUSINESS.serviceAreaCities.filter((c) => c !== BUSINESS.serviceCity)].map(
          (n) => ({ "@type": "City", name: `${n}, OH` })
        ),
    knowsAbout: BUSINESS.services,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** WebSite schema for the homepage. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS.name,
    url: BUSINESS.url,
    inLanguage: "en-US",
  };
}

/** BreadcrumbList schema — pass [{name, path}, …] in order from Home → leaf. */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BUSINESS.url}${it.path}`,
    })),
  };
}
