import { Link, useRoute, Redirect } from "wouter";
import Img from "@/components/Img";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { IMG } from "@/lib/images";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { CITIES, SITE, citySeo } from "@/lib/seoData.js";

interface City {
  slug: string;
  name: string;
  county: string;
  nearby: string[];
  blurb: string;
}

const SERVICES = [
  { title: "Landscaping", img: IMG.lawn, anchor: "landscaping", desc: "Routine lawn care and full landscape design that keeps your property sharp season after season." },
  { title: "Hardscaping", img: IMG.heroPatio, anchor: "hardscaping", desc: "Unilock patios, retaining walls, and fire pit areas built to outlast Northeast Ohio winters." },
  { title: "Custom Decks", img: IMG.deckC, anchor: "decks", desc: "Premium composite decks that resist warping and fading — designed around how you live outside." },
  { title: "Concrete", img: IMG.concrete1, anchor: "concrete", desc: "Driveways, sidewalks, pads, and patios — clean, level, and built to last." },
];

const GALLERY = [IMG.patio5, IMG.deckA, IMG.concrete2, IMG.patio1];

export default function ServiceArea() {
  const [, params] = useRoute("/service-area/:city");
  const city: City | undefined = CITIES.find((c: City) => c.slug === params?.city);

  if (!city) return <Redirect to="/404" />;

  const seo = citySeo(city);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: SITE.name,
    url: `${SITE.url}${seo.path}`,
    telephone: SITE.phoneDigits,
    email: SITE.email,
    image: `${SITE.url}${SITE.defaultImage}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: `${city.name}, OH` },
    knowsAbout: SITE.services,
  };

  useSeo({ title: seo.title, description: seo.description, path: seo.path, jsonLd });

  return (
    <div className="bg-background text-on-background font-body-md">
      <Nav />

      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Img src={IMG.heroPatio} alt={`Hardscape and outdoor living project near ${city.name}, Ohio`} loading="eager" fetchPriority="high" className="scrim w-full h-full object-cover grayscale opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
          </div>
          <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
            <div className="inline-flex items-center gap-2 bg-surface-container-highest/90 backdrop-blur px-4 py-1 border-l-4 border-primary mb-6">
              <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <span className="font-label-bold text-label-bold uppercase tracking-widest text-white">
                {city.county} · Service Area
              </span>
            </div>
            <h1 className="font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none max-w-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Landscaping, Hardscaping &amp; Concrete in <span className="text-primary">{city.name}, OH</span>
            </h1>
            <p className="font-body-lg text-body-lg text-white max-w-2xl mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{city.blurb}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-10 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95">
                Get Your Free Quote
              </Link>
              <a href={BUSINESS.phoneHref} className="border-2 border-surface-container-highest hover:border-on-surface text-on-surface font-label-bold text-label-bold uppercase px-10 py-4 transition-all text-center">
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Services in this city */}
        <section className="py-20 md:py-28 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <Reveal>
              <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">What We Build in {city.name}</span>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase mb-12 leading-none max-w-3xl">
                Full Outdoor Solutions for {city.name} Homeowners
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <Link href={`/services#${s.anchor}`} className="group relative aspect-[3/4] overflow-hidden bg-surface-container-high border border-surface-container-highest block">
                    <Img src={s.img} alt={`${s.title} in ${city.name}, Ohio`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale opacity-50 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="font-headline-md text-2xl uppercase mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                      <p className="text-on-surface-variant text-sm">{s.desc}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Local crew / nearby areas */}
        <section className="py-20 md:py-28 bg-background">
          <Reveal className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="grid grid-cols-2 gap-3">
              {GALLERY.map((src, i) => (
                <div key={i} className="overflow-hidden border border-surface-container-highest h-44 group">
                  <Img src={src} alt={`Completed project near ${city.name}, Ohio`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
            </div>
            <div>
              <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">Local &amp; Dependable</span>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight">
                A {city.county} Crew You Can Count On
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-4">
                Randolph Construction is based in Wadsworth and serves {city.name} and the surrounding {city.county}{" "}
                area with one dependable crew — no juggling multiple contractors. From the first walkthrough to the
                final cleanup, you work with the same team that does the work.
              </p>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
                We also serve nearby {city.nearby.join(", ")}. Premium materials, clean job sites, and craftsmanship
                built strong to last.
              </p>
              <Link href="/gallery" className="inline-flex items-center gap-3 border-2 border-surface-container-highest hover:border-primary text-on-surface px-8 py-4 font-label-bold text-label-bold uppercase transition-colors">
                See Our Work <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-surface-container-lowest concrete-texture border-t-4 border-surface-container-highest text-center">
          <Reveal className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-display-lg text-3xl md:text-display-lg uppercase mb-6">
              Ready to Upgrade Your {city.name} Property?
            </h2>
            <p className="text-on-surface-variant font-body-lg mb-10">
              Tell us about your project and we'll get you a free, no-pressure estimate — usually within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-12 py-5 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95">
                Get a Free Quote
              </Link>
              <a href={BUSINESS.phoneHref} className="border-2 border-surface-container-highest text-on-surface font-label-bold text-label-bold uppercase px-12 py-5 hover:bg-surface-container-high transition-colors">
                Call {SITE.phone}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
