import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, Component, createContext, useRef, useMemo, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Link, useLocation, useRoute, Redirect, Switch, Route, Router as Router$1 } from "wouter";
import { useTheme } from "next-themes";
import { Toaster as Toaster$1 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { Phone, Hammer, AlertTriangle, RotateCcw, Menu, X, ArrowUpRight, MapPin, Clock, ThumbsUp, Camera, Trees, Layers, Frame, Truck, HelpCircle, Zap, AlertCircle, Home as Home$1 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
const STORAGE_KEY = "cookie-consent";
function CookieBanner() {
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "region",
      "aria-label": "Cookie consent",
      className: "fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest border-t-4 border-primary px-margin-mobile md:px-margin-desktop py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl",
      children: [
        /* @__PURE__ */ jsxs("p", { className: "flex-1 text-on-surface-variant font-body-md text-body-md leading-relaxed", children: [
          "This site uses cookies to keep things running smoothly. We never sell your data.",
          " ",
          /* @__PURE__ */ jsx(Link, { href: "/privacy", className: "text-primary underline underline-offset-4 hover:text-on-surface transition-colors", children: "Privacy Policy" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 shrink-0", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: accept,
              className: "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-2 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 hover:opacity-90",
              children: "Sounds Good"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: decline,
              className: "border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-5 py-2 hover:text-on-surface hover:border-primary transition-colors",
              children: "No Thanks"
            }
          )
        ] })
      ]
    }
  );
}
const BUSINESS = {
  // Identity
  name: "Randolph Construction",
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
    regionFull: "Ohio"
  },
  // Service area
  serviceCity: "Wadsworth",
  serviceAreaCopy: "Wadsworth, Medina, Norton, Barberton, and surrounding Northeast Ohio communities",
  // Services
  services: ["Landscaping", "Hardscaping", "Custom Composite Decks", "Concrete"]
};
function MobileActionBar() {
  return /* @__PURE__ */ jsx("div", { className: "md:hidden fixed inset-x-3 bottom-3 z-40 print:hidden", role: "region", "aria-label": "Quick actions", children: /* @__PURE__ */ jsxs("div", { className: "flex items-stretch gap-2 rounded-2xl border border-white/15 bg-surface-container-high/95 backdrop-blur-xl p-2 ring-1 ring-inset ring-white/5 shadow-[0_18px_50px_-10px_rgba(0,0,0,0.9),0_0_30px_-10px_rgba(211,47,47,0.5)]", children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: BUSINESS.phoneHref,
        "aria-label": `Call ${BUSINESS.name}`,
        className: "flex flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] py-3.5 text-on-surface hover:bg-white/[0.12] active:scale-95 transition-all",
        children: [
          /* @__PURE__ */ jsx(Phone, { size: 20, strokeWidth: 2, className: "text-primary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-[12px] uppercase tracking-wide", children: "Call" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Link,
      {
        href: "/contact",
        "aria-label": "Request a free estimate",
        className: "alm-sheen-auto alm-glow-pulse relative overflow-hidden flex flex-[1.4] flex-row items-center justify-center gap-2 rounded-xl bg-primary-container text-on-primary-container py-3.5 metallic-gradient beveled-edge active:scale-95 transition-transform",
        children: [
          /* @__PURE__ */ jsx(Hammer, { size: 20, strokeWidth: 2, "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-[12px] uppercase tracking-wide", children: "Free Estimate" })
        ]
      }
    )
  ] }) });
}
function StickyEstimate() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `hidden md:block fixed bottom-6 right-6 z-40 print:hidden transition-all duration-500 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`,
      children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: "/contact",
          "aria-label": "Request a free estimate",
          className: "alm-sheen alm-glow-pulse relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-primary-container text-on-primary-container px-7 py-4 font-label-bold text-label-bold uppercase tracking-wide metallic-gradient beveled-edge shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] hover:scale-[1.03] active:scale-95 transition-transform",
          children: [
            /* @__PURE__ */ jsx(Hammer, { size: 20, strokeWidth: 2, "aria-hidden": "true" }),
            "Get a Free Estimate"
          ]
        }
      )
    }
  );
}
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen p-8 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full max-w-2xl p-8", children: [
        /* @__PURE__ */ jsx(
          AlertTriangle,
          {
            size: 48,
            className: "text-destructive mb-6 flex-shrink-0"
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-4", children: "An unexpected error occurred." }),
        /* @__PURE__ */ jsx("div", { className: "p-4 w-full rounded bg-muted overflow-auto mb-6", children: /* @__PURE__ */ jsx("pre", { className: "text-sm text-muted-foreground whitespace-break-spaces", children: this.state.error?.stack }) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => window.location.reload(),
            className: cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 cursor-pointer"
            ),
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { size: 16 }),
              "Reload Page"
            ]
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
const ThemeContext = createContext(void 0);
function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false
}) {
  const [theme, setTheme] = useState(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return stored || defaultTheme;
    }
    return defaultTheme;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);
  const toggleTheme = switchable ? () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  } : void 0;
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, toggleTheme, switchable }, children });
}
const IMG_META = {
  "/images/IMG_0168_62568687.webp": {
    "width": 1242,
    "height": 926
  },
  "/images/IMG_0406_329edae3.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_04072_616a53b6.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_04082_1cbffeb5.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_04092_9765baa8.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_0410_348baadc.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_04112_be823761.webp": {
    "width": 942,
    "height": 2048
  },
  "/images/IMG_1805_1ebe3fbe.webp": {
    "width": 1289,
    "height": 801
  },
  "/images/IMG_3626_16186764.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3628_dafbc59f.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3630_cb792a6d.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3689_44830253.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3691_6ff1d865.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3902_5f245d4e.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_3906_ba7fc1b4.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_4325_3ec44064.webp": {
    "width": 1290,
    "height": 1676
  },
  "/images/IMG_4326_1d7261a6.webp": {
    "width": 1290,
    "height": 1334
  },
  "/images/IMG_4329_1923ded0.webp": {
    "width": 1290,
    "height": 1638
  },
  "/images/IMG_4332_4a0a19a4.webp": {
    "width": 1290,
    "height": 1121
  },
  "/images/IMG_4333_b4e89027.webp": {
    "width": 1290,
    "height": 1072
  },
  "/images/IMG_4334_9bf1bb29.webp": {
    "width": 1290,
    "height": 1220
  },
  "/images/IMG_4335_472f3fbf.webp": {
    "width": 1290,
    "height": 1391
  },
  "/images/IMG_4337_ba0c5068.webp": {
    "width": 1290,
    "height": 1310
  },
  "/images/IMG_4340_7b6a36cb.webp": {
    "width": 1290,
    "height": 1291
  },
  "/images/IMG_4364_f432348b.webp": {
    "width": 1290,
    "height": 880
  },
  "/images/IMG_4370_0c477870.webp": {
    "width": 1290,
    "height": 1151
  },
  "/images/IMG_4372_6bfce48a.webp": {
    "width": 1290,
    "height": 1059
  },
  "/images/IMG_4576_f7492bb1.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_4579_756badf0.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_4580_44c7ea67.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_4581_badf4fc4.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_4819_6d6b910c.webp": {
    "width": 1920,
    "height": 2560
  },
  "/images/IMG_60272_e57b501a.webp": {
    "width": 1242,
    "height": 1546
  },
  "/images/deck-d_ba634a4b.webp": {
    "width": 768,
    "height": 1024
  },
  "/images/deck-e_8b339fcc.webp": {
    "width": 900,
    "height": 750
  },
  "/images/deck-extra1_a653372e.webp": {
    "width": 830,
    "height": 550
  },
  "/images/deck-extra2_d67d044b.webp": {
    "width": 1080,
    "height": 720
  },
  "/images/deck-extra3_752de4bf.webp": {
    "width": 1920,
    "height": 1440
  },
  "/images/deck-f_18568bfc.webp": {
    "width": 1920,
    "height": 1440
  },
  "/images/logo_ea5cfcf8.webp": {
    "width": 500,
    "height": 500
  },
  "/images/randolph/brand-collage.webp": {
    "width": 700,
    "height": 451
  },
  "/images/randolph/estimate-1.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/estimate-2.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/estimate-3.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-1.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-2.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-3.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-4.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-5.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/gallery-6.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/hero-firepit.webp": {
    "width": 1290,
    "height": 1121
  },
  "/images/randolph/home-1.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-2.webp": {
    "width": 512,
    "height": 330
  },
  "/images/randolph/home-3.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-4.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-5.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-6.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-7.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-8.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/home-9.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/logo-randolph.webp": {
    "width": 700,
    "height": 712
  },
  "/images/randolph/services-1.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-2.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-3.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-4.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-5.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-6.webp": {
    "width": 512,
    "height": 512
  },
  "/images/randolph/services-7.webp": {
    "width": 512,
    "height": 512
  }
};
function Img({ src, loading = "lazy", decoding = "async", ...rest }) {
  const meta = typeof src === "string" ? IMG_META[src] : void 0;
  return /* @__PURE__ */ jsx(
    "img",
    {
      src,
      loading,
      decoding,
      ...meta ? { width: meta.width, height: meta.height } : null,
      ...rest
    }
  );
}
const B = "/images/randolph";
const RC = {
  logo: `${B}/logo-randolph.webp`,
  // Home
  hero: `${B}/hero-firepit.webp`
};
const COMPANY = {
  phone: BUSINESS.phone,
  phoneHref: BUSINESS.phoneHref,
  email: BUSINESS.email,
  city: `${BUSINESS.address.locality}, ${BUSINESS.address.regionFull}`
};
const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];
function Nav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const isActive = (href) => href === "/" ? location === "/" : location.startsWith(href);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("header", { className: "fixed top-0 w-full z-50 border-b-2 border-surface-container-highest bg-background/95 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,0.5)]", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "#main-content",
          className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary-container focus:text-on-primary-container focus:px-4 focus:py-2 focus:font-label-bold focus:text-label-bold focus:uppercase",
          children: "Skip to content"
        }
      ),
      /* @__PURE__ */ jsxs("nav", { className: "flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Img, { src: RC.logo, alt: "Randolph Construction", className: "h-12 w-12 object-contain" }),
          /* @__PURE__ */ jsxs("span", { className: "font-display-lg text-2xl md:text-headline-md uppercase tracking-tight text-on-surface leading-none", children: [
            "Randolph ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Construction" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-8", children: LINKS.map((l) => /* @__PURE__ */ jsx(
          Link,
          {
            href: l.href,
            className: `font-label-bold text-label-bold uppercase transition-colors ${isActive(l.href) ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`,
            children: l.label
          },
          l.href
        )) }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/contact",
            className: "hidden md:inline-block bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95",
            children: "Get an Estimate"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "md:hidden text-on-surface p-1",
            onClick: () => setOpen(true),
            "aria-label": "Open menu",
            "aria-expanded": open,
            children: /* @__PURE__ */ jsx(Menu, { size: 26 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`,
        "aria-hidden": !open,
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              tabIndex: open ? 0 : -1,
              "aria-label": "Close menu",
              onClick: () => setOpen(false),
              className: "absolute inset-0 bg-background/80 backdrop-blur-sm"
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "Site menu",
              className: `absolute right-0 top-0 h-full w-[88%] max-w-sm bg-surface-container-lowest border-l-2 border-surface-container-highest shadow-[-20px_0_60px_-10px_rgba(0,0,0,0.85)] concrete-texture flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 h-20 border-b-2 border-surface-container-highest shrink-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(Img, { src: RC.logo, alt: "Randolph Construction", className: "h-10 w-10 object-contain" }),
                    /* @__PURE__ */ jsx("span", { className: "font-display-lg text-xl uppercase tracking-tight text-on-surface leading-none", children: "Randolph" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setOpen(false),
                      "aria-label": "Close menu",
                      className: "w-10 h-10 rounded-full border border-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary hover:border-primary transition-colors active:scale-95",
                      children: /* @__PURE__ */ jsx(X, { size: 22 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto", children: [
                  /* @__PURE__ */ jsx("div", { className: "px-6 pt-6", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 bg-primary-container/15 border border-primary/40 text-primary font-label-bold text-[11px] uppercase tracking-widest px-3 py-1.5", children: [
                    /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", "aria-hidden": "true", children: [
                      /* @__PURE__ */ jsx("span", { className: "alm-dot-pulse absolute inline-flex h-full w-full rounded-full bg-primary" }),
                      /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })
                    ] }),
                    "Free Estimates · One Crew, All the Skills"
                  ] }) }),
                  /* @__PURE__ */ jsx("nav", { className: "px-6 pt-6 pb-2 flex flex-col", children: LINKS.map((l, i) => /* @__PURE__ */ jsxs(
                    Link,
                    {
                      href: l.href,
                      style: { transitionDelay: open ? `${100 + i * 60}ms` : "0ms" },
                      className: `group flex items-center justify-between py-4 border-b border-surface-container-highest font-display-lg text-3xl uppercase tracking-tight transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"} ${isActive(l.href) ? "text-primary" : "text-on-surface hover:text-primary"}`,
                      children: [
                        l.label,
                        /* @__PURE__ */ jsx(
                          ArrowUpRight,
                          {
                            size: 22,
                            className: "text-on-surface-variant transition-all group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1",
                            "aria-hidden": "true"
                          }
                        )
                      ]
                    },
                    l.href
                  )) }),
                  /* @__PURE__ */ jsxs("div", { className: "px-6 pt-6 space-y-3", children: [
                    /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: BUSINESS.phoneHref,
                        className: "flex items-center justify-center gap-2 w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-4 metallic-gradient beveled-edge industrial-glow active:scale-95 transition-all",
                        children: [
                          /* @__PURE__ */ jsx(Phone, { size: 18, strokeWidth: 2, "aria-hidden": "true" }),
                          " Call ",
                          BUSINESS.phone
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: "/contact",
                        className: "flex items-center justify-center gap-2 w-full border-2 border-surface-container-highest text-on-surface font-label-bold text-label-bold uppercase py-4 hover:border-primary hover:text-primary active:scale-95 transition-all",
                        children: "Request an Estimate"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "px-6 py-7 mt-2 border-t border-surface-container-highest space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-on-surface-variant", children: [
                      /* @__PURE__ */ jsx(MapPin, { size: 18, className: "text-primary mt-0.5 shrink-0", "aria-hidden": "true" }),
                      /* @__PURE__ */ jsx("span", { className: "font-body-md text-sm", children: BUSINESS.serviceAreaCopy })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 text-on-surface-variant", children: [
                      /* @__PURE__ */ jsx(Clock, { size: 18, className: "text-primary mt-0.5 shrink-0", "aria-hidden": "true" }),
                      /* @__PURE__ */ jsx("span", { className: "font-body-md text-sm", children: "By appointment · We reply within one business day" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-1", children: [
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: "https://facebook.com",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": "Facebook",
                          className: "w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary hover:border-primary transition-colors",
                          children: /* @__PURE__ */ jsx(ThumbsUp, { size: 18, "aria-hidden": "true" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: "https://instagram.com",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": "Instagram",
                          className: "w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary hover:border-primary transition-colors",
                          children: /* @__PURE__ */ jsx(Camera, { size: 18, "aria-hidden": "true" })
                        }
                      )
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
const SITE = {
  url: BUSINESS.url,
  name: BUSINESS.name,
  phone: BUSINESS.phone,
  phoneDigits: BUSINESS.phoneDigits,
  email: BUSINESS.email,
  city: BUSINESS.serviceCity,
  region: BUSINESS.address.region,
  defaultImage: BUSINESS.defaultImage,
  services: BUSINESS.services
};
const PAGE_SEO = {
  "/": {
    title: "Randolph Construction | Landscaping, Hardscaping & Concrete in Wadsworth, OH",
    description: "Randolph Construction builds patios, hardscapes, custom decks, lawns, and concrete for homeowners across Wadsworth and Northeast Ohio. Built strong, built to last. Free quotes."
  },
  "/services": {
    title: "Our Services — Landscaping, Hardscaping, Decks & Concrete | Randolph Construction",
    description: "Lawn care and landscaping, Unilock hardscapes and patios, custom composite decks, and concrete driveways and patios across Wadsworth and Northeast Ohio."
  },
  "/gallery": {
    title: "Project Gallery — Patios, Decks, Concrete & Landscaping | Randolph Construction",
    description: "See real patios, retaining walls, composite decks, concrete, and landscaping projects Randolph Construction has built for homeowners across Northeast Ohio."
  },
  "/contact": {
    title: "Contact & Free Quote | Randolph Construction — Wadsworth, OH",
    description: "Request a free estimate from Randolph Construction. Landscaping, hardscaping, decks, and concrete in Wadsworth and Northeast Ohio. Call (330) 400-6338."
  },
  "/privacy": {
    title: "Privacy Policy | Randolph Construction",
    description: "How Randolph Construction collects, uses, and protects your information when you visit our site or request an estimate."
  },
  "/terms": {
    title: "Terms of Use | Randolph Construction",
    description: "The terms that govern your use of the Randolph Construction website."
  },
  "/accessibility": {
    title: "Accessibility Statement | Randolph Construction",
    description: "Randolph Construction's commitment to keeping our website accessible to everyone, targeting WCAG 2.1 AA."
  }
};
const CITIES = [
  {
    slug: "medina",
    name: "Medina",
    county: "Medina County",
    nearby: ["Montrose", "Brunswick", "Seville", "Wadsworth"],
    blurb: "Just up the road from our Wadsworth home base, Medina is one of our most-requested service areas. From historic homes near the Square to newer builds out toward Montrose, we help Medina homeowners add patios, retaining walls, and clean concrete that hold up year after year."
  },
  {
    slug: "norton",
    name: "Norton",
    county: "Summit County",
    nearby: ["Barberton", "Wadsworth", "Doylestown", "Clinton"],
    blurb: "Norton sits right between our Wadsworth shop and Akron, so we're on job sites here constantly. Whether it's a fresh paver patio, a fire pit area, or a new driveway, we bring the same crew and the same standards to every Norton property."
  },
  {
    slug: "barberton",
    name: "Barberton",
    county: "Summit County",
    nearby: ["Norton", "Akron", "Wadsworth", "Clinton"],
    blurb: "The Magic City's mix of established neighborhoods and lakeside lots makes for great outdoor projects. We help Barberton homeowners turn tired yards into hardscaped patios, composite decks, and durable concrete built for Northeast Ohio winters."
  },
  {
    slug: "rittman",
    name: "Rittman",
    county: "Wayne County",
    nearby: ["Wadsworth", "Doylestown", "Sterling", "Orrville"],
    blurb: "Rittman is a quick trip from Wadsworth, and we're proud to serve its homeowners with full outdoor solutions. From lawn care and landscaping to stamped concrete and custom decks, we handle the whole project with one dependable crew."
  },
  {
    slug: "doylestown",
    name: "Doylestown",
    county: "Wayne County",
    nearby: ["Rittman", "Wadsworth", "Clinton", "Sterling"],
    blurb: "Doylestown's larger lots are perfect for outdoor living — patios, fire pits, retaining walls, and decks that make the most of the space. We bring premium Unilock hardscapes and clean concrete work to homeowners throughout the village and surrounding Wayne County."
  }
];
function citySeo(city) {
  return {
    path: `/service-area/${city.slug}`,
    title: `Landscaping, Hardscaping & Concrete in ${city.name}, OH | Randolph Construction`,
    description: `Randolph Construction serves ${city.name}, ${city.county} with patios, hardscapes, custom decks, lawn care, and concrete. Built strong, built to last. Free quotes — call ${SITE.phone}.`
  };
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "w-full pt-24 pb-12 border-t-4 border-surface-container-highest bg-surface-container-lowest concrete-texture", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-16", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx(Img, { src: RC.logo, alt: "Randolph Construction", className: "h-12 w-12 object-contain" }),
          /* @__PURE__ */ jsx("span", { className: "font-display-lg text-headline-md text-primary uppercase leading-none", children: "Randolph" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed", children: "Quality landscaping, hardscaping, custom decks, and concrete for homeowners across Wadsworth and Northeast Ohio. Built strong, built to last." }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              className: "w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary transition-colors",
              href: "https://facebook.com",
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "Facebook",
              children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined", children: "thumb_up" })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              className: "w-10 h-10 flex items-center justify-center border border-surface-container-highest text-on-surface-variant hover:text-primary transition-colors",
              href: "https://instagram.com",
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": "Instagram",
              children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined", children: "photo_camera" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h5", { className: "font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest", children: "Navigation" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Project Gallery", href: "/gallery" },
          { label: "Request an Estimate", href: "/contact" }
        ].map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            href: l.href,
            className: "text-on-surface-variant font-label-bold text-label-bold uppercase hover:text-primary hover:translate-x-1 transition-all inline-block",
            children: l.label
          }
        ) }, l.href)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h5", { className: "font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest", children: "Services" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: ["Landscaping", "Hardscaping", "Decks", "Concrete"].map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            href: "/services",
            className: "text-on-surface-variant font-label-bold text-label-bold uppercase hover:text-primary hover:translate-x-1 transition-all inline-block",
            children: s
          }
        ) }, s)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h5", { className: "font-label-bold text-label-bold uppercase text-on-surface mb-8 tracking-widest", children: "Contact" }),
        /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant font-body-md text-body-md mb-4", children: [
          COMPANY.city,
          /* @__PURE__ */ jsx("br", {}),
          "Serving Northeast Ohio"
        ] }),
        /* @__PURE__ */ jsx("a", { href: COMPANY.phoneHref, className: "text-primary font-label-bold text-label-bold block mb-4 hover:underline", children: COMPANY.phone }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `mailto:${COMPANY.email}`,
            className: "text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors break-all",
            children: COMPANY.email
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-12", children: [
      /* @__PURE__ */ jsx("p", { className: "font-label-bold text-label-bold uppercase text-on-surface mb-4 tracking-widest", children: "Service Areas" }),
      /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant font-body-md text-body-md", children: [
        "Proudly serving Wadsworth and",
        " ",
        CITIES.map((c, i) => /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx(Link, { href: `/service-area/${c.slug}`, className: "text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 decoration-surface-container-highest", children: c.name }),
          i < CITIES.length - 1 ? ", " : ""
        ] }, c.slug)),
        ", Ohio."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-12 border-t border-surface-container-highest flex flex-col md:flex-row justify-between items-center gap-4", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant font-label-bold text-sm tracking-widest text-center md:text-left", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Randolph Construction. Built Strong. Built to Last."
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex flex-wrap justify-center gap-x-6 gap-y-2", "aria-label": "Legal", children: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
        { label: "Accessibility", href: "/accessibility" },
        { label: "Crew Login", href: "/timeclock" }
      ].map((l) => /* @__PURE__ */ jsx(
        Link,
        {
          href: l.href,
          className: "font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors",
          children: l.label
        },
        l.href
      )) }),
      /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70", children: [
        "Site built by",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://adamloomismarketing.com",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-primary hover:text-on-surface transition-colors",
            children: "Adam Loomis Marketing"
          }
        )
      ] })
    ] })
  ] });
}
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: `${className} transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
      style: { transitionDelay: shown ? `${delay}ms` : "0ms" },
      children
    }
  );
}
const CDN = "/images";
const IMG = {
  // Hero / featured
  heroPatio: `${CDN}/IMG_4332_4a0a19a4.webp`,
  crew: `${CDN}/IMG_4372_6bfce48a.webp`,
  // Landscaping
  lawn: `${CDN}/IMG_04082_1cbffeb5.webp`,
  lawn2: `${CDN}/IMG_0406_329edae3.webp`,
  lawn3: `${CDN}/IMG_04072_616a53b6.webp`,
  lawn4: `${CDN}/IMG_0410_348baadc.webp`,
  lawn5: `${CDN}/IMG_04092_9765baa8.webp`,
  // Hardscaping
  patio1: `${CDN}/IMG_4333_b4e89027.webp`,
  patio2: `${CDN}/IMG_4334_9bf1bb29.webp`,
  patio3: `${CDN}/IMG_4335_472f3fbf.webp`,
  patio5: `${CDN}/IMG_4340_7b6a36cb.webp`,
  patio7: `${CDN}/IMG_4326_1d7261a6.webp`,
  patio8: `${CDN}/IMG_4329_1923ded0.webp`,
  // Extra deck photos (new)
  deckD: `${CDN}/deck-d_ba634a4b.webp`,
  deckE: `${CDN}/deck-e_8b339fcc.webp`,
  deckA: `${CDN}/deck-extra1_a653372e.webp`,
  deckB: `${CDN}/deck-extra2_d67d044b.webp`,
  deckC: `${CDN}/deck-extra3_752de4bf.webp`,
  // Decks
  deck1: `${CDN}/IMG_4579_756badf0.webp`,
  deck4: `${CDN}/IMG_4819_6d6b910c.webp`,
  // Concrete
  concrete1: `${CDN}/IMG_3628_dafbc59f.webp`,
  concrete2: `${CDN}/IMG_3630_cb792a6d.webp`,
  concrete3: `${CDN}/IMG_3626_16186764.webp`,
  concrete4: `${CDN}/IMG_3689_44830253.webp`
};
function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function useSeo({ title, description, path, image, jsonLd }) {
  useEffect(() => {
    const url = `${SITE.url}${path}`;
    const img = `${SITE.url}${image || SITE.defaultImage}`;
    document.title = title;
    upsertMeta("name", "description", description);
    upsertLink("canonical", url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:image", img);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
    let script = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "page");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) script.remove();
    };
  }, [title, description, path, image, jsonLd]);
}
function FloatField({
  name,
  label: label2,
  value,
  onChange,
  type = "text",
  required,
  textarea,
  rows = 5,
  idPrefix = "f",
  autoComplete
}) {
  const id = `${idPrefix}-${name}`;
  const input2 = "peer w-full bg-transparent px-4 pt-6 pb-2 font-body-md text-on-surface text-base placeholder-transparent outline-none";
  const labelCls = "pointer-events-none absolute left-4 top-4 origin-left font-body-md text-base text-on-surface-variant transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-on-surface-variant";
  return /* @__PURE__ */ jsxs("div", { className: "group relative border border-surface-container-highest bg-surface-container transition-all duration-300 focus-within:border-primary/70 focus-within:bg-surface-container-high focus-within:shadow-[0_0_26px_-8px_rgba(211,47,47,0.6)]", children: [
    textarea ? /* @__PURE__ */ jsx(
      "textarea",
      {
        id,
        name,
        rows,
        required,
        placeholder: " ",
        value,
        onChange,
        className: `${input2} resize-y`
      }
    ) : /* @__PURE__ */ jsx(
      "input",
      {
        id,
        type,
        name,
        required,
        autoComplete,
        placeholder: " ",
        value,
        onChange,
        className: input2
      }
    ),
    /* @__PURE__ */ jsxs("label", { htmlFor: id, className: labelCls, children: [
      label2,
      required && /* @__PURE__ */ jsx("span", { className: "ml-1 text-primary", children: "*" })
    ] }),
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute bottom-0 left-1/2 h-0.5 w-[calc(100%-2rem)] -translate-x-1/2 scale-x-0 bg-primary transition-transform duration-300 peer-focus:scale-x-100"
      }
    )
  ] });
}
function IconCardSelect({ options, value, onChange, name, legend }) {
  return /* @__PURE__ */ jsxs("fieldset", { children: [
    /* @__PURE__ */ jsx("legend", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant mb-3", children: legend }),
    /* @__PURE__ */ jsx("input", { type: "hidden", name, value }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: options.map((opt) => {
      const Icon = opt.icon;
      const active = value === opt.value;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onChange(opt.value),
          "aria-pressed": active,
          className: `group flex flex-col items-center justify-center gap-2 px-3 py-4 border-2 text-center transition-all duration-200 beveled-edge active:scale-95 ${active ? "bg-primary-container text-on-primary-container border-primary metallic-gradient shadow-[0_0_22px_-6px_rgba(211,47,47,0.7)]" : "bg-surface-container border-surface-container-highest text-on-surface-variant hover:border-primary/60 hover:text-on-surface"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 26, strokeWidth: 1.75, "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-[11px] leading-tight uppercase tracking-wide", children: opt.label })
          ]
        },
        opt.value
      );
    }) })
  ] });
}
function SuccessCheck() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 52 52", className: "h-16 w-16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: "26",
        cy: "26",
        r: "24",
        fill: "none",
        stroke: "#f04540",
        strokeWidth: "3",
        strokeDasharray: "151",
        strokeDashoffset: "151",
        style: { animation: "alm-draw-check 0.6s ease forwards" }
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M15 27 l7 7 l15 -16",
        fill: "none",
        stroke: "#f04540",
        strokeWidth: "4",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "40",
        strokeDashoffset: "40",
        style: { animation: "alm-draw-check 0.4s 0.5s ease forwards" }
      }
    )
  ] });
}
const SERVICE_CARDS$1 = [
  { value: "Landscaping", label: "Landscaping", icon: Trees },
  { value: "Hardscaping", label: "Hardscaping", icon: Layers },
  { value: "Custom Composite Deck", label: "Composite Deck", icon: Frame },
  { value: "Concrete Services", label: "Concrete", icon: Truck },
  { value: "Not Sure Yet", label: "Not Sure Yet", icon: HelpCircle }
];
const encode$1 = (data) => Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join("&");
const VALUE_PROPS = [
  { icon: "construction", title: "Built on Hard Work, Not Hype", desc: "This business started with a single lawn and a stubborn mower. Today it's grown through grit, skill, and a reputation for showing up and doing the job right." },
  { icon: "workspace_premium", title: "Premium Materials, No Corners Cut", desc: "We work with Unilock for patios and composite materials for decks, because your outdoor space should look amazing and hold up for years." },
  { icon: "groups", title: "One Crew, All the Skills", desc: "From concrete and landscaping to full backyard builds, you're hiring a team that handles it all. No juggling multiple contractors." },
  { icon: "flag", title: "Focused on the Finish Line", desc: "We don't just start strong, we finish strong. Clean work, clear communication, and a backyard you'll actually want to show off." }
];
const SERVICES$2 = [
  { spec: "01", title: "Landscaping", img: IMG.lawn, href: "/services#landscaping", desc: "Routine lawn care or a full landscape design — we keep every yard looking sharp season after season." },
  { spec: "02", title: "Hardscaping & Outdoor Spaces", img: IMG.heroPatio, href: "/services#hardscaping", desc: "Unilock patios, retaining walls, fire pit areas, and outdoor living spaces built to outlast Northeast Ohio winters." },
  { spec: "03", title: "Custom Composite Decks", img: IMG.deckC, href: "/services#decks", desc: "Premium composite decks that resist warping, fading, and wear — built for how you actually live outside." },
  { spec: "04", title: "Concrete Services", img: IMG.concrete1, href: "/services#concrete", desc: "Driveways, sidewalks, pads, and patios. Clean, level, and built to last — prep, pour, and finish handled in full." }
];
function Home() {
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
      areaServed: [SITE.city, ...CITIES.map((c) => c.name)].map((n) => ({ "@type": "City", name: `${n}, OH` })),
      knowsAbout: SITE.services
    }
  });
  const [form, setForm] = useState({ name: "", email: "", service: "Landscaping", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
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
        body: encode$1({ "form-name": "contact", ...form })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx("a", { href: "#main-content", className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg focus:text-gray-900", children: "Skip to content" }),
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { id: "main-content", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
          /* @__PURE__ */ jsx(Img, { src: RC.hero, alt: "Illuminated patio and fire pit in Wadsworth, Ohio", loading: "eager", fetchPriority: "high", className: "scrim w-full h-full object-cover grayscale opacity-90" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/25" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-margin-mobile max-w-4xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-6 inline-flex items-center gap-2 bg-surface-container-highest/90 backdrop-blur px-4 py-1 border-l-4 border-primary", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", style: { fontVariationSettings: "'FILL' 1" }, children: "location_on" }),
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase tracking-widest text-white", children: "Wadsworth & Northeast Ohio" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-4xl md:text-6xl uppercase mb-6 leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]", children: [
            "From the Neighbor's Yard to ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Neighborhood Favorite" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-white max-w-xl mx-auto mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]", children: "Quality craftsmanship for patios, lawns, and outdoor spaces across Wadsworth and Northeast Ohio." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-6", children: [
            /* @__PURE__ */ jsx(Link, { href: "/contact", className: "w-full md:w-auto bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-12 py-5 metallic-gradient beveled-edge industrial-glow transition-all text-lg active:scale-95", children: "Get Your Free Quote" }),
            /* @__PURE__ */ jsx(Link, { href: "/services", className: "w-full md:w-auto border-2 border-surface-container-highest hover:border-on-surface text-on-surface font-label-bold text-label-bold uppercase px-12 py-5 transition-all text-lg", children: "View Our Services" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 motion-safe:animate-bounce", children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant rotate-90", children: "Scroll" }),
          /* @__PURE__ */ jsx("span", { className: "material-symbols-outlined text-on-surface-variant", children: "keyboard_double_arrow_down" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-12 md:mb-16", children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "Why Randolph" }),
          /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-4xl md:text-headline-lg uppercase leading-none", children: "Why Homeowners Hire Us" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12", children: VALUE_PROPS.map((p, i) => /* @__PURE__ */ jsxs(Reveal, { delay: i * 90, className: "group border-l-2 border-surface-container-highest pl-8 py-4 hover:border-primary transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-4xl text-primary", style: { fontVariationSettings: "'FILL' 1" }, children: p.icon }),
            /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-2xl md:text-headline-md uppercase", children: p.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg text-body-lg", children: p.desc }),
          /* @__PURE__ */ jsx("div", { className: "h-1 w-12 mt-4 bg-surface-container-highest group-hover:w-full group-hover:bg-primary transition-all duration-500" })
        ] }, p.title)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-background", children: /* @__PURE__ */ jsx(Reveal, { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative group order-last lg:order-first", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -inset-3 bg-primary-container/10 blur-2xl group-hover:bg-primary-container/20 transition-all" }),
          /* @__PURE__ */ jsx(
            Img,
            {
              src: IMG.crew,
              alt: "The Randolph Construction crew at a completed fire pit and seating area in Wadsworth, Ohio",
              className: "relative z-10 w-full h-[340px] md:h-[460px] object-cover border-l-4 border-primary-container grayscale hover:grayscale-0 transition-all duration-700 bevel-stone"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "Our Story" }),
          /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight", children: "A Local Company Built From the Ground Up" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg text-body-lg mb-4", children: "I started this company at 12 years old mowing lawns with help from my dad. Since then I've poured everything into learning the trades and building a business that delivers high-quality work and dependable service." }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg text-body-lg mb-8", children: "Three years on, Randolph Construction offers full outdoor solutions — from patios and hardscapes to landscaping, concrete, and more. We're here to help homeowners across Wadsworth and Northeast Ohio take pride in their property and create the backyard they've always wanted." }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/contact",
              className: "inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 font-label-bold text-label-bold uppercase metallic-gradient beveled-edge industrial-glow transition-all active:scale-95",
              children: [
                "Start Your Project ",
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined", children: "arrow_forward" })
              ]
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-background relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row items-end justify-between mb-16 md:mb-20 gap-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "What We Do" }),
          /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-4xl md:text-headline-lg uppercase leading-none", children: "Outdoor Services Built for Northeast Ohio" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter", children: SERVICES$2.map((s, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 90, children: /* @__PURE__ */ jsxs(Link, { href: s.href, className: "group relative aspect-[3/4] overflow-hidden bg-surface-container-high border border-surface-container-highest block", children: [
          /* @__PURE__ */ jsx(Img, { src: s.img, alt: s.title, className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale opacity-50 group-hover:opacity-90" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 rivet" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 font-label-bold text-[10px] text-surface-container-highest bg-on-surface-variant px-2 py-1", children: [
            "SPEC-",
            s.spec
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 p-6 lg:p-8 w-full", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-headline-md text-2xl uppercase mb-2 group-hover:text-primary transition-colors leading-tight", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm mb-4", children: s.desc }),
            /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-label-bold uppercase text-primary inline-flex items-center gap-1", children: [
              "Learn More ",
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-base", children: "arrow_forward" })
            ] })
          ] })
        ] }) }, s.spec)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-2 border-surface-container-highest", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
        /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "Our Work" }),
        /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-4xl md:text-headline-lg uppercase mb-12 md:mb-16 border-b-4 border-primary inline-block pb-4", children: "Some Projects We've Done" }),
        /* @__PURE__ */ jsxs(Reveal, { children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-6", children: [
            /* @__PURE__ */ jsxs(Link, { href: "/gallery", className: "md:col-span-8 group overflow-hidden border-2 border-surface-container-highest relative block h-[320px] md:h-[516px]", children: [
              /* @__PURE__ */ jsx(Img, { src: IMG.patio5, alt: "Outdoor living space in Wadsworth, Ohio", className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 left-6 font-display-lg text-headline-md uppercase text-white drop-shadow-lg", children: "Patios & Outdoor Living" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-6", children: [
              /* @__PURE__ */ jsxs(Link, { href: "/gallery", className: "group overflow-hidden border-2 border-surface-container-highest relative block h-[200px] md:h-[246px]", children: [
                /* @__PURE__ */ jsx(Img, { src: IMG.deckA, alt: "Composite deck installation in Northeast Ohio", className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" })
              ] }),
              /* @__PURE__ */ jsxs(Link, { href: "/gallery", className: "group overflow-hidden border-2 border-surface-container-highest relative block h-[200px] md:h-[246px]", children: [
                /* @__PURE__ */ jsx(Img, { src: IMG.concrete2, alt: "Concrete work in Wadsworth, Ohio", className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsx(Link, { href: "/gallery", className: "inline-block border-2 border-surface-container-highest hover:border-primary text-on-surface font-label-bold text-label-bold uppercase px-10 py-4 transition-colors", children: "View the Full Gallery" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "py-24 md:py-32 bg-background relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-12 h-full", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "border-r border-surface-container-highest" }, i)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10", children: [
          /* @__PURE__ */ jsxs(Reveal, { children: [
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary mb-6 block tracking-widest", children: "Ready When You Are" }),
            /* @__PURE__ */ jsx("h2", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-4", children: "Ready to Build Something You're Proud Of?" }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg mb-12 max-w-xl mx-auto", children: "Serving Wadsworth, Medina, Norton, Barberton, and the surrounding Northeast Ohio area." })
          ] }),
          submitted ? /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low border-l-4 border-primary p-8 flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx(SuccessCheck, {}),
            /* @__PURE__ */ jsxs("p", { className: "font-display-lg text-headline-md uppercase text-primary mt-4 mb-2", children: [
              "Thank You, ",
              firstName,
              "!"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg max-w-md", children: "We got your request and we'll be in touch within one business day. For anything urgent, tap to call." }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: BUSINESS.phoneHref,
                className: "mt-6 inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-3 metallic-gradient beveled-edge active:scale-95 transition-all",
                children: [
                  /* @__PURE__ */ jsx(Phone, { size: 18, strokeWidth: 2, "aria-hidden": "true" }),
                  " ",
                  BUSINESS.phone
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { name: "contact", method: "POST", "data-netlify": "true", "data-netlify-honeypot": "bot-field", onSubmit: handleSubmit, className: "grid grid-cols-1 md:grid-cols-2 gap-5 text-left", children: [
            /* @__PURE__ */ jsx("input", { type: "hidden", name: "form-name", value: "contact" }),
            /* @__PURE__ */ jsx("p", { hidden: true, children: /* @__PURE__ */ jsxs("label", { children: [
              "Don't fill this out: ",
              /* @__PURE__ */ jsx("input", { name: "bot-field", onChange: handleChange })
            ] }) }),
            /* @__PURE__ */ jsx(FloatField, { idPrefix: "home", name: "name", label: "Full Name", value: form.name, onChange: handleChange, autoComplete: "name", required: true }),
            /* @__PURE__ */ jsx(FloatField, { idPrefix: "home", name: "email", label: "Email Address", type: "email", value: form.email, onChange: handleChange, autoComplete: "email", required: true }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
              IconCardSelect,
              {
                name: "service",
                legend: "Service Interested In",
                options: SERVICE_CARDS$1,
                value: form.service,
                onChange: (v) => setForm((f) => ({ ...f, service: v }))
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FloatField, { idPrefix: "home", name: "message", label: "Project Details", textarea: true, rows: 4, value: form.message, onChange: handleChange }) }),
            errorMsg && /* @__PURE__ */ jsx("div", { className: "md:col-span-2 text-error font-label-bold text-label-bold uppercase", children: errorMsg }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx("button", { type: "submit", disabled: submitting, className: "alm-sheen relative overflow-hidden w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-6 metallic-gradient beveled-edge industrial-glow transition-all text-xl active:scale-95 disabled:opacity-60", children: submitting ? "Sending..." : "Get Your Free Quote" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] });
}
const SERVICES$1 = [
  {
    id: "landscaping",
    phase: "01",
    label: "Landscaping",
    headline: "Lawn Care and Landscaping That Makes Your Property Stand Out",
    copy: [
      "Whether you need routine lawn maintenance or a full landscape design, we bring the same care and attention to every yard. We work with homeowners across Wadsworth, Medina County, and surrounding communities to keep properties looking sharp season after season.",
      "A well-maintained lawn is the first thing people notice. We take that seriously — showing up on schedule, cutting clean lines, and making sure your property looks its best whether it's a spring cleanup or a full summer maintenance plan."
    ],
    img: IMG.lawn,
    imgAlt: "Lawn care and landscaping in Wadsworth and Northeast Ohio",
    gallery: [
      { src: IMG.lawn2, alt: "Landscaping project in Northeast Ohio" },
      { src: IMG.lawn3, alt: "Lawn maintenance in Wadsworth, Ohio" },
      { src: IMG.lawn4, alt: "Lawn mowing service in Northeast Ohio" },
      { src: IMG.lawn5, alt: "Landscape care in Wadsworth, Ohio" }
    ],
    btnLabel: "Get a Landscaping Quote"
  },
  {
    id: "hardscaping",
    phase: "02",
    label: "Hardscaping & Outdoor Spaces",
    headline: "Patios, Walkways, and Outdoor Living Built to Last",
    copy: [
      "We specialize in Unilock hardscape systems — pavers, retaining walls, fire pit areas, and outdoor living spaces designed to hold up against Northeast Ohio winters and look great doing it. If you can imagine it in your backyard, we can build it.",
      "From a simple walkway to a full multi-level outdoor entertainment area, we design and build spaces that fit how you actually use your yard. Every project is installed with proper base prep and drainage so it stays level and clean for years."
    ],
    img: IMG.heroPatio,
    imgAlt: "Unilock hardscape patio and fire pit in Wadsworth, Ohio",
    gallery: [
      { src: IMG.patio1, alt: "Hardscape patio construction in Wadsworth, Ohio" },
      { src: IMG.patio2, alt: "Paver patio installation in Northeast Ohio" },
      { src: IMG.patio3, alt: "Retaining wall and hardscape in Wadsworth, Ohio" },
      { src: IMG.crew, alt: "Completed fire pit seating area in Northeast Ohio" }
    ],
    btnLabel: "Get a Hardscaping Quote",
    reverse: true
  },
  {
    id: "decks",
    phase: "03",
    label: "Custom Composite Decks",
    headline: "Decks Built for How You Actually Live Outside",
    copy: [
      "We build custom composite decks using premium materials that resist warping, fading, and wear. No low-grade lumber, no cutting corners. Just a deck that looks incredible the day it's finished and still looks great five years from now.",
      "Every deck we build is custom designed to fit your home and your lifestyle. Whether you want a simple platform deck or a multi-level space with built-in seating, we handle the design, the permitting process, and the full build from start to finish."
    ],
    img: IMG.deckA,
    imgAlt: "Custom composite deck installation in Wadsworth, Ohio",
    gallery: [
      { src: IMG.deckB, alt: "Composite deck with fire pit seating area in Northeast Ohio" },
      { src: IMG.deckC, alt: "Custom composite deck with chevron pattern in Wadsworth, Ohio" },
      { src: IMG.deckD, alt: "Composite deck with railing in Northeast Ohio" },
      { src: IMG.deckE, alt: "Ground-level composite deck with built-in seating in Wadsworth, Ohio" }
    ],
    btnLabel: "Get a Deck Quote"
  },
  {
    id: "concrete",
    phase: "04",
    label: "Concrete Services",
    headline: "Clean Concrete Work Done Right the First Time",
    copy: [
      "From driveways and sidewalks to pads and patios, our concrete work is clean, level, and built to last. We handle the full job — prep, pour, and finish — so you get a consistent result without coordinating multiple crews.",
      "Good concrete starts with good prep. We take the time to grade properly, set forms right, and pour with care so you don't end up with cracking, settling, or drainage problems down the road. One crew, one point of contact, done right."
    ],
    img: IMG.concrete4,
    imgAlt: "Concrete driveway and patio work in Wadsworth, Ohio",
    gallery: [
      { src: IMG.concrete1, alt: "Concrete pour in progress in Northeast Ohio" },
      { src: IMG.concrete2, alt: "Concrete slab finishing in Wadsworth, Ohio" },
      { src: IMG.concrete3, alt: "Concrete driveway installation in Northeast Ohio" }
    ],
    btnLabel: "Get a Concrete Quote",
    reverse: true
  }
];
function ServiceSection({ id, phase, label: label2, headline, copy, img, imgAlt, gallery, btnLabel, reverse }) {
  return /* @__PURE__ */ jsx("section", { id, className: "py-20 md:py-28 border-b border-surface-container-highest scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
    /* @__PURE__ */ jsxs("div", { className: `grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { style: { direction: "ltr" }, className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-3 bg-primary-container/10 blur-2xl group-hover:bg-primary-container/20 transition-all" }),
        /* @__PURE__ */ jsx(
          Img,
          {
            src: img,
            alt: imgAlt,
            className: "relative z-10 w-full h-[320px] md:h-[440px] object-cover border-l-4 border-primary-container grayscale hover:grayscale-0 transition-all duration-700 bevel-stone"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { direction: "ltr" }, children: [
        /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-label-bold text-primary uppercase tracking-[0.3em]", children: [
          "Phase ",
          phase
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant mt-1 mb-3", children: label2 }),
        /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight", children: headline }),
        copy.map((para, i) => /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg text-body-lg mb-4", children: para }, i)),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/contact",
            className: "mt-2 inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 font-label-bold text-label-bold uppercase metallic-gradient beveled-edge industrial-glow transition-all active:scale-95",
            children: [
              btnLabel,
              " ",
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined", children: "arrow_forward" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-10", children: gallery.map((g) => /* @__PURE__ */ jsx("div", { className: "overflow-hidden border border-surface-container-highest h-40 group", children: /* @__PURE__ */ jsx(Img, { src: g.src, alt: g.alt, className: "w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" }) }, g.src)) })
  ] }) });
}
function Services() {
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { id: "main-content", className: "pt-32", children: [
      /* @__PURE__ */ jsxs("section", { className: "px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto text-center mb-8 md:mb-12", children: [
        /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "What We Do" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none", children: [
          "Outdoor Services Built for ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Northeast Ohio" }),
          " Homeowners"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto", children: "From a fresh-cut lawn to a full backyard transformation — Randolph Construction brings the skills, the materials, and the work ethic to get it done right. Proudly serving Wadsworth and surrounding Northeast Ohio communities." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "industrial-divider mb-4" }),
      SERVICES$1.map((s) => /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(ServiceSection, { ...s }) }, s.id)),
      /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 px-margin-mobile md:px-margin-desktop text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-6", children: "Not Sure Where to Start?" }),
        /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant mb-12", children: "Tell us what you're thinking and we'll walk you through what makes sense for your property and your budget. No pressure, just good advice from a crew that's done this for years." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 justify-center", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "bg-primary-container text-on-primary-container px-12 py-5 font-label-bold text-label-bold uppercase tracking-widest metallic-gradient beveled-edge industrial-glow transition-all active:scale-95",
              children: "Get a Free Quote"
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: BUSINESS.phoneHref,
              className: "border-2 border-surface-container-highest text-on-surface px-12 py-5 font-label-bold text-label-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors",
              children: [
                "Call ",
                BUSINESS.phone
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const PROJECTS = [
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
  { img: IMG.lawn4, alt: "Lawn mowing service in Northeast Ohio", cat: "Landscaping" }
];
const FILTERS = ["All", "Hardscaping", "Decks", "Concrete", "Landscaping"];
function Rivets() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { className: "rivet absolute top-1.5 left-1.5" }),
    /* @__PURE__ */ jsx("span", { className: "rivet absolute top-1.5 right-1.5" }),
    /* @__PURE__ */ jsx("span", { className: "rivet absolute bottom-1.5 left-1.5" }),
    /* @__PURE__ */ jsx("span", { className: "rivet absolute bottom-1.5 right-1.5" })
  ] });
}
function Gallery() {
  useSeo({ ...PAGE_SEO["/gallery"], path: "/gallery" });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [filter, setFilter] = useState("All");
  const visible = PROJECTS.filter((p) => filter === "All" || p.cat === filter);
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { id: "main-content", className: "pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto concrete-texture", children: [
      /* @__PURE__ */ jsxs("header", { className: "mb-12 md:mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[2px] w-12 bg-primary" }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em]", children: "Our Work" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-6 max-w-2xl leading-none", children: "Some Projects We've Done" }),
        /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant max-w-xl", children: "A look at patios, decks, concrete, and landscaping we've built for homeowners across Wadsworth and Northeast Ohio. If you can imagine it in your backyard, we can build it." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 mb-12", children: FILTERS.map((f) => {
        const active = filter === f;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setFilter(f),
            className: `relative px-8 py-3 font-label-bold text-label-bold uppercase border transition-all ${active ? "bg-surface-container-highest border-outline/20 text-primary" : "bg-surface-container-low border-surface-container-highest text-on-surface-variant hover:text-primary"}`,
            children: [
              /* @__PURE__ */ jsx(Rivets, {}),
              f
            ]
          },
          f
        );
      }) }),
      /* @__PURE__ */ jsx(Reveal, { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4", children: visible.map((p) => /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden border-2 border-surface-container-highest bevel-stone aspect-square", children: [
        /* @__PURE__ */ jsx(
          Img,
          {
            src: p.img,
            alt: p.alt,
            className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 font-label-bold text-[10px] uppercase tracking-widest text-on-surface bg-background/70 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity", children: p.cat })
      ] }, p.img)) }),
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("section", { className: "mt-24 md:mt-32 p-8 md:p-12 bg-surface-container-high border-y-4 border-primary/20 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 h-full w-1/3 bg-primary/5 -skew-x-12 translate-x-1/2" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-10", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "font-headline-lg text-3xl md:text-headline-lg uppercase mb-4", children: [
              "Ready to Build Something ",
              /* @__PURE__ */ jsx("br", {}),
              "You're Proud Of?"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant max-w-lg", children: "Serving Wadsworth, Medina, Norton, Barberton, and the surrounding Northeast Ohio area." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 w-full md:w-auto", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/contact",
                className: "text-center bg-primary-container text-on-primary-container px-12 py-5 font-label-bold text-lg uppercase tracking-widest industrial-glow metallic-gradient beveled-edge transition-all active:scale-95",
                children: "Get a Free Quote"
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: BUSINESS.phoneHref,
                className: "text-center border-2 border-surface-container-highest bg-transparent text-on-surface px-12 py-5 font-label-bold text-lg uppercase tracking-widest hover:bg-surface-container-highest transition-all",
                children: [
                  "Call ",
                  BUSINESS.phone
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const encode = (data) => Object.keys(data).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join("&");
const SERVICE_CARDS = [
  { value: "Landscaping", label: "Landscaping", icon: Trees },
  { value: "Hardscaping", label: "Hardscaping", icon: Layers },
  { value: "Custom Composite Deck", label: "Composite Deck", icon: Frame },
  { value: "Concrete Services", label: "Concrete", icon: Truck },
  { value: "Not Sure Yet", label: "Not Sure Yet", icon: HelpCircle }
];
function Contact() {
  useSeo({ ...PAGE_SEO["/contact"], path: "/contact" });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: SERVICE_CARDS[0].value, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.name || !form.phone || !form.email) {
      setErrorMsg("Please fill in your name, phone, and email.");
      return;
    }
    setSubmitting(true);
    const captured = form.name.trim().split(/\s+/)[0];
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form })
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
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { id: "main-content", className: "pt-32 pb-24", children: [
      /* @__PURE__ */ jsx("section", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop mb-16 md:mb-20", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "Get in Touch" }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none", children: [
            "Let's Talk About ",
            /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Your Project" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-8", children: "Whether you know exactly what you want or you're just starting to think it through — reach out. We'll get back to you fast." }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-surface-container-high flex items-center justify-center border border-surface-container-highest", children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", children: "phone_in_talk" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-label-bold uppercase text-primary", children: "Call or Text" }),
              /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, className: "font-headline-md text-headline-md leading-tight hover:text-primary transition-colors", children: BUSINESS.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-[320px] md:h-[400px] bg-surface-container overflow-hidden border-2 border-surface-container-highest shadow-2xl", children: [
          /* @__PURE__ */ jsx(
            Img,
            {
              src: RC.hero,
              alt: "Completed hardscape patio and fire pit in Wadsworth, Ohio",
              className: "w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "industrial-divider mb-16 md:mb-20" }),
      /* @__PURE__ */ jsxs(Reveal, { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 bg-surface-container-lowest p-6 md:p-10 border-2 border-surface-container-highest concrete-texture relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-headline-md text-headline-md uppercase mb-2 flex items-center gap-4 relative z-10", children: [
            /* @__PURE__ */ jsx("span", { className: "w-8 h-2 bg-primary" }),
            " Send Us a Message"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-md mb-8 relative z-10", children: "Fill out the form below and we'll follow up within one business day. No pressure, no obligation." }),
          submitted ? /* @__PURE__ */ jsxs("div", { className: "relative z-10 bg-surface-container-low border-l-4 border-primary p-8 flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx(SuccessCheck, {}),
            /* @__PURE__ */ jsxs("p", { className: "font-display-lg text-headline-md uppercase text-primary mt-4 mb-2", children: [
              "Thank You, ",
              firstName,
              "!"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg max-w-md", children: "We got your request and we'll be in touch within one business day. For anything urgent, tap to call." }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: BUSINESS.phoneHref,
                className: "mt-6 inline-flex items-center gap-2 bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-3 metallic-gradient beveled-edge active:scale-95 transition-all",
                children: [
                  /* @__PURE__ */ jsx(Phone, { size: 18, strokeWidth: 2, "aria-hidden": "true" }),
                  " ",
                  BUSINESS.phone
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs(
            "form",
            {
              name: "contact",
              method: "POST",
              "data-netlify": "true",
              "data-netlify-honeypot": "bot-field",
              onSubmit: handleSubmit,
              className: "grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10",
              children: [
                /* @__PURE__ */ jsx("input", { type: "hidden", name: "form-name", value: "contact" }),
                /* @__PURE__ */ jsx("p", { hidden: true, children: /* @__PURE__ */ jsxs("label", { children: [
                  "Don't fill this out: ",
                  /* @__PURE__ */ jsx("input", { name: "bot-field", onChange: handleChange })
                ] }) }),
                /* @__PURE__ */ jsx(FloatField, { idPrefix: "contact", name: "name", label: "Full Name", value: form.name, onChange: handleChange, autoComplete: "name", required: true }),
                /* @__PURE__ */ jsx(FloatField, { idPrefix: "contact", name: "phone", label: "Phone Number", type: "tel", value: form.phone, onChange: handleChange, autoComplete: "tel", required: true }),
                /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FloatField, { idPrefix: "contact", name: "email", label: "Email Address", type: "email", value: form.email, onChange: handleChange, autoComplete: "email", required: true }) }),
                /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(
                  IconCardSelect,
                  {
                    name: "service",
                    legend: "Service Interested In",
                    options: SERVICE_CARDS,
                    value: form.service,
                    onChange: (v) => setForm((f) => ({ ...f, service: v }))
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(FloatField, { idPrefix: "contact", name: "message", label: "Tell Us About Your Project", textarea: true, rows: 5, value: form.message, onChange: handleChange }) }),
                errorMsg && /* @__PURE__ */ jsx("div", { className: "md:col-span-2 text-error font-label-bold text-label-bold uppercase", children: errorMsg }),
                /* @__PURE__ */ jsx("div", { className: "md:col-span-2 mt-2", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "submit",
                    disabled: submitting,
                    className: "alm-sheen relative overflow-hidden w-full bg-primary-container text-on-primary-container py-5 font-display-lg text-headline-md uppercase tracking-wide metallic-gradient beveled-edge industrial-glow hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-60",
                    children: [
                      submitting ? "Sending..." : "Send My Request",
                      " ",
                      /* @__PURE__ */ jsx(Zap, { size: 22, strokeWidth: 2, "aria-hidden": "true" })
                    ]
                  }
                ) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-col gap-gutter", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-high border-2 border-surface-container-highest p-8 beveled-edge", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-label-bold text-label-bold uppercase text-primary mb-6 tracking-widest", children: "Get in Touch Directly" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", children: "call" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-label-bold text-xs uppercase text-on-surface-variant mb-1", children: "Phone" }),
                  /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, className: "font-body-md hover:text-primary transition-colors", children: BUSINESS.phone })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", children: "mail" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-label-bold text-xs uppercase text-on-surface-variant mb-1", children: "Email" }),
                  /* @__PURE__ */ jsx("a", { href: BUSINESS.emailHref, className: "font-body-md hover:text-primary transition-colors break-all", children: BUSINESS.email })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", children: "location_on" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-label-bold text-xs uppercase text-on-surface-variant mb-1", children: "Service Area" }),
                  /* @__PURE__ */ jsx("p", { className: "font-body-md text-on-surface-variant", children: "Wadsworth, Medina, Norton, Barberton, and surrounding Northeast Ohio communities." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t border-surface-container", children: /* @__PURE__ */ jsx("p", { className: "font-body-md text-sm text-on-surface-variant", children: "We typically respond within one business day. For urgent requests, give us a call directly." }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-grow bg-surface border-2 border-surface-container-highest relative min-h-[320px] overflow-hidden", children: /* @__PURE__ */ jsx(
            "iframe",
            {
              title: "Randolph Construction service area — Wadsworth, Ohio",
              src: "https://maps.google.com/maps?q=Wadsworth,+Ohio&t=&z=11&ie=UTF8&iwloc=&output=embed",
              className: "w-full h-full min-h-[320px]",
              style: { border: 0, filter: "grayscale(1) brightness(0.7) contrast(1.2)" },
              loading: "lazy",
              referrerPolicy: "no-referrer-when-downgrade"
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const SERVICES = [
  { title: "Landscaping", img: IMG.lawn, anchor: "landscaping", desc: "Routine lawn care and full landscape design that keeps your property sharp season after season." },
  { title: "Hardscaping", img: IMG.heroPatio, anchor: "hardscaping", desc: "Unilock patios, retaining walls, and fire pit areas built to outlast Northeast Ohio winters." },
  { title: "Custom Decks", img: IMG.deckC, anchor: "decks", desc: "Premium composite decks that resist warping and fading — designed around how you live outside." },
  { title: "Concrete", img: IMG.concrete1, anchor: "concrete", desc: "Driveways, sidewalks, pads, and patios — clean, level, and built to last." }
];
const GALLERY = [IMG.patio5, IMG.deckA, IMG.concrete2, IMG.patio1];
function ServiceArea() {
  const [, params] = useRoute("/service-area/:city");
  const city = CITIES.find((c) => c.slug === params?.city);
  if (!city) return /* @__PURE__ */ jsx(Redirect, { to: "/404" });
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
      addressCountry: "US"
    },
    areaServed: { "@type": "City", name: `${city.name}, OH` },
    knowsAbout: SITE.services
  };
  useSeo({ title: seo.title, description: seo.description, path: seo.path, jsonLd });
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { id: "main-content", className: "pt-20", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative min-h-[60vh] flex items-center overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
          /* @__PURE__ */ jsx(Img, { src: IMG.heroPatio, alt: `Hardscape and outdoor living project near ${city.name}, Ohio`, loading: "eager", fetchPriority: "high", className: "scrim w-full h-full object-cover grayscale opacity-90" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-surface-container-highest/90 backdrop-blur px-4 py-1 border-l-4 border-primary mb-6", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined text-primary", style: { fontVariationSettings: "'FILL' 1" }, children: "location_on" }),
            /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-label-bold uppercase tracking-widest text-white", children: [
              city.county,
              " · Service Area"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-6 leading-none max-w-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]", children: [
            "Landscaping, Hardscaping & Concrete in ",
            /* @__PURE__ */ jsxs("span", { className: "text-primary", children: [
              city.name,
              ", OH"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-white max-w-2xl mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]", children: city.blurb }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
            /* @__PURE__ */ jsx(Link, { href: "/contact", className: "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-10 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95", children: "Get Your Free Quote" }),
            /* @__PURE__ */ jsxs("a", { href: BUSINESS.phoneHref, className: "border-2 border-surface-container-highest hover:border-on-surface text-on-surface font-label-bold text-label-bold uppercase px-10 py-4 transition-all text-center", children: [
              "Call ",
              SITE.phone
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-20 md:py-28 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
        /* @__PURE__ */ jsxs(Reveal, { children: [
          /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: [
            "What We Build in ",
            city.name
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "font-headline-lg text-3xl md:text-headline-lg uppercase mb-12 leading-none max-w-3xl", children: [
            "Full Outdoor Solutions for ",
            city.name,
            " Homeowners"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter", children: SERVICES.map((s, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 80, children: /* @__PURE__ */ jsxs(Link, { href: `/services#${s.anchor}`, className: "group relative aspect-[3/4] overflow-hidden bg-surface-container-high border border-surface-container-highest block", children: [
          /* @__PURE__ */ jsx(Img, { src: s.img, alt: `${s.title} in ${city.name}, Ohio`, className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale opacity-50 group-hover:opacity-90" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 p-6 w-full", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-2xl uppercase mb-2 group-hover:text-primary transition-colors", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm", children: s.desc })
          ] })
        ] }) }, s.title)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 md:py-28 bg-background", children: /* @__PURE__ */ jsxs(Reveal, { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: GALLERY.map((src, i) => /* @__PURE__ */ jsx("div", { className: "overflow-hidden border border-surface-container-highest h-44 group", children: /* @__PURE__ */ jsx(Img, { src, alt: `Completed project near ${city.name}, Ohio`, className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" }) }, i)) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-4", children: "Local & Dependable" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-headline-lg text-3xl md:text-headline-lg uppercase mb-6 leading-tight", children: [
            "A ",
            city.county,
            " Crew You Can Count On"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant font-body-lg text-body-lg mb-4", children: [
            "Randolph Construction is based in Wadsworth and serves ",
            city.name,
            " and the surrounding ",
            city.county,
            " ",
            "area with one dependable crew — no juggling multiple contractors. From the first walkthrough to the final cleanup, you work with the same team that does the work."
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant font-body-lg text-body-lg mb-8", children: [
            "We also serve nearby ",
            city.nearby.join(", "),
            ". Premium materials, clean job sites, and craftsmanship built strong to last."
          ] }),
          /* @__PURE__ */ jsxs(Link, { href: "/gallery", className: "inline-flex items-center gap-3 border-2 border-surface-container-highest hover:border-primary text-on-surface px-8 py-4 font-label-bold text-label-bold uppercase transition-colors", children: [
            "See Our Work ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "material-symbols-outlined", children: "arrow_forward" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 md:py-28 bg-surface-container-lowest concrete-texture border-t-4 border-surface-container-highest text-center", children: /* @__PURE__ */ jsxs(Reveal, { className: "max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display-lg text-3xl md:text-display-lg uppercase mb-6", children: [
          "Ready to Upgrade Your ",
          city.name,
          " Property?"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-lg mb-10", children: "Tell us about your project and we'll get you a free, no-pressure estimate — usually within one business day." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(Link, { href: "/contact", className: "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-12 py-5 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95", children: "Get a Free Quote" }),
          /* @__PURE__ */ jsxs("a", { href: BUSINESS.phoneHref, className: "border-2 border-surface-container-highest text-on-surface font-label-bold text-label-bold uppercase px-12 py-5 hover:bg-surface-container-high transition-colors", children: [
            "Call ",
            SITE.phone
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function LegalLayout({ title, updated, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "pt-32 pb-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display-lg text-4xl md:text-display-lg uppercase mb-3 leading-none", children: title }),
      /* @__PURE__ */ jsxs("p", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest mb-10", children: [
        "Last updated ",
        updated
      ] }),
      /* @__PURE__ */ jsx("div", { className: "legal-prose space-y-6 text-on-surface-variant font-body-lg text-body-lg", children })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function Privacy() {
  useSeo({ ...PAGE_SEO["/privacy"], path: "/privacy" });
  return /* @__PURE__ */ jsxs(LegalLayout, { title: "Privacy Policy", updated: "May 26, 2026", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      'This Privacy Policy explains how Randolph Construction ("we," "us," or "our") collects, uses, and protects information when you visit ',
      /* @__PURE__ */ jsx("strong", { children: "randolph.construction" }),
      " or contact us for an estimate."
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "Information We Collect" }),
    /* @__PURE__ */ jsx("p", { children: "We only collect information you choose to give us, plus basic technical data:" }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Contact details you submit:" }),
        " when you fill out a quote or contact form, we collect your name, phone number, email address, project location, the service you're interested in, and any project details you provide."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Basic usage data:" }),
        " like most websites, our host may log standard information such as your IP address, browser type, and the pages you visit, to keep the site secure and running."
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "How We Use Your Information" }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: "To respond to your inquiry and prepare your estimate." }),
      /* @__PURE__ */ jsx("li", { children: "To schedule, perform, and follow up on the work you request." }),
      /* @__PURE__ */ jsx("li", { children: "To improve our website and services." })
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "How We Share Information" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "We do ",
      /* @__PURE__ */ jsx("strong", { children: "not" }),
      " sell or rent your personal information. We only share it with trusted service providers that help us operate — for example, our website host (Netlify), which processes form submissions and delivers them to us by email. These providers are only permitted to use your information to provide their services to us."
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "Data Retention" }),
    /* @__PURE__ */ jsx("p", { children: "We keep inquiry and project information only as long as needed to serve you and to keep reasonable business records. You can ask us to delete your information at any time." }),
    /* @__PURE__ */ jsx("h2", { children: "Your Choices" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "You may request access to, correction of, or deletion of the personal information you've shared with us by emailing ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.emailHref, children: BUSINESS.email }),
      " or calling",
      " ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, children: BUSINESS.phone }),
      "."
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "Children's Privacy" }),
    /* @__PURE__ */ jsx("p", { children: "Our website is intended for adults and is not directed to children under 13." }),
    /* @__PURE__ */ jsx("h2", { children: "Changes to This Policy" }),
    /* @__PURE__ */ jsx("p", { children: "We may update this policy from time to time. Any changes will be posted on this page with an updated date above." }),
    /* @__PURE__ */ jsx("h2", { children: "Contact Us" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Randolph Construction — Wadsworth, Ohio",
      /* @__PURE__ */ jsx("br", {}),
      "Phone: ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, children: BUSINESS.phone }),
      /* @__PURE__ */ jsx("br", {}),
      "Email: ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.emailHref, children: BUSINESS.email })
    ] })
  ] });
}
function Terms() {
  useSeo({ ...PAGE_SEO["/terms"], path: "/terms" });
  return /* @__PURE__ */ jsxs(LegalLayout, { title: "Terms of Use", updated: "May 26, 2026", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      "Welcome to ",
      /* @__PURE__ */ jsx("strong", { children: "randolph.construction" }),
      ". By using this website, you agree to these Terms of Use. If you do not agree, please do not use the site."
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "Use of This Site" }),
    /* @__PURE__ */ jsx("p", { children: "This website is provided for general information about Randolph Construction and the services we offer. You agree to use it only for lawful purposes and not to interfere with its operation or security." }),
    /* @__PURE__ */ jsx("h2", { children: "Estimates & Quotes" }),
    /* @__PURE__ */ jsx("p", { children: "Any pricing, availability, or service information on this site is for general guidance only and is not a binding offer. Project pricing is confirmed only in a written estimate or agreement provided directly by Randolph Construction after we understand the scope of your project." }),
    /* @__PURE__ */ jsx("h2", { children: "Intellectual Property" }),
    /* @__PURE__ */ jsx("p", { children: "All content on this site — including text, logos, photographs of our work, and design — is the property of Randolph Construction and may not be copied or reused without our permission." }),
    /* @__PURE__ */ jsx("h2", { children: "Photography" }),
    /* @__PURE__ */ jsx("p", { children: "Project photos shown on this site represent real work completed by Randolph Construction." }),
    /* @__PURE__ */ jsx("h2", { children: "Third-Party Links" }),
    /* @__PURE__ */ jsx("p", { children: "Our site may link to third-party websites (such as maps or social media). We are not responsible for the content or practices of those sites." }),
    /* @__PURE__ */ jsx("h2", { children: "Limitation of Liability" }),
    /* @__PURE__ */ jsx("p", { children: 'This website is provided "as is" without warranties of any kind. To the fullest extent permitted by law, Randolph Construction is not liable for any damages arising from your use of this website.' }),
    /* @__PURE__ */ jsx("h2", { children: "Governing Law" }),
    /* @__PURE__ */ jsx("p", { children: "These Terms are governed by the laws of the State of Ohio." }),
    /* @__PURE__ */ jsx("h2", { children: "Changes to These Terms" }),
    /* @__PURE__ */ jsx("p", { children: "We may update these Terms at any time. Continued use of the site means you accept the current version." }),
    /* @__PURE__ */ jsx("h2", { children: "Contact Us" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Randolph Construction — Wadsworth, Ohio",
      /* @__PURE__ */ jsx("br", {}),
      "Phone: ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, children: BUSINESS.phone }),
      /* @__PURE__ */ jsx("br", {}),
      "Email: ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.emailHref, children: BUSINESS.email })
    ] })
  ] });
}
function Accessibility() {
  useSeo({ ...PAGE_SEO["/accessibility"], path: "/accessibility" });
  return /* @__PURE__ */ jsxs(LegalLayout, { title: "Accessibility Statement", updated: "June 2026", children: [
    /* @__PURE__ */ jsx("h2", { children: "Our Commitment" }),
    /* @__PURE__ */ jsx("p", { children: "This site is built to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, the standard referenced by the ADA for web accessibility. We review and update our accessibility practices on an ongoing basis." }),
    /* @__PURE__ */ jsx("h2", { children: "What We Have Done" }),
    /* @__PURE__ */ jsx("p", { children: "We have taken the following steps to make this site accessible to as many visitors as possible:" }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: "We include skip links so keyboard and screen reader users can bypass navigation and get straight to the main content." }),
      /* @__PURE__ */ jsx("li", { children: "A visible outline appears on every interactive element when navigated by keyboard, so you always know where your focus is." }),
      /* @__PURE__ */ jsx("li", { children: "Text colors are chosen to meet the 4.5:1 minimum contrast ratio for readability by people with low vision." }),
      /* @__PURE__ */ jsx("li", { children: "All form fields, buttons, and interactive elements have descriptive labels readable by screen readers." }),
      /* @__PURE__ */ jsx("li", { children: "Animations automatically reduce for users who have the Reduce Motion preference enabled on their device." })
    ] }),
    /* @__PURE__ */ jsx("h2", { children: "Report an Issue" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "If you encounter any accessibility barrier on this site, please contact us and we will address it promptly. Call us at ",
      /* @__PURE__ */ jsx("a", { href: BUSINESS.phoneHref, children: BUSINESS.phone }),
      " and we will be glad to help."
    ] })
  ] });
}
const LUNCH_OPTIONS$1 = [
  { v: 0, label: "No lunch" },
  { v: 30, label: "30 min" },
  { v: 45, label: "45 min" },
  { v: 60, label: "1 hour" },
  { v: 90, label: "1.5 hours" }
];
const API$1 = "/.netlify/functions/timeclock";
const post = async (body) => {
  const r = await fetch(API$1, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Something went wrong.");
  return d;
};
const todayStr = () => {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const nowTime = () => {
  const d = /* @__PURE__ */ new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${(h + 11) % 12 + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
function calcHours(clockIn, clockOut, lunchMinutes) {
  if (!clockIn || !clockOut) return 0;
  const m = (t) => {
    const [h, mi] = t.split(":").map(Number);
    return h * 60 + mi;
  };
  let mins = m(clockOut) - m(clockIn);
  if (mins < 0) mins += 24 * 60;
  mins -= Math.max(0, Number(lunchMinutes) || 0);
  return Math.max(0, Math.round(mins / 60 * 100) / 100);
}
const label$1 = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input$1 = "bg-surface-container border-b border-surface-container-highest p-4 text-on-surface focus:border-primary focus:outline-none transition-all w-full text-lg";
const btn$1 = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50 w-full text-center";
function TimeClock() {
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [empId, setEmpId] = useState("");
  const [pin, setPin] = useState("");
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState(todayStr());
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [lunch, setLunch] = useState(30);
  const [jobName, setJobName] = useState("");
  const [address, setAddress] = useState("");
  const onJobChange = (name) => {
    setJobName(name);
    const j = jobs.find((x) => x.name === name);
    if (j) setAddress(j.address || "");
  };
  const [done, setDone] = useState(null);
  const [week, setWeek] = useState(null);
  const [openPunch, setOpenPunch] = useState(null);
  const [mode, setMode] = useState("home");
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Crew Time Clock | Randolph Construction";
    post({ action: "config" }).then((d) => {
      setEmployees(d.employees || []);
      setJobs(d.jobs || []);
      const u = new URLSearchParams(window.location.search).get("u");
      setEmpId(u || localStorage.getItem("rc_tc_emp") || "");
    }).catch(() => {
    }).finally(() => setLoaded(true));
  }, []);
  const weekBanner = week && /* @__PURE__ */ jsxs("div", { className: "bg-surface-container border-l-4 border-primary p-4 text-left", children: [
    /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest mb-1", children: "This week so far" }),
    /* @__PURE__ */ jsxs("div", { className: "font-display-lg text-2xl text-primary", children: [
      week.totalHours,
      " hrs · $",
      week.gross.toFixed(2)
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-on-surface-variant text-xs mt-1", children: [
      week.regHours,
      " regular",
      week.otHours > 0 ? ` + ${week.otHours} overtime (1.5×)` : "",
      " · gross, before taxes"
    ] })
  ] });
  const hours = calcHours(clockIn, clockOut, lunch);
  const pay = me ? Math.round(hours * me.rate * 100) / 100 : 0;
  const login = async (e) => {
    e.preventDefault();
    setErr("");
    if (!empId) return setErr("Pick your name.");
    if (!/^\d{4}$/.test(pin)) return setErr("Enter your 4-digit PIN.");
    setBusy(true);
    try {
      const d = await post({ action: "employee-login", employeeId: empId, pin });
      setMe(d.employee);
      localStorage.setItem("rc_tc_emp", empId);
      post({ action: "my-week", employeeId: empId, pin, date: todayStr() }).then((w) => setWeek(w.week)).catch(() => {
      });
      post({ action: "punch-status", employeeId: empId, pin }).then((p) => setOpenPunch(p.open || null)).catch(() => {
      });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!clockIn || !clockOut) return setErr("Enter your clock-in and clock-out times.");
    setBusy(true);
    try {
      const d = await post({ action: "submit", employeeId: me.id, pin, date, clockIn, clockOut, lunch, jobName, address });
      if (d.week) setWeek(d.week);
      setOpenPunch(null);
      setDone({ hours: d.entry.hours, pay: d.entry.pay });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const clockInNow = async () => {
    setErr("");
    setBusy(true);
    try {
      const t = nowTime(), d = todayStr();
      await post({ action: "punch-in", employeeId: me.id, pin, date: d, time: t });
      setOpenPunch({ date: d, clockIn: t });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const clockOutNow = () => {
    if (!openPunch) return;
    setDate(openPunch.date);
    setClockIn(openPunch.clockIn);
    setClockOut(nowTime());
    setLunch(30);
    setJobName("");
    setAddress("");
    setMode("manual");
  };
  const cancelPunch = async () => {
    if (!confirm("Cancel your clock-in?")) return;
    setBusy(true);
    try {
      await post({ action: "punch-cancel", employeeId: me.id, pin });
      setOpenPunch(null);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const startManual = () => {
    setClockIn("");
    setClockOut("");
    setLunch(30);
    setJobName("");
    setAddress("");
    setDate(todayStr());
    setMode("manual");
  };
  const logAnother = () => {
    setDone(null);
    setMode("home");
    setClockIn("");
    setClockOut("");
    setLunch(30);
    setJobName("");
    setAddress("");
    setDate(todayStr());
  };
  const switchUser = () => {
    setMe(null);
    setPin("");
    setDone(null);
    setOpenPunch(null);
    setMode("home");
    logAnother();
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md min-h-screen", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "pt-32 pb-24", children: /* @__PURE__ */ jsxs("section", { className: "max-w-xl mx-auto px-margin-mobile md:px-margin-desktop", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.3em] block mb-3", children: "Crew Time Clock" }),
        /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-4xl md:text-5xl uppercase leading-none", children: [
          "Log Your ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Hours" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body-md mt-4", children: "End of the day, takes about 20 seconds. Your hours and pay add up automatically." })
      ] }),
      !loaded ? /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "Loading…" }) : !me ? (
        /* ---- Login ---- */
        /* @__PURE__ */ jsxs("form", { onSubmit: login, className: "bg-surface-container-lowest p-6 md:p-8 border-2 border-surface-container-highest space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "emp", children: "Your Name" }),
            /* @__PURE__ */ jsxs("select", { id: "emp", className: input$1, value: empId, onChange: (e) => setEmpId(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select your name…" }),
              employees.map((e) => /* @__PURE__ */ jsx("option", { value: e.id, children: e.name }, e.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "pin", children: "4-Digit PIN" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "pin",
                className: `${input$1} tracking-[0.5em]`,
                type: "password",
                inputMode: "numeric",
                autoComplete: "off",
                maxLength: 4,
                value: pin,
                onChange: (e) => setPin(e.target.value.replace(/\D/g, "")),
                placeholder: "••••"
              }
            )
          ] }),
          err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
          /* @__PURE__ */ jsx("button", { className: btn$1, disabled: busy, children: busy ? "Checking…" : "Continue" })
        ] })
      ) : done ? (
        /* ---- Confirmation ---- */
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 border-2 border-primary text-center", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "material-symbols-outlined text-primary", style: { fontSize: 56 }, children: "check_circle" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-headline-md text-headline-md uppercase mt-3", children: [
            "Logged It, ",
            me.name.split(" ")[0]
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-10 my-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-display-lg text-4xl text-primary", children: done.hours }),
              /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest", children: "Hours Today" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-display-lg text-4xl text-primary", children: [
                "$",
                done.pay.toFixed(2)
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest", children: "Pay Today" })
            ] })
          ] }),
          weekBanner && /* @__PURE__ */ jsx("div", { className: "mb-6", children: weekBanner }),
          /* @__PURE__ */ jsx("button", { className: btn$1, onClick: logAnother, children: "Log Another Day" }),
          /* @__PURE__ */ jsxs("button", { className: "mt-3 text-on-surface-variant text-sm underline w-full", onClick: switchUser, children: [
            "Not ",
            me.name.split(" ")[0],
            "? Switch user"
          ] })
        ] })
      ) : mode === "home" ? (
        /* ---- Punch home ---- */
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-surface-container-lowest p-6 border-2 border-surface-container-highest", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest", children: "Logged in as" }),
              /* @__PURE__ */ jsx("div", { className: "font-headline-md text-headline-md text-primary", children: me.name })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: switchUser, className: "text-on-surface-variant text-xs underline", children: "Switch" })
          ] }),
          weekBanner,
          openPunch ? /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 border-2 border-primary text-center space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest", children: "You're on the clock" }),
              /* @__PURE__ */ jsxs("div", { className: "font-display-lg text-3xl text-primary mt-1", children: [
                "In at ",
                fmtTime(openPunch.clockIn)
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-sm mt-1", children: openPunch.date === todayStr() ? "Today" : `Started ${openPunch.date}` })
            ] }),
            /* @__PURE__ */ jsx("button", { className: btn$1, disabled: busy, onClick: clockOutNow, children: "Clock Out Now" }),
            /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant text-xs underline", onClick: cancelPunch, disabled: busy, children: "Cancel clock-in" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 border-2 border-surface-container-highest text-center space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "Tap to start your shift. It stamps the time for you." }),
            /* @__PURE__ */ jsx("button", { className: btn$1, disabled: busy, onClick: clockInNow, children: busy ? "…" : "Clock In Now" }),
            /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant text-sm underline", onClick: startManual, children: "Or log a past shift by hand" })
          ] }),
          err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold text-center", children: err })
        ] })
      ) : (
        /* ---- Entry (manual or finishing a punch) ---- */
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-surface-container-lowest p-6 md:p-8 border-2 border-surface-container-highest space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-surface-container-highest pb-4", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setMode("home"), className: "text-on-surface-variant text-sm hover:text-primary transition-colors", children: "← Back" }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-[10px] tracking-widest", children: "Logged in as" }),
              /* @__PURE__ */ jsx("div", { className: "font-label-bold text-primary", children: me.name })
            ] })
          ] }),
          weekBanner,
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "date", children: "Date" }),
            /* @__PURE__ */ jsx("input", { id: "date", type: "date", className: input$1, value: date, onChange: (e) => setDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "in", children: "Clock In" }),
              /* @__PURE__ */ jsx("input", { id: "in", type: "time", className: input$1, value: clockIn, onChange: (e) => setClockIn(e.target.value) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "out", children: "Clock Out" }),
              /* @__PURE__ */ jsx("input", { id: "out", type: "time", className: input$1, value: clockOut, onChange: (e) => setClockOut(e.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "lunch", children: "Lunch Break" }),
            /* @__PURE__ */ jsx("select", { id: "lunch", className: input$1, value: lunch, onChange: (e) => setLunch(Number(e.target.value)), children: LUNCH_OPTIONS$1.map((o) => /* @__PURE__ */ jsx("option", { value: o.v, children: o.label }, o.v)) }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs mt-1", children: "Unpaid lunch is subtracted from your hours." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "job", children: "Job" }),
            /* @__PURE__ */ jsxs("select", { id: "job", className: input$1, value: jobName, onChange: (e) => onJobChange(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a job…" }),
              jobs.map((j) => /* @__PURE__ */ jsx("option", { value: j.name, children: j.name }, j.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "addr", children: "Job Address" }),
            /* @__PURE__ */ jsx("input", { id: "addr", className: input$1, value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Auto-fills when you pick a job" }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs mt-1", children: "Picks up the saved address for the job. Edit it if you were somewhere else." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-surface-container p-4 border-l-4 border-primary", children: [
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest", children: "Today's Total" }),
            /* @__PURE__ */ jsxs("span", { className: "font-display-lg text-2xl text-primary", children: [
              hours,
              " hrs · $",
              pay.toFixed(2)
            ] })
          ] }),
          err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
          /* @__PURE__ */ jsx("button", { className: btn$1, disabled: busy, children: busy ? "Saving…" : "Submit Today's Hours" })
        ] })
      ),
      /* @__PURE__ */ jsx("p", { className: "text-center text-on-surface-variant/70 text-xs mt-6", children: "Private to Randolph Construction." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const LUNCH_OPTIONS = [
  { v: 0, label: "No lunch" },
  { v: 30, label: "30 min" },
  { v: 45, label: "45 min" },
  { v: 60, label: "1 hour" },
  { v: 90, label: "1.5 hours" }
];
const lunchToMins = (l) => l === true ? 30 : Math.max(0, Number(l) || 0);
const lunchLabel = (l) => {
  const n = lunchToMins(l);
  if (!n) return "None";
  if (n % 60 === 0) return `${n / 60} hr`;
  if (n > 60) return `${Math.floor(n / 60)} hr ${n % 60} min`;
  return `${n} min`;
};
const API = "/.netlify/functions/timeclock";
const label = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input = "bg-surface-container border-b border-surface-container-highest p-3 text-on-surface focus:border-primary focus:outline-none transition-all w-full";
const btn = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50";
const btnGhost = "border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-4 py-2 hover:text-primary hover:border-primary transition-all";
function TimeClockAdmin() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("entries");
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [entries, setEntries] = useState([]);
  const [weekStartDay, setWeekStartDay] = useState(0);
  const [lockedThrough, setLockedThrough] = useState(null);
  const post2 = async (body) => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, adminPin: pin }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Something went wrong.");
    return d;
  };
  const refresh = async () => {
    const a = await post2({ action: "admin-bootstrap" });
    setEmployees(a.employees || []);
    setJobs(a.jobs || []);
    setWeekStartDay(a.weekStartDay ?? 0);
    setLockedThrough(a.lockedThrough ?? null);
    const e = await post2({ action: "admin-entries" });
    setEntries(e.entries || []);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Time Clock Admin | Randolph Construction";
  }, []);
  const login = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await refresh();
      setAuthed(true);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  if (!authed) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md min-h-screen", children: [
      /* @__PURE__ */ jsx(Nav, {}),
      /* @__PURE__ */ jsx("main", { id: "main-content", className: "pt-32 pb-24", children: /* @__PURE__ */ jsxs("section", { className: "max-w-sm mx-auto px-margin-mobile", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-3xl uppercase mb-6", children: [
          "Owner ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Login" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: login, className: "bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "apin", children: "Admin PIN" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "apin",
                className: `${input} tracking-[0.5em] text-lg`,
                type: "password",
                inputMode: "numeric",
                maxLength: 4,
                value: pin,
                onChange: (e) => setPin(e.target.value.replace(/\D/g, "")),
                placeholder: "••••"
              }
            )
          ] }),
          err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
          /* @__PURE__ */ jsx("button", { className: `${btn} w-full`, disabled: busy, children: busy ? "Checking…" : "Sign In" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs text-center", children: "Default PIN is 1111 — change it under Settings." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md min-h-screen", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "pt-32 pb-24", children: /* @__PURE__ */ jsxs("section", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display-lg text-3xl md:text-4xl uppercase", children: [
          "Time Clock ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Admin" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: refresh, children: "Refresh" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-8 border-b border-surface-container-highest", children: ["entries", "payroll", "crew", "jobs", "settings"].map((t) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTab(t),
          className: `font-label-bold text-label-bold uppercase px-5 py-3 -mb-px border-b-2 transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`,
          children: t
        },
        t
      )) }),
      tab === "entries" && /* @__PURE__ */ jsx(EntriesTab, { entries, jobs, lockedThrough, post: post2, onChange: refresh }),
      tab === "payroll" && /* @__PURE__ */ jsx(PayrollTab, { entries, weekStartDay, lockedThrough, post: post2, onChange: refresh }),
      tab === "crew" && /* @__PURE__ */ jsx(CrewTab, { employees, post: post2, onChange: refresh }),
      tab === "jobs" && /* @__PURE__ */ jsx(JobsTab, { jobs, entries, post: post2, onChange: refresh }),
      tab === "settings" && /* @__PURE__ */ jsx(SettingsTab, { post: post2, weekStartDay, onChange: refresh })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const r2 = (n) => Math.round(n * 100) / 100;
const fmtWeek = (iso) => {
  const d = /* @__PURE__ */ new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
};
function weekStart(dateStr, startDay = 0) {
  const d = /* @__PURE__ */ new Date(`${dateStr}T00:00:00Z`);
  const off = (d.getUTCDay() - startDay + 7) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
}
function computePayroll(entries, startDay = 0) {
  const groups = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const key = `${e.employeeName}|${weekStart(e.date, startDay)}`;
    const arr = groups.get(key) || [];
    arr.push(e);
    groups.set(key, arr);
  }
  const rows = [];
  for (const [key, list] of Array.from(groups.entries())) {
    const [employee, week] = key.split("|");
    const sorted = [...list].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
    let cum = 0, reg = 0, ot = 0, gross = 0;
    for (const e of sorted) {
      const h = e.hours || 0;
      const regPart = Math.min(h, Math.max(0, 40 - cum));
      const otPart = h - regPart;
      reg += regPart;
      ot += otPart;
      gross += regPart * e.rate + otPart * e.rate * 1.5;
      cum += h;
    }
    rows.push({ employee, week, reg: r2(reg), ot: r2(ot), total: r2(reg + ot), gross: r2(gross) });
  }
  rows.sort((a, b) => b.week.localeCompare(a.week) || a.employee.localeCompare(b.employee));
  return rows;
}
function PayrollTab({ entries, weekStartDay, lockedThrough, post: post2, onChange }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lockDate, setLockDate] = useState(lockedThrough || "");
  const saveLock = async (clear = false) => {
    await post2({ action: "set-lock", lockedThrough: clear ? "" : lockDate });
    onChange();
  };
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to));
  const rows = computePayroll(filtered, weekStartDay);
  const grossTotal = rows.reduce((s, r) => s + r.gross, 0);
  const otTotal = rows.reduce((s, r) => s + r.ot, 0);
  const csv = () => {
    const head = ["Week of", "Employee", "Regular Hrs", "Overtime Hrs", "Total Hrs", "Gross Pay"];
    const body = [head, ...rows.map((r) => [r.week, r.employee, r.reg, r.ot, r.total, r.gross.toFixed(2)])].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = `randolph-payroll${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`;
    a.click();
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-5 border-2 border-surface-container-highest", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase mb-1", children: "Lock Payroll" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm mb-4", children: "Once you've paid a period, lock it so nobody can add or change times on or before that date." }),
      lockedThrough ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-primary uppercase tracking-widest text-sm", children: [
          "Locked through ",
          lockedThrough
        ] }),
        /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => saveLock(true), children: "Unlock" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, children: "Lock Through" }),
          /* @__PURE__ */ jsx("input", { type: "date", className: input, value: lockDate, onChange: (e) => setLockDate(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("button", { className: btn, disabled: !lockDate, onClick: () => saveLock(), children: "Lock" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 bg-surface-container-lowest p-5 border-2 border-surface-container-highest max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "From" }),
        /* @__PURE__ */ jsx("input", { type: "date", className: input, value: from, onChange: (e) => setFrom(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "To" }),
        /* @__PURE__ */ jsx("input", { type: "date", className: input, value: to, onChange: (e) => setTo(e.target.value) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Overtime Hours", value: otTotal.toFixed(2) }),
      /* @__PURE__ */ jsx(Stat, { label: "Total Gross Pay", value: `$${grossTotal.toFixed(2)}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: "Weekly Payroll" }),
      /* @__PURE__ */ jsx("button", { className: btn, onClick: csv, disabled: !rows.length, children: "Export Payroll CSV" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border-2 border-surface-container-highest", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-surface-container text-on-surface-variant uppercase text-xs tracking-wider", children: /* @__PURE__ */ jsx("tr", { children: ["Week of", "Employee", "Regular", "Overtime", "Total Hrs", "Gross Pay"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-label-bold", children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "p-6 text-center text-on-surface-variant", children: "No hours logged yet." }) }),
        rows.map((r, i) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-surface-container-highest", children: [
          /* @__PURE__ */ jsxs("td", { className: "p-3 whitespace-nowrap", children: [
            "Week of ",
            fmtWeek(r.week)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-3 whitespace-nowrap font-label-bold", children: r.employee }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: r.reg }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: r.ot > 0 ? /* @__PURE__ */ jsx("span", { className: "text-primary font-label-bold", children: r.ot }) : "0" }),
          /* @__PURE__ */ jsx("td", { className: "p-3 font-label-bold", children: r.total }),
          /* @__PURE__ */ jsxs("td", { className: "p-3 font-label-bold text-primary", children: [
            "$",
            r.gross.toFixed(2)
          ] })
        ] }, i))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant/80 text-xs", children: [
      "Overtime is calculated at 1.5× the hourly rate for hours over 40 in a workweek (starts ",
      DAYS[weekStartDay],
      "). Gross pay shown is before taxes and withholdings. Change the workweek under Settings."
    ] })
  ] });
}
function EntriesTab({ entries, jobs, lockedThrough, post: post2, onChange }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [emp, setEmp] = useState("");
  const [job, setJob] = useState("");
  const [editing, setEditing] = useState(null);
  const [saveErr, setSaveErr] = useState("");
  const empNames = useMemo(() => Array.from(new Set(entries.map((e) => e.employeeName))).sort(), [entries]);
  const jobNames = useMemo(() => Array.from(new Set(entries.map((e) => e.jobName).filter(Boolean))).sort(), [entries]);
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to) && (!emp || e.employeeName === emp) && (!job || e.jobName === job));
  const totalHrs = filtered.reduce((s, e) => s + e.hours, 0);
  const totalPay = filtered.reduce((s, e) => s + e.pay, 0);
  const byKey = (key) => {
    const m = /* @__PURE__ */ new Map();
    for (const e of filtered) {
      const k = e[key] || "(none)";
      const cur = m.get(k) || { hours: 0, pay: 0 };
      m.set(k, { hours: cur.hours + e.hours, pay: cur.pay + e.pay });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].pay - a[1].pay);
  };
  const csv = () => {
    const head = ["Date", "Employee", "Job", "Address", "Clock In", "Clock Out", "Lunch", "Hours", "Rate", "Pay"];
    const rows = filtered.map((e) => [e.date, e.employeeName, e.jobName, e.address, e.clockIn, e.clockOut, lunchLabel(e.lunch), e.hours, e.rate, e.pay]);
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const body = [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
    const blob = new Blob([body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `randolph-hours${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`;
    a.click();
  };
  const del = async (id) => {
    if (confirm("Delete this entry?")) {
      await post2({ action: "delete-entry", id });
      onChange();
    }
  };
  const saveEdit = async (ev) => {
    ev.preventDefault();
    setSaveErr("");
    if (!editing) return;
    try {
      await post2({ action: "update-entry", id: editing.id, date: editing.date, clockIn: editing.clockIn, clockOut: editing.clockOut, lunch: editing.lunch, jobName: editing.jobName, address: editing.address });
      setEditing(null);
      onChange();
    } catch (e2) {
      setSaveErr(e2.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4", onClick: () => setEditing(null), children: /* @__PURE__ */ jsxs("form", { onClick: (ev) => ev.stopPropagation(), onSubmit: saveEdit, className: "bg-surface-container-lowest border-2 border-primary p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-headline-md text-headline-md uppercase", children: [
        "Edit Entry — ",
        editing.employeeName
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Date" }),
        /* @__PURE__ */ jsx("input", { type: "date", className: input, value: editing.date, onChange: (ev) => setEditing({ ...editing, date: ev.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, children: "Clock In" }),
          /* @__PURE__ */ jsx("input", { type: "time", className: input, value: editing.clockIn, onChange: (ev) => setEditing({ ...editing, clockIn: ev.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, children: "Clock Out" }),
          /* @__PURE__ */ jsx("input", { type: "time", className: input, value: editing.clockOut, onChange: (ev) => setEditing({ ...editing, clockOut: ev.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Lunch Break" }),
        /* @__PURE__ */ jsxs("select", { className: input, value: lunchToMins(editing.lunch), onChange: (ev) => setEditing({ ...editing, lunch: Number(ev.target.value) }), children: [
          LUNCH_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.v, children: o.label }, o.v)),
          !LUNCH_OPTIONS.some((o) => o.v === lunchToMins(editing.lunch)) && /* @__PURE__ */ jsx("option", { value: lunchToMins(editing.lunch), children: lunchLabel(editing.lunch) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Job" }),
        /* @__PURE__ */ jsxs("select", { className: input, value: editing.jobName, onChange: (ev) => {
          const name = ev.target.value;
          const j = jobs.find((x) => x.name === name);
          setEditing({ ...editing, jobName: name, address: j ? j.address || "" : editing.address });
        }, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "—" }),
          jobs.map((j) => /* @__PURE__ */ jsx("option", { value: j.name, children: j.name }, j.id)),
          editing.jobName && !jobs.some((j) => j.name === editing.jobName) && /* @__PURE__ */ jsx("option", { value: editing.jobName, children: editing.jobName })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Address" }),
        /* @__PURE__ */ jsx("input", { className: input, value: editing.address, onChange: (ev) => setEditing({ ...editing, address: ev.target.value }) })
      ] }),
      saveErr && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: saveErr }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: "Save" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: () => setEditing(null), children: "Cancel" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "Hours and pay recalculate automatically when you save." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest p-5 border-2 border-surface-container-highest", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "From" }),
        /* @__PURE__ */ jsx("input", { type: "date", className: input, value: from, onChange: (e) => setFrom(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "To" }),
        /* @__PURE__ */ jsx("input", { type: "date", className: input, value: to, onChange: (e) => setTo(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Employee" }),
        /* @__PURE__ */ jsxs("select", { className: input, value: emp, onChange: (e) => setEmp(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
          empNames.map((n) => /* @__PURE__ */ jsx("option", { children: n }, n))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Job" }),
        /* @__PURE__ */ jsxs("select", { className: input, value: job, onChange: (e) => setJob(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
          jobNames.map((n) => /* @__PURE__ */ jsx("option", { children: n }, n))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Entries", value: String(filtered.length) }),
      /* @__PURE__ */ jsx(Stat, { label: "Total Hours", value: totalHrs.toFixed(2) }),
      /* @__PURE__ */ jsx(Stat, { label: "Total Pay", value: `$${totalPay.toFixed(2)}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(RollUp, { title: "By Employee", rows: byKey("employeeName") }),
      /* @__PURE__ */ jsx(RollUp, { title: "By Job", rows: byKey("jobName") })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: "Entries" }),
      /* @__PURE__ */ jsx("button", { className: btn, onClick: csv, disabled: !filtered.length, children: "Export CSV" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border-2 border-surface-container-highest", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-surface-container text-on-surface-variant uppercase text-xs tracking-wider", children: /* @__PURE__ */ jsx("tr", { children: ["Date", "Employee", "Job", "In", "Out", "Lunch", "Hours", "Pay", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left p-3 font-label-bold", children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 9, className: "p-6 text-center text-on-surface-variant", children: "No entries yet." }) }),
        filtered.map((e) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-surface-container-highest", children: [
          /* @__PURE__ */ jsx("td", { className: "p-3 whitespace-nowrap", children: e.date }),
          /* @__PURE__ */ jsx("td", { className: "p-3 whitespace-nowrap", children: e.employeeName }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: e.jobName || /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "—" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: e.clockIn }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: e.clockOut }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: lunchLabel(e.lunch) }),
          /* @__PURE__ */ jsx("td", { className: "p-3 font-label-bold", children: e.hours }),
          /* @__PURE__ */ jsxs("td", { className: "p-3 font-label-bold text-primary", children: [
            "$",
            e.pay.toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-3 text-right whitespace-nowrap", children: lockedThrough && e.date <= lockedThrough ? /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant/70 text-xs uppercase tracking-wider", children: "Locked" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setEditing(e), className: "text-on-surface-variant hover:text-primary text-xs underline mr-3", children: "edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => del(e.id), className: "text-on-surface-variant hover:text-error text-xs underline", children: "delete" })
          ] }) })
        ] }, e.id))
      ] })
    ] }) })
  ] });
}
function Stat({ label: l, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-5 border-2 border-surface-container-highest", children: [
    /* @__PURE__ */ jsx("div", { className: "text-label-bold uppercase text-on-surface-variant text-xs tracking-widest", children: l }),
    /* @__PURE__ */ jsx("div", { className: "font-display-lg text-3xl text-primary mt-1", children: value })
  ] });
}
function RollUp({ title, rows }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest border-2 border-surface-container-highest", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-surface-container px-4 py-3 font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest", children: title }),
    rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-4 text-on-surface-variant text-sm", children: "No data." }) : rows.map(([k, v]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-4 py-3 border-t border-surface-container-highest", children: [
      /* @__PURE__ */ jsx("span", { className: "truncate pr-3", children: k }),
      /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap", children: [
        /* @__PURE__ */ jsxs("strong", { className: "text-on-surface", children: [
          v.hours.toFixed(2),
          " hrs"
        ] }),
        " ",
        /* @__PURE__ */ jsxs("span", { className: "text-primary font-label-bold", children: [
          "$",
          v.pay.toFixed(2)
        ] })
      ] })
    ] }, k))
  ] });
}
function CrewTab({ employees, post: post2, onChange }) {
  const blank = { id: "", name: "", rate: "", pin: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");
  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
    }
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };
  const save = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await post2({ action: "save-employee", employee: { id: f.id || void 0, name: f.name, rate: Number(f.rate), pin: f.pin } });
      setF(blank);
      onChange();
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const del = async (id) => {
    if (confirm("Remove this person?")) {
      await post2({ action: "delete-employee", id });
      onChange();
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: f.id ? "Edit Crew Member" : "Add Crew Member" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Name" }),
        /* @__PURE__ */ jsx("input", { className: input, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Hourly Rate ($)" }),
        /* @__PURE__ */ jsx("input", { className: input, inputMode: "decimal", value: f.rate, onChange: (e) => setF({ ...f, rate: e.target.value }), placeholder: "25" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "4-Digit PIN" }),
        /* @__PURE__ */ jsx("input", { className: `${input} tracking-[0.4em]`, inputMode: "numeric", maxLength: 4, value: f.pin, onChange: (e) => setF({ ...f, pin: e.target.value.replace(/\D/g, "") }), placeholder: "0000" })
      ] }),
      err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: f.id ? "Save Changes" : "Add Member" }),
        f.id && /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: () => setF(blank), children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      employees.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "No crew yet. Add your first person." }),
      employees.map((e) => {
        const link = `${typeof window !== "undefined" ? window.location.origin : ""}/timeclock?u=${e.id}`;
        return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-4 border-2 border-surface-container-highest space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-headline-md text-headline-md", children: e.name }),
              /* @__PURE__ */ jsxs("div", { className: "text-on-surface-variant text-sm", children: [
                "$",
                e.rate,
                "/hr · PIN ",
                e.pin
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => setF({ id: e.id, name: e.name, rate: String(e.rate), pin: e.pin }), children: "Edit" }),
              /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant hover:text-error text-xs underline", onClick: () => del(e.id), children: "Remove" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-surface-container p-2 border border-surface-container-highest", children: [
            /* @__PURE__ */ jsx("input", { readOnly: true, value: link, onFocus: (ev) => ev.currentTarget.select(), className: "flex-1 min-w-0 bg-transparent text-on-surface-variant text-xs outline-none" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => copy(e.id, link), className: "shrink-0 bg-primary-container text-on-primary-container font-label-bold text-xs uppercase px-3 py-1.5 metallic-gradient beveled-edge", children: copied === e.id ? "Copied!" : "Copy link" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant/70 text-xs", children: [
            "Text this link to ",
            e.name.split(" ")[0],
            " — it opens straight to their name; they just enter PIN ",
            e.pin,
            "."
          ] })
        ] }, e.id);
      })
    ] })
  ] });
}
function JobsTab({ jobs, entries, post: post2, onChange }) {
  const blank = { id: "", name: "", address: "" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const save = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await post2({ action: "save-job", job: { id: f.id || void 0, name: f.name, address: f.address } });
      setF(blank);
      onChange();
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const del = async (id) => {
    if (confirm("Remove this job? Its logged hours stay in your records.")) {
      await post2({ action: "delete-job", id });
      if (f.id === id) setF(blank);
      onChange();
    }
  };
  const stats = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const e of entries) {
      if (!e.jobName) continue;
      const c = m.get(e.jobName) || { hours: 0, pay: 0 };
      m.set(e.jobName, { hours: c.hours + e.hours, pay: c.pay + e.pay });
    }
    return m;
  }, [entries]);
  return /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: f.id ? "Edit Job" : "Add a Job" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm", children: "These show up in the crew's job dropdown, and the address auto-fills for them at clock-out." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Job Name" }),
        /* @__PURE__ */ jsx("input", { className: input, value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }), placeholder: "e.g. 123 Main St — Driveway" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Job Site Address" }),
        /* @__PURE__ */ jsx("input", { className: input, value: f.address, onChange: (e) => setF({ ...f, address: e.target.value }), placeholder: "123 Main St, Wadsworth, OH" })
      ] }),
      err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: f.id ? "Save Changes" : "Add Job" }),
        f.id && /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: () => setF(blank), children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      jobs.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "No jobs yet." }),
      jobs.map((j) => {
        const s = stats.get(j.name);
        return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-4 border-2 border-surface-container-highest", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-label-bold", children: j.name }),
              j.address ? /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-sm mt-0.5", children: j.address }) : /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant/60 text-xs mt-0.5 italic", children: "No address saved" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => setF({ id: j.id, name: j.name, address: j.address || "" }), children: "Edit" }),
              /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant hover:text-error text-xs underline", onClick: () => del(j.id), children: "Remove" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-on-surface-variant text-sm mt-2", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-primary font-label-bold", children: [
              (s?.hours || 0).toFixed(2),
              " man-hours"
            ] }),
            " · ",
            "$",
            (s?.pay || 0).toFixed(2),
            " labor to date"
          ] })
        ] }, j.id);
      }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs pt-1", children: "Labor shown is straight-time hours logged against each job, totaled across all time." })
    ] })
  ] });
}
function SettingsTab({ post: post2, weekStartDay, onChange }) {
  const [newPin, setNewPin] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const savePin = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await post2({ action: "set-admin-pin", newPin });
      setMsg("Admin PIN updated.");
      setNewPin("");
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const [wd, setWd] = useState(String(weekStartDay));
  const [wmsg, setWmsg] = useState("");
  const [werr, setWerr] = useState("");
  const saveWeek = async (e) => {
    e.preventDefault();
    setWerr("");
    setWmsg("");
    try {
      await post2({ action: "set-week-start", weekStartDay: Number(wd) });
      setWmsg(`Workweek now starts ${DAYS[Number(wd)]}.`);
      onChange();
    } catch (e2) {
      setWerr(e2.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: savePin, className: "bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: "Change Admin PIN" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "New 4-Digit PIN" }),
        /* @__PURE__ */ jsx("input", { className: `${input} tracking-[0.4em]`, inputMode: "numeric", maxLength: 4, value: newPin, onChange: (e) => setNewPin(e.target.value.replace(/\D/g, "")), placeholder: "0000" })
      ] }),
      msg && /* @__PURE__ */ jsx("p", { className: "text-primary text-sm font-label-bold", children: msg }),
      err && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: err }),
      /* @__PURE__ */ jsx("button", { className: btn, children: "Update PIN" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveWeek, className: "bg-surface-container-lowest p-6 border-2 border-surface-container-highest space-y-5 h-fit", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: "Workweek for Overtime" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm", children: "Overtime pays 1.5× for hours over 40 in a week. Pick the day your pay week starts so the totals match your payroll." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, children: "Week Starts On" }),
        /* @__PURE__ */ jsx("select", { className: input, value: wd, onChange: (e) => setWd(e.target.value), children: DAYS.map((d, i) => /* @__PURE__ */ jsx("option", { value: i, children: d }, i)) })
      ] }),
      wmsg && /* @__PURE__ */ jsx("p", { className: "text-primary text-sm font-label-bold", children: wmsg }),
      werr && /* @__PURE__ */ jsx("p", { className: "text-error text-sm font-label-bold", children: werr }),
      /* @__PURE__ */ jsx("button", { className: btn, children: "Save Workweek" })
    ] })
  ] });
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-transparent shadow-xs hover:bg-accent dark:bg-transparent dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function NotFound() {
  const [, setLocation] = useLocation();
  const handleGoHome = () => {
    setLocation("/");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100", children: /* @__PURE__ */ jsx(Card, { className: "w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-8 pb-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-red-100 rounded-full animate-pulse" }),
      /* @__PURE__ */ jsx(AlertCircle, { className: "relative h-16 w-16 text-red-500" })
    ] }) }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-2", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-slate-700 mb-4", children: "Page Not Found" }),
    /* @__PURE__ */ jsxs("p", { className: "text-slate-600 mb-8 leading-relaxed", children: [
      "Sorry, the page you are looking for doesn't exist.",
      /* @__PURE__ */ jsx("br", {}),
      "It may have been moved or deleted."
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: "not-found-button-group",
        className: "flex flex-col sm:flex-row gap-3 justify-center",
        children: /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleGoHome,
            className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
            children: [
              /* @__PURE__ */ jsx(Home$1, { className: "w-4 h-4 mr-2" }),
              "Go Home"
            ]
          }
        )
      }
    )
  ] }) }) });
}
function Router() {
  return /* @__PURE__ */ jsxs(Switch, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", component: Home }),
    /* @__PURE__ */ jsx(Route, { path: "/services", component: Services }),
    /* @__PURE__ */ jsx(Route, { path: "/gallery", component: Gallery }),
    /* @__PURE__ */ jsx(Route, { path: "/contact", component: Contact }),
    /* @__PURE__ */ jsx(Route, { path: "/service-area/:city", component: ServiceArea }),
    /* @__PURE__ */ jsx(Route, { path: "/privacy", component: Privacy }),
    /* @__PURE__ */ jsx(Route, { path: "/terms", component: Terms }),
    /* @__PURE__ */ jsx(Route, { path: "/accessibility", component: Accessibility }),
    /* @__PURE__ */ jsx(Route, { path: "/admin", component: TimeClockAdmin }),
    /* @__PURE__ */ jsx(Route, { path: "/timeclock", component: TimeClock }),
    /* @__PURE__ */ jsx(Route, { path: "/404", component: NotFound }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] });
}
function GlobalCtas() {
  const [location] = useLocation();
  if (location.startsWith("/timeclock") || location.startsWith("/admin")) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MobileActionBar, {}),
    /* @__PURE__ */ jsx(StickyEstimate, {})
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(ThemeProvider, { defaultTheme: "dark", children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsx(Toaster, {}),
    /* @__PURE__ */ jsx(Router, {}),
    /* @__PURE__ */ jsx(GlobalCtas, {}),
    /* @__PURE__ */ jsx(CookieBanner, {})
  ] }) }) });
}
function render(path) {
  return renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(Router$1, { ssrPath: path, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
}
export {
  render
};
