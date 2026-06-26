import { useEffect, useState } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest border-t-4 border-primary px-margin-mobile md:px-margin-desktop py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
    >
      <p className="flex-1 text-on-surface-variant font-body-md text-body-md leading-relaxed">
        This site uses cookies to keep things running smoothly. We never sell
        your data.{" "}
        <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-on-surface transition-colors">
          Privacy Policy
        </Link>
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={accept}
          className="bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-2 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 hover:opacity-90"
        >
          Sounds Good
        </button>
        <button
          onClick={decline}
          className="border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-5 py-2 hover:text-on-surface hover:border-primary transition-colors"
        >
          No Thanks
        </button>
      </div>
    </div>
  );
}
