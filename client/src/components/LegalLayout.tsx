import { type ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export default function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="bg-background text-on-background font-body-md">
      <Nav />
      <main id="main-content" className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <h1 className="font-display-lg text-4xl md:text-display-lg uppercase mb-3 leading-none">{title}</h1>
          <p className="font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest mb-10">
            Last updated {updated}
          </p>
          <div className="legal-prose space-y-6 text-on-surface-variant font-body-lg text-body-lg">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
