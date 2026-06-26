// Post-build prerender — two phases:
//   1. Bake per-route <head> (title, meta, canonical, OG, JSON-LD) into HTML.
//   2. SSR the React app (via dist-ssr/entry-server.js) and inject the body
//      so every route ships real content for AI crawlers and search engines.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const { PAGE_SEO, CITIES, citySeo } = await import(join(root, "client/src/lib/seoData.js"));
const { BUSINESS, localBusinessJsonLd, websiteJsonLd, breadcrumbJsonLd } = await import(
  join(root, "client/src/config/business.js")
);

const template = readFileSync(join(dist, "index.html"), "utf8");

// Private app routes (crew time clock) get a clean empty-#root shell so they
// client-render without a hydration mismatch, and carry noindex so they stay
// out of search. Served via the /timeclock* redirects in netlify.toml.
writeFileSync(
  join(dist, "app-shell.html"),
  template.replace("</head>", '<meta name="robots" content="noindex,nofollow" /></head>')
);

const escAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escJsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

function buildHead({ title, description, path, jsonLdNodes }) {
  const url = `${BUSINESS.url}${path}`;
  const image = `${BUSINESS.url}${BUSINESS.defaultImage}`;
  const tags = [
    `<link rel="canonical" href="${escAttr(url)}" />`,
  ];
  // Preload the LCP hero image only on routes that use it as their hero.
  if (path === "/") {
    tags.push(
      `<link rel="preload" as="image" href="/images/randolph/hero-firepit.webp" fetchpriority="high" />`
    );
  }
  tags.push(
    `<meta property="og:title" content="${escAttr(title)}" />`,
    `<meta property="og:description" content="${escAttr(description)}" />`,
    `<meta property="og:url" content="${escAttr(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:image" content="${escAttr(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(title)}" />`,
    `<meta name="twitter:description" content="${escAttr(description)}" />`,
    `<meta name="twitter:image" content="${escAttr(image)}" />`
  );
  for (const node of jsonLdNodes || []) {
    tags.push(`<script type="application/ld+json">${escJsonLd(node)}</script>`);
  }
  return tags.join("\n    ");
}

function render({ title, description, path, jsonLdNodes }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escAttr(description)}" />`
    );
  } else {
    html = html.replace(
      /<\/title>/,
      `</title>\n    <meta name="description" content="${escAttr(description)}" />`
    );
  }
  html = html.replace(
    /<\/head>/,
    `    ${buildHead({ title, description, path, jsonLdNodes })}\n  </head>`
  );
  return html;
}

function writeRoute(path, html) {
  if (path === "/") {
    writeFileSync(join(dist, "index.html"), html);
  } else {
    // Flat `<route>.html` files so Netlify Pretty URLs serve them at the
    // no-trailing-slash path with a direct 200 (no directory-index redirect).
    const full = join(dist, `${path.replace(/^\//, "")}.html`);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, html);
  }
}

// ---------------------------------------------------------------------------
// Route → metadata + JSON-LD nodes.
// ---------------------------------------------------------------------------
const HUMAN_CRUMB = {
  "/services": "Services",
  "/gallery": "Project Gallery",
  "/contact": "Contact",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Use",
  "/accessibility": "Accessibility",
};

const routes = [];

// Static routes
for (const [path, meta] of Object.entries(PAGE_SEO)) {
  const jsonLdNodes = [];
  if (path === "/") {
    jsonLdNodes.push(localBusinessJsonLd({ path: "/" }));
    jsonLdNodes.push(websiteJsonLd());
  } else {
    jsonLdNodes.push(
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: HUMAN_CRUMB[path] || meta.title, path },
      ])
    );
  }
  routes.push({ path, ...meta, jsonLdNodes });
}

// City landing pages
for (const city of CITIES) {
  const seo = citySeo(city);
  routes.push({
    path: seo.path,
    title: seo.title,
    description: seo.description,
    jsonLdNodes: [
      localBusinessJsonLd({ path: seo.path, areaServedCity: city.name }),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Service Areas", path: "/" },
        { name: `${city.name}, OH`, path: seo.path },
      ]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Phase 1 — Bake per-route <head> (title, meta, canonical, OG, JSON-LD).
// ---------------------------------------------------------------------------
for (const r of routes) {
  writeRoute(r.path, render(r));
}
console.log(`✓ baked head for ${routes.length} routes`);

// ---------------------------------------------------------------------------
// Phase 2 — SSR the React app and inject the body into each route's HTML so
// AI crawlers (and search engines) see real content, not an empty #root.
// ---------------------------------------------------------------------------
const { render: ssrRender } = await import(join(root, "dist-ssr", "entry-server.js"));

function injectBody(html, bodyHtml) {
  // Replace the empty <div id="root"></div> with the SSR'd markup.
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${bodyHtml}</div>`
  );
}

function readRoute(path) {
  if (path === "/") return readFileSync(join(dist, "index.html"), "utf8");
  return readFileSync(join(dist, `${path.replace(/^\//, "")}.html`), "utf8");
}

for (const r of routes) {
  let bodyHtml;
  try {
    bodyHtml = ssrRender(r.path);
  } catch (e) {
    console.warn(`  SSR FAILED for ${r.path}: ${e.message} — keeping head-only HTML`);
    continue;
  }
  const html = readRoute(r.path);
  writeRoute(r.path, injectBody(html, bodyHtml));
  console.log(`  ssr-prerendered  ${r.path}  (${bodyHtml.length.toLocaleString()} chars)`);
}
console.log(`\n✓ prerendered ${routes.length} routes (head + body)`);
