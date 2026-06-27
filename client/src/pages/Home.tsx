import { useEffect, useState } from "react";
import Img from "@/components/Img";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { RC } from "@/lib/rc";
import { IMG } from "@/lib/images";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO, SITE, CITIES } from "@/lib/seoData.js";
import { FloatField, IconCardSelect, SuccessCheck, type IconCardOption } from "@/components/FluidField";
import { Trees, Layers, Frame, Truck, HelpCircle, Phone } from "lucide-react";

const SERVICE_CARDS: IconCardOption[] = [
  { value: "Landscaping", label: "Landscaping", icon: Trees },
  { value: "Hardscaping", label: "Hardscaping", icon: Layers },
  { value: "Custom Composite Deck", label: "Composite Deck", icon: Frame },
  { value: "Concrete Services", label: "Concrete", icon: Truck },
  { value: "Not Sure Yet", label: "Not Sure Yet", icon: HelpCircle },
];

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");

const VALUE_PROPS = [
  { icon: "construction", title: "Built on Hard Work, Not Hype", desc: "This business started with a single lawn and a stubborn mower. Today it's grown through grit, skill, and a reputation for showing up and doing the job right." },
  { icon: "workspace_premium", title: "Premium Materials, No Corners Cut", desc: "We work with Unilock for patios and composite materials for decks, because your outdoor space should look amazing and hold up for years." },
  { icon: "groups", title: "One Crew, All the Skills", desc: "From concrete and landscaping to full backyard builds, you're hiring a team that handles it all. No juggling multiple contractors." },
  { icon: "flag", title: "Focused on the Finish Line", desc: "We don't just start strong, we finish strong. Clean work, clear communication, and a backyard you'll actually want to show off." },
];

const SERVICES = [
  { spec: "01", title: "Landscaping", img: IMG.lawn, href: "/services#landscaping", desc: "Routine lawn care or a full landscape design — we keep every yard looking sharp season after season." },
  { spec: "02", title: "Hardscaping & Outdoor Spaces", img: IMG.heroPatio, href: "/services#hardscaping", desc: "Unilock patios, retaining walls, fire pit areas, and outdoor living spaces built to outlast Northeast Ohio winters." },
  { spec: "03", title: "Custom Composite Decks", img: IMG.deckC, href: "/services#decks", desc: "Premium composite decks that resist warping, fading, and wear — built for how you actually live outside." },
  { spec: "04", title: "Concrete Services", img: IMG.concrete1, href: "/services#concrete", desc: "Driveways, sidewalks, pads, and patios. Clean, level, and built to last — prep, pour, and finish handled in full." },
];

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSeo({
    ...PAGE_SEO["/"],
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phoneDigits,
      email: SITE.email,
      image: `${SITE.url}${SITE.defaultImage}`,
      priceRange: "$$",
      address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: "US" },
      areaServed: [SITE.city, ...CITIES.map((c: { name: string }) => c.name)].map((n) => ({ "@type": "City", name: `${n}, OH` })),
      knowsAbout: SITE.services,
    },
  });

  const [form, setForm] = useState({ name: "", email: "", service: "Landscaping", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.name || !form.email) {
      setErrorMsg("Please add your name and email.");
      return;
    }
    setSubmitting(true);
    const captured = form.name.trim().split(/\s+/)[0];
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setFirstName(captured);
      setSubmitted(true);
    } catch {
      setErrorMsg("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg focus:text-gray-900">Skip to content</a>
      <Nav />
      <main id="main-content">

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Img src={RC.hero} alt="Illuminated patio and fire pit in Wadsworth, Ohio" loading="eager" fetchPriority="high" className="scrim w-full h-full object-cover grayscale opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/25" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-surface-container-highest/90 backdrop-blur px-4 py-1 border-l-4 border-primary">
            <span aria-hidden="true" className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              location_on
            </span>
            <span className="font-label-bold text-label-bold uppercase tracking-widest text-white">Wadsworth &amp; Northeast Ohio</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-6xl uppercase mb-6 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            From the Neighbor's Yard to <span className="text-primary">Neighborhood Favorite</span>
          </h1>
          <p className="font-body-lg text-body-lg text-white max-w-xl mx-auto mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            Quality craftsmanship for patios, lawns, and outdoor spaces across Wadsworth and Northeast Ohio.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/contact" className="w-full md:w-auto bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-12 py-5 metallic-gradient beveled-edge industrial-glow transition-all text-lg active:scale-95">
              Get Your Free Quote
            </Link>
            <Link href="/services" className="w-full md:w-auto border-2 border-surface-container-highest hover:border-on-surface text-on-surface font-label-bold text-label-bold uppercase px-12 py-5 transition-all text-lg">
              View Our Services
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 motion-safe:animate-bounce">
          <span className="font-label-bold text-label-bold uppercase text-on-surface-variant rotate-90">Scroll</span>
          <span className="material-symbols-outlined text-on-surface-variant">keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* Why Randolph — real value props */}
      <section className="py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest relative overflow-hidden">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="mb-12 md:mb-16">
            <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">Why Randolph</span>
            <h2 className="font-headline-lg text-4xl md:text-headline-lg uppercase leading-none">Why Homeowners Hire Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {VALUE_PROPS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="group border-l-2 border-surface-container-highest pl-8 py-4 hover:border-primary transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <span aria-hidden="true" className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {p.icon}
                  </span>
                  <h3 className="font-headline-md text-2xl md:text-headline-md uppercase">{p.title}</h3>
                </div>
                <p className="text-on-surface-variant font-body-lg text-body-lg">{p.desc}</p>
                <div className="h-1 w-12 mt-4 bg-surface-container-highest group-hover:w-full group-hover:bg-primary transition-all duration-500" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 md:py-32 bg-background">
        <Reveal className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative group order-last lg:order-first">
              <div className="absolute -inset-3 bg-primary-container/10 blur-2xl group-hover:bg-primary-container/20 transition-all" />
              <Img
                src={IMG.crew}
                alt="The Randolph Construction crew at a completed fire pit and seating area in Wadsworth, Ohio"
                className="relative z-10 w-full h-[340px] md:h-[460px] object-cover border-l-4 border-primary-container grayscale hover:grayscale-0 transition-all duration-700 bevel-stone"
              />
            </div>
            <div>
              <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">Our Story</span>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight">
                A Local Company Built From the Ground Up
              </h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-4">
                I started this company at 12 years old mowing lawns with help from my dad. Since then I've poured
                everything into learning the trades and building a business that delivers high-quality work and
                dependable service.
              </p>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8">
                Three years on, Randolph Construction offers full outdoor solutions — from patios and hardscapes to
                landscaping, concrete, and more. We're here to help homeowners across Wadsworth and Northeast Ohio take
                pride in their property and create the backyard they've always wanted.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 font-label-bold text-label-bold uppercase metallic-gradient beveled-edge industrial-glow transition-all active:scale-95"
              >
                Start Your Project <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Services */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">What We Do</span>
              <h2 className="font-headline-lg text-4xl md:text-headline-lg uppercase leading-none">Outdoor Services Built for Northeast Ohio</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {SERVICES.map((s, i) => (
              <Reveal key={s.spec} delay={i * 90}>
              <Link href={s.href} className="group relative aspect-[3/4] overflow-hidden bg-surface-container-high border border-surface-container-highest block">
                <Img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale opacity-50 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute top-4 right-4 rivet" />
                <div className="absolute top-4 left-4 font-label-bold text-[10px] text-surface-container-highest bg-on-surface-variant px-2 py-1">SPEC-{s.spec}</div>
                <div className="absolute bottom-0 left-0 p-6 lg:p-8 w-full">
                  <h4 className="font-headline-md text-2xl uppercase mb-2 group-hover:text-primary transition-colors leading-tight">{s.title}</h4>
                  <p className="text-on-surface-variant text-sm mb-4">{s.desc}</p>
                  <span className="font-label-bold text-label-bold uppercase text-primary inline-flex items-center gap-1">
                    Learn More <span aria-hidden="true" className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section className="py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-2 border-surface-container-highest">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">Our Work</span>
          <h2 className="font-headline-lg text-4xl md:text-headline-lg uppercase mb-12 md:mb-16 border-b-4 border-primary inline-block pb-4">
            Some Projects We've Done
          </h2>
          <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Link href="/gallery" className="md:col-span-8 group overflow-hidden border-2 border-surface-container-highest relative block h-[320px] md:h-[516px]">
              <Img src={IMG.patio5} alt="Outdoor living space in Wadsworth, Ohio" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
              <div className="absolute bottom-6 left-6 font-display-lg text-headline-md uppercase text-white drop-shadow-lg">Patios &amp; Outdoor Living</div>
            </Link>
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6">
              <Link href="/gallery" className="group overflow-hidden border-2 border-surface-container-highest relative block h-[200px] md:h-[246px]">
                <Img src={IMG.deckA} alt="Composite deck installation in Northeast Ohio" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
              </Link>
              <Link href="/gallery" className="group overflow-hidden border-2 border-surface-container-highest relative block h-[200px] md:h-[246px]">
                <Img src={IMG.concrete2} alt="Concrete work in Wadsworth, Ohio" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
              </Link>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link href="/gallery" className="inline-block border-2 border-surface-container-highest hover:border-primary text-on-surface font-label-bold text-label-bold uppercase px-10 py-4 transition-colors">
              View the Full Gallery
            </Link>
          </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA + quick quote form */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-surface-container-highest" />
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <Reveal>
            <span className="font-label-bold text-label-bold uppercase text-primary mb-6 block tracking-widest">Ready When You Are</span>
            <h2 className="font-display-lg text-4xl md:text-display-lg uppercase mb-4">Ready to Build Something You're Proud Of?</h2>
            <p className="text-on-surface-variant font-body-lg mb-12 max-w-xl mx-auto">
              Serving Wadsworth, Medina, Norton, Barberton, and the surrounding Northeast Ohio area.
            </p>
          </Reveal>

          {submitted ? (
            <div className="bg-surface-container-low border-l-4 border-primary p-8 flex flex-col items-center text-center">
              <SuccessCheck />
              <p className="font-display-lg text-headline-md uppercase text-primary mt-4 mb-2">
                Thank You, {firstName}!
              </p>
              <p className="text-on-surface-variant font-body-lg max-w-md">
                We got your request and we'll be in touch within one business day. For anything urgent, tap to call.
              </p>
              <a
                href={BUSINESS.phoneHref}
                className="mt-6 inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-3 metallic-gradient beveled-edge active:scale-95 transition-all"
              >
                <Phone size={18} strokeWidth={2} aria-hidden="true" /> {BUSINESS.phone}
              </a>
            </div>
          ) : (
            <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>Don't fill this out: <input name="bot-field" onChange={handleChange} /></label>
              </p>
              <FloatField idPrefix="home" name="name" label="Full Name" value={form.name} onChange={handleChange} autoComplete="name" required />
              <FloatField idPrefix="home" name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
              <div className="md:col-span-2">
                <IconCardSelect
                  name="service"
                  legend="Service Interested In"
                  options={SERVICE_CARDS}
                  value={form.service}
                  onChange={(v) => setForm((f) => ({ ...f, service: v }))}
                />
              </div>
              <div className="md:col-span-2">
                <FloatField idPrefix="home" name="message" label="Project Details" textarea rows={4} value={form.message} onChange={handleChange} />
              </div>
              {errorMsg && <div className="md:col-span-2 text-error font-label-bold text-label-bold uppercase">{errorMsg}</div>}
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="alm-sheen relative overflow-hidden w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-6 metallic-gradient beveled-edge industrial-glow transition-all text-xl active:scale-95 disabled:opacity-60">
                  {submitting ? "Sending..." : "Get Your Free Quote"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer />
      </main>
    </div>
  );
}
