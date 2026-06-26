import { useEffect } from "react";
import Img from "@/components/Img";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import { Link } from "wouter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { IMG } from "@/lib/images";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO } from "@/lib/seoData.js";

interface ServiceProps {
  id: string;
  phase: string;
  label: string;
  headline: string;
  copy: string[];
  img: string;
  imgAlt: string;
  gallery: { src: string; alt: string }[];
  btnLabel: string;
  reverse?: boolean;
}

const SERVICES: ServiceProps[] = [
  {
    id: "landscaping",
    phase: "01",
    label: "Landscaping",
    headline: "Lawn Care and Landscaping That Makes Your Property Stand Out",
    copy: [
      "Whether you need routine lawn maintenance or a full landscape design, we bring the same care and attention to every yard. We work with homeowners across Wadsworth, Medina County, and surrounding communities to keep properties looking sharp season after season.",
      "A well-maintained lawn is the first thing people notice. We take that seriously — showing up on schedule, cutting clean lines, and making sure your property looks its best whether it's a spring cleanup or a full summer maintenance plan.",
    ],
    img: IMG.lawn,
    imgAlt: "Lawn care and landscaping in Wadsworth and Northeast Ohio",
    gallery: [
      { src: IMG.lawn2, alt: "Landscaping project in Northeast Ohio" },
      { src: IMG.lawn3, alt: "Lawn maintenance in Wadsworth, Ohio" },
      { src: IMG.lawn4, alt: "Lawn mowing service in Northeast Ohio" },
      { src: IMG.lawn5, alt: "Landscape care in Wadsworth, Ohio" },
    ],
    btnLabel: "Get a Landscaping Quote",
  },
  {
    id: "hardscaping",
    phase: "02",
    label: "Hardscaping & Outdoor Spaces",
    headline: "Patios, Walkways, and Outdoor Living Built to Last",
    copy: [
      "We specialize in Unilock hardscape systems — pavers, retaining walls, fire pit areas, and outdoor living spaces designed to hold up against Northeast Ohio winters and look great doing it. If you can imagine it in your backyard, we can build it.",
      "From a simple walkway to a full multi-level outdoor entertainment area, we design and build spaces that fit how you actually use your yard. Every project is installed with proper base prep and drainage so it stays level and clean for years.",
    ],
    img: IMG.heroPatio,
    imgAlt: "Unilock hardscape patio and fire pit in Wadsworth, Ohio",
    gallery: [
      { src: IMG.patio1, alt: "Hardscape patio construction in Wadsworth, Ohio" },
      { src: IMG.patio2, alt: "Paver patio installation in Northeast Ohio" },
      { src: IMG.patio3, alt: "Retaining wall and hardscape in Wadsworth, Ohio" },
      { src: IMG.crew, alt: "Completed fire pit seating area in Northeast Ohio" },
    ],
    btnLabel: "Get a Hardscaping Quote",
    reverse: true,
  },
  {
    id: "decks",
    phase: "03",
    label: "Custom Composite Decks",
    headline: "Decks Built for How You Actually Live Outside",
    copy: [
      "We build custom composite decks using premium materials that resist warping, fading, and wear. No low-grade lumber, no cutting corners. Just a deck that looks incredible the day it's finished and still looks great five years from now.",
      "Every deck we build is custom designed to fit your home and your lifestyle. Whether you want a simple platform deck or a multi-level space with built-in seating, we handle the design, the permitting process, and the full build from start to finish.",
    ],
    img: IMG.deckA,
    imgAlt: "Custom composite deck installation in Wadsworth, Ohio",
    gallery: [
      { src: IMG.deckB, alt: "Composite deck with fire pit seating area in Northeast Ohio" },
      { src: IMG.deckC, alt: "Custom composite deck with chevron pattern in Wadsworth, Ohio" },
      { src: IMG.deckD, alt: "Composite deck with railing in Northeast Ohio" },
      { src: IMG.deckE, alt: "Ground-level composite deck with built-in seating in Wadsworth, Ohio" },
    ],
    btnLabel: "Get a Deck Quote",
  },
  {
    id: "concrete",
    phase: "04",
    label: "Concrete Services",
    headline: "Clean Concrete Work Done Right the First Time",
    copy: [
      "From driveways and sidewalks to pads and patios, our concrete work is clean, level, and built to last. We handle the full job — prep, pour, and finish — so you get a consistent result without coordinating multiple crews.",
      "Good concrete starts with good prep. We take the time to grade properly, set forms right, and pour with care so you don't end up with cracking, settling, or drainage problems down the road. One crew, one point of contact, done right.",
    ],
    img: IMG.concrete4,
    imgAlt: "Concrete driveway and patio work in Wadsworth, Ohio",
    gallery: [
      { src: IMG.concrete1, alt: "Concrete pour in progress in Northeast Ohio" },
      { src: IMG.concrete2, alt: "Concrete slab finishing in Wadsworth, Ohio" },
      { src: IMG.concrete3, alt: "Concrete driveway installation in Northeast Ohio" },
    ],
    btnLabel: "Get a Concrete Quote",
    reverse: true,
  },
];

function ServiceSection({ id, phase, label, headline, copy, img, imgAlt, gallery, btnLabel, reverse }: ServiceProps) {
  return (
    <section id={id} className="py-20 md:py-28 border-b border-surface-container-highest scroll-mt-24">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <div style={{ direction: "ltr" }} className="relative group">
            <div className="absolute -inset-3 bg-primary-container/10 blur-2xl group-hover:bg-primary-container/20 transition-all" />
            <Img
              src={img}
              alt={imgAlt}
              className="relative z-10 w-full h-[320px] md:h-[440px] object-cover border-l-4 border-primary-container grayscale hover:grayscale-0 transition-all duration-700 bevel-stone"
            />
          </div>
          <div style={{ direction: "ltr" }}>
            <span className="font-label-bold text-label-bold text-primary uppercase tracking-[0.3em]">Phase {phase}</span>
            <p className="font-label-bold text-label-bold uppercase text-on-surface-variant mt-1 mb-3">{label}</p>
            <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight">{headline}</h2>
            {copy.map((para, i) => (
              <p key={i} className="text-on-surface-variant font-body-lg text-body-lg mb-4">
                {para}
              </p>
            ))}
            <Link
              href="/contact"
              className="mt-2 inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 font-label-bold text-label-bold uppercase metallic-gradient beveled-edge industrial-glow transition-all active:scale-95"
            >
              {btnLabel} <span aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {gallery.map((g) => (
            <div key={g.src} className="overflow-hidden border border-surface-container-highest h-40 group">
              <Img src={g.src} alt={g.alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  useSeo({ ...PAGE_SEO["/services"], path: "/services" });

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md">
      <Nav />

      <main id="main-content" className="pt-32">
        {/* Hero */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto text-center mb-8 md:mb-12">
          <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">What We Do</span>
          <h1 className="font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none">
            Outdoor Services Built for <span className="text-primary">Northeast Ohio</span> Homeowners
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            From a fresh-cut lawn to a full backyard transformation — Randolph Construction brings the skills, the
            materials, and the work ethic to get it done right. Proudly serving Wadsworth and surrounding Northeast Ohio
            communities.
          </p>
        </section>

        <div className="industrial-divider mb-4" />

        {SERVICES.map((s) => (
          <Reveal key={s.id}>
            <ServiceSection {...s} />
          </Reveal>
        ))}

        {/* Bottom CTA */}
        <section className="py-24 md:py-32 px-margin-mobile md:px-margin-desktop text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display-lg text-4xl md:text-display-lg uppercase mb-6">Not Sure Where to Start?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              Tell us what you're thinking and we'll walk you through what makes sense for your property and your budget.
              No pressure, just good advice from a crew that's done this for years.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="bg-primary-container text-on-primary-container px-12 py-5 font-label-bold text-label-bold uppercase tracking-widest metallic-gradient beveled-edge industrial-glow transition-all active:scale-95"
              >
                Get a Free Quote
              </Link>
              <a
                href={BUSINESS.phoneHref}
                className="border-2 border-surface-container-highest text-on-surface px-12 py-5 font-label-bold text-label-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors"
              >
                Call {BUSINESS.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
