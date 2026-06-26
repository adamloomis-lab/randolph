// Per-route SEO metadata (titles/descriptions) + city landing-page data.
// Business facts (NAP, geo, foundingDate, …) live in client/src/config/business.js
// and are re-exported here as SITE for backwards-compatibility with existing imports.
import { BUSINESS } from "../config/business.js";

export const SITE = {
  url: BUSINESS.url,
  name: BUSINESS.name,
  phone: BUSINESS.phone,
  phoneDigits: BUSINESS.phoneDigits,
  email: BUSINESS.email,
  city: BUSINESS.serviceCity,
  region: BUSINESS.address.region,
  defaultImage: BUSINESS.defaultImage,
  services: BUSINESS.services,
};

// Re-export for prerender / pages that want everything.
export { BUSINESS };

// Meta for the core static routes.
export const PAGE_SEO = {
  "/": {
    title: "Randolph Construction | Landscaping, Hardscaping & Concrete in Wadsworth, OH",
    description:
      "Randolph Construction builds patios, hardscapes, custom decks, lawns, and concrete for homeowners across Wadsworth and Northeast Ohio. Built strong, built to last. Free quotes.",
  },
  "/services": {
    title: "Our Services — Landscaping, Hardscaping, Decks & Concrete | Randolph Construction",
    description:
      "Lawn care and landscaping, Unilock hardscapes and patios, custom composite decks, and concrete driveways and patios across Wadsworth and Northeast Ohio.",
  },
  "/gallery": {
    title: "Project Gallery — Patios, Decks, Concrete & Landscaping | Randolph Construction",
    description:
      "See real patios, retaining walls, composite decks, concrete, and landscaping projects Randolph Construction has built for homeowners across Northeast Ohio.",
  },
  "/contact": {
    title: "Contact & Free Quote | Randolph Construction — Wadsworth, OH",
    description:
      "Request a free estimate from Randolph Construction. Landscaping, hardscaping, decks, and concrete in Wadsworth and Northeast Ohio. Call (330) 400-6338.",
  },
  "/privacy": {
    title: "Privacy Policy | Randolph Construction",
    description:
      "How Randolph Construction collects, uses, and protects your information when you visit our site or request an estimate.",
  },
  "/terms": {
    title: "Terms of Use | Randolph Construction",
    description: "The terms that govern your use of the Randolph Construction website.",
  },
  "/accessibility": {
    title: "Accessibility Statement | Randolph Construction",
    description:
      "Randolph Construction's commitment to keeping our website accessible to everyone, targeting WCAG 2.1 AA.",
  },
};

// Surrounding-community landing pages.
export const CITIES = [
  {
    slug: "medina",
    name: "Medina",
    county: "Medina County",
    nearby: ["Montrose", "Brunswick", "Seville", "Wadsworth"],
    blurb:
      "Just up the road from our Wadsworth home base, Medina is one of our most-requested service areas. From historic homes near the Square to newer builds out toward Montrose, we help Medina homeowners add patios, retaining walls, and clean concrete that hold up year after year.",
  },
  {
    slug: "norton",
    name: "Norton",
    county: "Summit County",
    nearby: ["Barberton", "Wadsworth", "Doylestown", "Clinton"],
    blurb:
      "Norton sits right between our Wadsworth shop and Akron, so we're on job sites here constantly. Whether it's a fresh paver patio, a fire pit area, or a new driveway, we bring the same crew and the same standards to every Norton property.",
  },
  {
    slug: "barberton",
    name: "Barberton",
    county: "Summit County",
    nearby: ["Norton", "Akron", "Wadsworth", "Clinton"],
    blurb:
      "The Magic City's mix of established neighborhoods and lakeside lots makes for great outdoor projects. We help Barberton homeowners turn tired yards into hardscaped patios, composite decks, and durable concrete built for Northeast Ohio winters.",
  },
  {
    slug: "rittman",
    name: "Rittman",
    county: "Wayne County",
    nearby: ["Wadsworth", "Doylestown", "Sterling", "Orrville"],
    blurb:
      "Rittman is a quick trip from Wadsworth, and we're proud to serve its homeowners with full outdoor solutions. From lawn care and landscaping to stamped concrete and custom decks, we handle the whole project with one dependable crew.",
  },
  {
    slug: "doylestown",
    name: "Doylestown",
    county: "Wayne County",
    nearby: ["Rittman", "Wadsworth", "Clinton", "Sterling"],
    blurb:
      "Doylestown's larger lots are perfect for outdoor living — patios, fire pits, retaining walls, and decks that make the most of the space. We bring premium Unilock hardscapes and clean concrete work to homeowners throughout the village and surrounding Wayne County.",
  },
];

export function citySeo(city) {
  return {
    path: `/service-area/${city.slug}`,
    title: `Landscaping, Hardscaping & Concrete in ${city.name}, OH | Randolph Construction`,
    description: `Randolph Construction serves ${city.name}, ${city.county} with patios, hardscapes, custom decks, lawn care, and concrete. Built strong, built to last. Free quotes — call ${SITE.phone}.`,
  };
}
