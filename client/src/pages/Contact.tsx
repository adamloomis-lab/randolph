import { useEffect, useState } from "react";
import Img from "@/components/Img";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { RC } from "@/lib/rc";
import { useSeo } from "@/lib/useSeo";
// @ts-expect-error - plain JS module shared with the prerender script
import { PAGE_SEO } from "@/lib/seoData.js";
import { FloatField, IconCardSelect, SuccessCheck, type IconCardOption } from "@/components/FluidField";
import { Trees, Layers, Frame, Truck, HelpCircle, Phone, Zap } from "lucide-react";

// Read the actual submitted values from the form DOM (what the user typed),
// merging over React state. This is immune to controlled-state desync such as a
// hydration mismatch, which previously let text fields submit blank.
function readFormValues(formEl: HTMLFormElement, state: Record<string, string>) {
  const out: Record<string, string> = { "form-name": "contact", ...state };
  const fd = new FormData(formEl);
  for (const [k, v] of fd.entries()) {
    if (k === "bot-field") continue;
    const val = String(v);
    if (val.trim() !== "") out[k] = val;
  }
  return out;
}

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");

const SERVICE_CARDS: IconCardOption[] = [
  { value: "Landscaping", label: "Landscaping", icon: Trees },
  { value: "Hardscaping", label: "Hardscaping", icon: Layers },
  { value: "Custom Composite Deck", label: "Composite Deck", icon: Frame },
  { value: "Concrete Services", label: "Concrete", icon: Truck },
  { value: "Not Sure Yet", label: "Not Sure Yet", icon: HelpCircle },
];

export default function Contact() {
  useSeo({ ...PAGE_SEO["/contact"], path: "/contact" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", service: SERVICE_CARDS[0].value, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setErrorMsg("");
    if (!form.name || !form.phone || !form.email) {
      setErrorMsg("Please fill in your name, phone, and email.");
      return;
    }
    setSubmitting(true);
    const captured = (String(new FormData(formEl).get("name") || form.name)).trim().split(/\s+/)[0];
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(readFormValues(formEl, form)),
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
      <Nav />

      <main id="main-content" className="pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4">Get in Touch</span>
              <h1 className="font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none">
                Let's Talk About <span className="text-primary">Your Project</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-8">
                Whether you know exactly what you want or you're just starting to think it through — reach out. We'll get
                back to you fast.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center border border-surface-container-highest">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary">phone_in_talk</span>
                </div>
                <div>
                  <p className="text-label-bold uppercase text-primary">Call or Text</p>
                  <a href={BUSINESS.phoneHref} className="font-headline-md text-headline-md leading-tight hover:text-primary transition-colors">
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="relative h-[320px] md:h-[400px] bg-surface-container overflow-hidden border-2 border-surface-container-highest shadow-2xl">
              <Img
                src={RC.hero}
                alt="Completed hardscape patio and fire pit in Wadsworth, Ohio"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <div className="industrial-divider mb-16 md:mb-20" />

        {/* Form + side */}
        <Reveal className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-10 border-2 border-surface-container-highest concrete-texture relative overflow-hidden">
            <h2 className="font-headline-md text-headline-md uppercase mb-2 flex items-center gap-4 relative z-10">
              <span className="w-8 h-2 bg-primary" /> Send Us a Message
            </h2>
            <p className="text-on-surface-variant font-body-md mb-8 relative z-10">
              Fill out the form below and we'll follow up within one business day. No pressure, no obligation.
            </p>

            {submitted ? (
              <div className="relative z-10 bg-surface-container-low border-l-4 border-primary p-8 flex flex-col items-center text-center">
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
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p hidden>
                  <label>
                    Don't fill this out: <input name="bot-field" onChange={handleChange} />
                  </label>
                </p>

                <FloatField idPrefix="contact" name="name" label="Full Name" value={form.name} onChange={handleChange} autoComplete="name" required />
                <FloatField idPrefix="contact" name="phone" label="Phone Number" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" required />
                <div className="md:col-span-2">
                  <FloatField idPrefix="contact" name="email" label="Email Address" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
                </div>
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
                  <FloatField idPrefix="contact" name="message" label="Tell Us About Your Project" textarea rows={5} value={form.message} onChange={handleChange} />
                </div>
                {errorMsg && <div className="md:col-span-2 text-error font-label-bold text-label-bold uppercase">{errorMsg}</div>}
                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="alm-sheen relative overflow-hidden w-full bg-primary-container text-on-primary-container py-5 font-display-lg text-headline-md uppercase tracking-wide metallic-gradient beveled-edge industrial-glow hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send My Request"} <Zap size={22} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Side: direct contact + map */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-surface-container-high border-2 border-surface-container-highest p-8 beveled-edge">
              <h3 className="font-label-bold text-label-bold uppercase text-primary mb-6 tracking-widest">Get in Touch Directly</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary">call</span>
                  <div>
                    <p className="font-label-bold text-xs uppercase text-on-surface-variant mb-1">Phone</p>
                    <a href={BUSINESS.phoneHref} className="font-body-md hover:text-primary transition-colors">{BUSINESS.phone}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary">mail</span>
                  <div>
                    <p className="font-label-bold text-xs uppercase text-on-surface-variant mb-1">Email</p>
                    <a href={BUSINESS.emailHref} className="font-body-md hover:text-primary transition-colors break-all">{BUSINESS.email}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary">location_on</span>
                  <div>
                    <p className="font-label-bold text-xs uppercase text-on-surface-variant mb-1">Service Area</p>
                    <p className="font-body-md text-on-surface-variant">Wadsworth, Medina, Norton, Barberton, and surrounding Northeast Ohio communities.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-container">
                <p className="font-body-md text-sm text-on-surface-variant">We typically respond within one business day. For urgent requests, give us a call directly.</p>
              </div>
            </div>

            <div className="flex-grow bg-surface border-2 border-surface-container-highest relative min-h-[320px] overflow-hidden">
              <iframe
                title="Randolph Construction service area — Wadsworth, Ohio"
                src="https://maps.google.com/maps?q=Wadsworth,+Ohio&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[320px]"
                style={{ border: 0, filter: "grayscale(1) brightness(0.7) contrast(1.2)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
