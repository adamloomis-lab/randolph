import { useEffect, useState } from "react";
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

type Category = "Hardscaping" | "Decks" | "Concrete" | "Landscaping";

const PROJECTS: { img: string; alt: string; cat: Category }[] = [
  { img: IMG.heroPatio, alt: "Illuminated patio and fire pit in Wadsworth, Ohio", cat: "Hardscaping" },
  { img: IMG.patio1, alt: "Hardscape patio project in Wadsworth, Ohio", cat: "Hardscaping" },
  { img: IMG.patio5, alt: "Outdoor living space in Wadsworth, Ohio", cat: "Hardscaping" },
  { img: IMG.patio3, alt: "Hardscape retaining wall in Northeast Ohio", cat: "Hardscaping" },
  { img: IMG.patio7, alt: "Paver patio project in Wadsworth, Ohio", cat: "Hardscaping" },
  { img: IMG.patio8, alt: "Outdoor patio construction in Wadsworth, Ohio", cat: "Hardscaping" },
  { img: IMG.deckA, alt: "Composite deck installation in Northeast Ohio", cat: "Decks" },
  { img: IMG.deckB, alt: "Custom deck build in Northeast Ohio", cat: "Decks" },
  { img: IMG.deckC, alt: "Composite deck with chevron pattern in Wadsworth, Ohio", cat: "Decks" },
  { img: IMG.deckD, alt: "Composite deck with railing in Northeast Ohio", cat: "Decks" },
  { img: IMG.deck4, alt: "Deck and outdoor space in Northeast Ohio", cat: "Decks" },
  { img: IMG.deck1, alt: "Custom composite deck in Wadsworth, Ohio", cat: "Decks" },
  { img: IMG.concrete1, alt: "Concrete pour in progress in Northeast Ohio", cat: "Concrete" },
  { img: IMG.concrete2, alt: "Concrete work in Wadsworth, Ohio", cat: "Concrete" },
  { img: IMG.concrete3, alt: "Concrete driveway installation in Northeast Ohio", cat: "Concrete" },
  { img: IMG.concrete4, alt: "Concrete patio and pad in Wadsworth, Ohio", cat: "Concrete" },
  { img: IMG.lawn, alt: "Lawn care and mowing in Northeast Ohio", cat: "Landscaping" },
  { img: IMG.lawn2, alt: "Landscaping project in Northeast Ohio", cat: "Landscaping" },
  { img: IMG.lawn3, alt: "Lawn maintenance in Wadsworth, Ohio", cat: "Landscaping" },
  { img: IMG.lawn4, alt: "Lawn mowing service in Northeast Ohio", cat: "Landscaping" },
];

const FILTERS: ("All" | Category)[] = ["All", "Hardscaping", "Decks", "Concrete", "Landscaping"];

function Rivets() {
  return (
    <>
      <span className="rivet absolute top-1.5 left-1.5" />
      <span className="rivet absolute top-1.5 right-1.5" />
      <span className="rivet absolute bottom-1.5 left-1.5" />
      <span className="rivet absolute bottom-1.5 right-1.5" />
    </>
  );
}

export default function Gallery() {
  useSeo({ ...PAGE_SEO["/gallery"], path: "/gallery" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filter, setFilter] = useState<"All" | Category>("All");
  const visible = PROJECTS.filter((p) => filter === "All" || p.cat === filter);

  return (
    <div className="bg-background text-on-background font-body-md">
      <Nav />

      <main id="main-content" className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto concrete-texture">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-primary" />
            <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.2em]">Our Work</span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-display-lg uppercase mb-6 max-w-2xl leading-none">
            Some Projects We've Done
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            A look at patios, decks, concrete, and landscaping we've built for homeowners across Wadsworth and Northeast
            Ohio. If you can imagine it in your backyard, we can build it.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-8 py-3 font-label-bold text-label-bold uppercase border transition-all ${
                  active
                    ? "bg-surface-container-highest border-outline/20 text-primary"
                    : "bg-surface-container-low border-surface-container-highest text-on-surface-variant hover:text-primary"
                }`}
              >
                <Rivets />
                {f}
              </button>
            );
          })}
        </div>

        {/* Photo grid */}
        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {visible.map((p) => (
            <div key={p.img} className="group relative overflow-hidden border-2 border-surface-container-highest bevel-stone aspect-square">
              <Img
                src={p.img}
                alt={p.alt}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all" />
              <div className="absolute bottom-3 left-3 font-label-bold text-[10px] uppercase tracking-widest text-on-surface bg-background/70 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.cat}
              </div>
            </div>
          ))}
        </Reveal>

        {/* CTA */}
        <Reveal>
        <section className="mt-24 md:mt-32 p-8 md:p-12 bg-surface-container-high border-y-4 border-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/5 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg uppercase mb-4">
                Ready to Build Something <br />
                You're Proud Of?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                Serving Wadsworth, Medina, Norton, Barberton, and the surrounding Northeast Ohio area.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Link
                href="/contact"
                className="text-center bg-primary-container text-on-primary-container px-12 py-5 font-label-bold text-lg uppercase tracking-widest industrial-glow metallic-gradient beveled-edge transition-all active:scale-95"
              >
                Get a Free Quote
              </Link>
              <a
                href={BUSINESS.phoneHref}
                className="text-center border-2 border-surface-container-highest bg-transparent text-on-surface px-12 py-5 font-label-bold text-lg uppercase tracking-widest hover:bg-surface-container-highest transition-all"
              >
                Call {BUSINESS.phone}
              </a>
            </div>
          </div>
        </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
