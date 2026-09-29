import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, Component, createContext, useRef, useMemo, useCallback, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Link, useLocation, useRoute, Redirect, Switch, Route, Router as Router$1 } from "wouter";
import { useTheme } from "next-themes";
import { Toaster as Toaster$1 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { Phone, Hammer, AlertTriangle, RotateCcw, Menu, X, ArrowUpRight, MapPin, Clock, ThumbsUp, Camera, Sprout, CloudLightning, Snowflake, CloudRain, CloudDrizzle, CloudFog, Cloud, CloudSun, Sun, Trees, Layers, Frame, Truck, HelpCircle, Zap, AlertCircle, Home as Home$1 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
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
  // Geo (approximate centroid of Wadsworth, OH)
  geo: {
    latitude: 41.0259,
    longitude: -81.7298
  },
  // Service area
  serviceCity: "Wadsworth",
  serviceAreaCopy: "Wadsworth, Medina, Norton, Barberton, and surrounding Northeast Ohio communities",
  // Services
  services: ["Landscaping", "Hardscaping", "Custom Composite Decks", "Concrete"],
  // Partnerships
  partners: [
    {
      name: "GardenReady",
      relationship: "Preferred Installer Partner",
      url: "https://gardenready.co",
      logoWhite: "/images/randolph/gardenready-white.webp"
    }
  ],
  // USDA hardiness zone (Wadsworth / Medina County, NE Ohio)
  hardinessZone: "6a"
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
  },
  "/images/randolph/gardenready-white.webp": {
    "width": 600,
    "height": 115
  },
  "/images/randolph/gardenready-green.webp": {
    "width": 600,
    "height": 115
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
function GardenReadyBadge({ variant = "band" }) {
  const partner = BUSINESS.partners.find((p) => p.name === "GardenReady");
  if (!partner) return null;
  if (variant === "inline") {
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: partner.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-3 group",
        "aria-label": `${partner.relationship} of GardenReady (opens in a new tab)`,
        children: [
          /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-[11px] uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors", children: [
            partner.relationship,
            " of"
          ] }),
          /* @__PURE__ */ jsx(Img, { src: partner.logoWhite, alt: "GardenReady", loading: "eager", className: "h-4 w-auto opacity-80 group-hover:opacity-100 transition-opacity" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-background border-b border-surface-container-highest", children: /* @__PURE__ */ jsx("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: /* @__PURE__ */ jsxs(
    "a",
    {
      href: partner.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 group",
      "aria-label": `${partner.relationship} of GardenReady (opens in a new tab)`,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-label-bold uppercase tracking-[0.25em] text-on-surface-variant text-center", children: [
          partner.relationship,
          " of"
        ] }),
        /* @__PURE__ */ jsx(
          Img,
          {
            src: partner.logoWhite,
            alt: "GardenReady",
            loading: "eager",
            className: "h-8 md:h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          }
        )
      ]
    }
  ) }) });
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
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(GardenReadyBadge, { variant: "inline" }) })
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
function describe(code) {
  if (code === 0) return { label: "Clear", icon: "clear" };
  if (code === 1) return { label: "Mostly Sunny", icon: "clear" };
  if (code === 2) return { label: "Partly Cloudy", icon: "partly" };
  if (code === 3) return { label: "Cloudy", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain Showers", icon: "rain" };
  if (code === 85 || code === 86) return { label: "Snow Showers", icon: "snow" };
  if (code >= 95) return { label: "Thunderstorms", icon: "thunder" };
  return { label: "Cloudy", icon: "cloudy" };
}
function weekday(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short" });
}
let shared = null;
function getSharedWeather(lat, lon) {
  shared ??= fetchWeather(lat, lon).catch(() => null);
  return shared;
}
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America/New_York&forecast_days=3`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();
  const cur = data.current;
  const daily = data.daily;
  if (!cur || !daily?.time) return null;
  const cd = describe(cur.weather_code ?? -1);
  const current = {
    temp: Math.round(cur.temperature_2m ?? 0),
    label: cd.label,
    icon: cd.icon
  };
  const days = daily.time.map((iso, i) => {
    const d = describe(daily.weather_code?.[i] ?? -1);
    return {
      date: iso,
      weekday: weekday(iso),
      hi: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      lo: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      precip: Math.round(daily.precipitation_probability_max?.[i] ?? 0),
      label: d.label,
      icon: d.icon
    };
  });
  return { current, days };
}
const SEASON_GUIDES = {
  spring: {
    key: "spring",
    label: "Spring",
    window: "March – May",
    headline: "Spring is prime planting season in Northeast Ohio",
    intro: "Once the soil warms and the last hard frost passes (usually mid-May around Wadsworth), it's the ideal window to establish perennials, trees, shrubs, and cool-season lawns before summer heat sets in.",
    plants: [
      { name: "Coneflower (Echinacea)", note: "Tough native perennial, pollinator magnet, thrives in zone 6a." },
      { name: "Black-Eyed Susan (Rudbeckia)", note: "Hardy, long-blooming, low-maintenance color." },
      { name: "Cool-season grass seed", note: "Fescue and Kentucky bluegrass establish best in spring's cool, moist soil." },
      { name: "Hydrangea", note: "Plant now for big summer blooms; loves our climate." },
      { name: "Pansies & snapdragons", note: "Cold-hardy annuals for instant early-season color." }
    ],
    tie: "Spring is the busiest window for new landscape beds, fresh sod, and lawn renovation. Book early — the calendar fills fast."
  },
  summer: {
    key: "summer",
    label: "Summer",
    window: "June – August",
    headline: "Keep your landscape thriving through the heat",
    intro: "Summer is about maintaining established plantings and choosing heat-tolerant varieties. New sod and seed struggle in the heat, so summer is the perfect time to plan hardscaping and outdoor living projects that make your yard usable all season.",
    plants: [
      { name: "Russian Sage", note: "Drought-tolerant, silvery blue blooms that shrug off July heat." },
      { name: "Coreopsis", note: "Sun-loving, cheerful, and blooms all summer with little water." },
      { name: "Ornamental grasses", note: "Add movement and texture; virtually maintenance-free once established." },
      { name: "Daylilies", note: "Nearly indestructible color that handles heat and dry spells." },
      { name: "Petunias & marigolds", note: "Reliable annuals for containers and borders in full sun." }
    ],
    tie: "Too hot for new lawns? It's the ideal time to build the patio, fire pit, or retaining wall you'll enjoy this fall."
  },
  fall: {
    key: "fall",
    label: "Fall",
    window: "September – November",
    headline: "Fall is the best-kept secret for planting",
    intro: "Cool air and warm soil make autumn the single best time to plant trees, shrubs, and perennials in Northeast Ohio — roots establish through fall and winter for a head start next spring. It's also the top window to lay sod and overseed tired lawns.",
    plants: [
      { name: "Trees & shrubs", note: "Cool soil means strong root growth before winter dormancy. Best planting window of the year." },
      { name: "Spring bulbs", note: "Tulips, daffodils, and crocus go in now for an early-spring show." },
      { name: "Mums & ornamental kale", note: "Classic fall color that handles the first frosts." },
      { name: "Sod & overseeding", note: "Cool, moist conditions give new turf its best possible start." },
      { name: "Divide perennials", note: "Split and replant hostas, daylilies, and grasses to fill out beds." }
    ],
    tie: "Fall is the smartest time to install new landscaping and lay sod — and to get concrete and hardscaping done before the freeze."
  },
  winter: {
    key: "winter",
    label: "Winter",
    window: "December – February",
    headline: "Plan now, build now, plant come spring",
    intro: "The ground is dormant, but winter is the right time to design next season's landscape and take on hardscaping — patios, walls, and fire pits go in year-round. Booking your spring landscaping now means you're first on the schedule when the ground thaws.",
    plants: [
      { name: "Evergreens (protect)", note: "Shield arborvitae and boxwood from salt spray and drying winter wind." },
      { name: "Winterberry Holly", note: "Bare red berries add rare winter color to Ohio landscapes." },
      { name: "Plan your beds", note: "Winter is for design — map out the perennials and trees you'll plant in spring." },
      { name: "Hardscape projects", note: "Patios, retaining walls, and fire pits can be built through the off-season." },
      { name: "Book spring work", note: "Reserve your spot now; spring landscaping calendars fill by March." }
    ],
    tie: "Winter is design-and-build season. Lock in your spring landscaping and let us handle hardscaping while the yard rests."
  }
};
function seasonByMonth(date = /* @__PURE__ */ new Date()) {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
}
function currentSeasonGuide(date = /* @__PURE__ */ new Date()) {
  return SEASON_GUIDES[seasonByMonth(date)];
}
const ICONS = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  thunder: CloudLightning
};
function WeatherIconEl({ icon, className }) {
  const C = ICONS[icon] || Cloud;
  return /* @__PURE__ */ jsx(C, { className, "aria-hidden": "true" });
}
function WeatherPlanting() {
  const guide = currentSeasonGuide();
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    let alive = true;
    getSharedWeather(BUSINESS.geo.latitude, BUSINESS.geo.longitude).then((w) => {
      if (alive) setWeather(w);
    });
    return () => {
      alive = false;
    };
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest", children: /* @__PURE__ */ jsxs("div", { className: "max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "h-[2px] w-12 bg-primary" }),
      /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em]", children: "Wadsworth Right Now" })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "font-headline-lg text-4xl md:text-headline-lg uppercase mb-4 leading-none max-w-3xl", children: guide.headline }),
    /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12", children: guide.intro }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start", children: [
      weather && /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 bg-surface-container border-2 border-surface-container-highest bevel-stone p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant mb-1", children: "Wadsworth, OH" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(WeatherIconEl, { icon: weather.current.icon, className: "w-9 h-9 text-primary" }),
            /* @__PURE__ */ jsxs("span", { className: "font-display-lg text-5xl leading-none text-on-surface", children: [
              weather.current.temp,
              "°"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-body-md text-on-surface-variant mt-1", children: weather.current.label })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 border-t border-surface-container-highest pt-4", children: weather.days.map((d) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "font-label-bold text-[11px] uppercase text-on-surface-variant mb-1", children: d.weekday }),
          /* @__PURE__ */ jsx(WeatherIconEl, { icon: d.icon, className: "w-6 h-6 mx-auto text-on-surface-variant" }),
          /* @__PURE__ */ jsxs("p", { className: "font-body-md text-sm text-on-surface mt-1", children: [
            d.hi,
            "° ",
            /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant", children: [
              "/ ",
              d.lo,
              "°"
            ] })
          ] })
        ] }, d.date)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: weather ? "lg:col-span-8" : "lg:col-span-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx(Sprout, { className: "w-6 h-6 text-primary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs("h3", { className: "font-headline-md text-2xl md:text-headline-md uppercase", children: [
            "What to Plant Now — ",
            guide.label,
            " in Zone ",
            BUSINESS.hardinessZone
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8", children: guide.plants.map((p) => /* @__PURE__ */ jsxs("li", { className: "border-l-2 border-surface-container-highest pl-4 py-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-title-lg text-title-lg text-on-surface", children: p.name }),
          /* @__PURE__ */ jsx("p", { className: "font-body-md text-body-md text-on-surface-variant", children: p.note })
        ] }, p.name)) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container border-l-4 border-primary p-6 flex flex-col sm:flex-row sm:items-center gap-6 justify-between", children: [
          /* @__PURE__ */ jsx("p", { className: "font-body-lg text-body-lg text-on-surface", children: guide.tie }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "shrink-0 text-center bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-8 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95",
              children: "Plan Your Project"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
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
function readFormValues$1(formEl, state) {
  const out = { "form-name": "contact", ...state };
  const fd = new FormData(formEl);
  for (const [k, v] of fd.entries()) {
    if (k === "bot-field") continue;
    const val = String(v);
    if (val.trim() !== "") out[k] = val;
  }
  return out;
}
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
    const formEl = e.currentTarget;
    setErrorMsg("");
    if (!form.name || !form.email) {
      setErrorMsg("Please add your name and email.");
      return;
    }
    setSubmitting(true);
    const captured = String(new FormData(formEl).get("name") || form.name).trim().split(/\s+/)[0];
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode$1(readFormValues$1(formEl, form))
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
      /* @__PURE__ */ jsx(GardenReadyBadge, { variant: "band" }),
      /* @__PURE__ */ jsx(WeatherPlanting, {}),
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
function readFormValues(formEl, state) {
  const out = { "form-name": "contact", ...state };
  const fd = new FormData(formEl);
  for (const [k, v] of fd.entries()) {
    if (k === "bot-field") continue;
    const val = String(v);
    if (val.trim() !== "") out[k] = val;
  }
  return out;
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
    const formEl = e.currentTarget;
    setErrorMsg("");
    if (!form.name || !form.phone || !form.email) {
      setErrorMsg("Please fill in your name, phone, and email.");
      return;
    }
    setSubmitting(true);
    const captured = String(new FormData(formEl).get("name") || form.name).trim().split(/\s+/)[0];
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(readFormValues(formEl, form))
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
class ApiError extends Error {
  constructor(message, relogin) {
    super(message);
    this.relogin = relogin;
  }
}
const post = async (body) => {
  const r = await fetch(API$1, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(d.error || "Something went wrong.", d.relogin === true);
  return d;
};
const todayStr$1 = () => {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const nowTime = () => {
  const d = /* @__PURE__ */ new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const fmtTime$1 = (t) => {
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
const getLoc = () => new Promise((resolve) => {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) return resolve({ locNote: "unavailable" });
  navigator.geolocation.getCurrentPosition(
    (p) => resolve({ loc: { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy } }),
    (e) => resolve({ locNote: e.code === 1 ? "denied" : e.code === 3 ? "timeout" : "unavailable" }),
    { enableHighAccuracy: true, timeout: 8e3, maximumAge: 6e4 }
  );
});
const label$1 = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input$1 = "bg-surface-container border-b border-surface-container-highest p-4 text-on-surface focus:border-primary focus:outline-none transition-all w-full text-lg";
const btn$1 = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-6 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50 w-full text-center";
function TimeClock() {
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [locationStamp, setLocationStamp] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [empId, setEmpId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [token, setToken] = useState("");
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [date, setDate] = useState(todayStr$1());
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [lunch, setLunch] = useState(30);
  const [jobId, setJobId] = useState("");
  const [address, setAddress] = useState("");
  const onJobChange = (id) => {
    setJobId(id);
    const j = jobs.find((x) => x.id === id);
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
      setLocationStamp(d.locationStamp === true);
      const u = new URLSearchParams(window.location.search).get("u");
      let remembered = "";
      try {
        remembered = localStorage.getItem("rc_tc_emp") || "";
      } catch {
      }
      setEmpId(u || remembered);
    }).catch(() => {
    }).finally(() => setLoaded(true));
  }, []);
  const weekBanner = week && /* @__PURE__ */ jsxs("div", { className: "bg-surface-container border border-surface-container-highest p-4 text-left", children: [
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
  const resetEntry = () => {
    setClockIn("");
    setClockOut("");
    setLunch(30);
    setJobId("");
    setAddress("");
    setDate(todayStr$1());
  };
  const switchUser = () => {
    setMe(null);
    setToken("");
    setPin("");
    setShowPin(false);
    setDone(null);
    setOpenPunch(null);
    setWeek(null);
    setMode("home");
    resetEntry();
  };
  const fail = (e) => {
    const x = e;
    if (x.relogin) switchUser();
    setErr(x.message);
  };
  const login = async (e) => {
    e.preventDefault();
    setErr("");
    if (!empId) return setErr("Pick your name.");
    if (!/^\d{4}$/.test(pin)) return setErr("Enter your 4-digit PIN.");
    setBusy("Checking…");
    try {
      const d = await post({ action: "employee-login", employeeId: empId, pin });
      setMe(d.employee);
      setToken(d.token);
      setPin("");
      try {
        localStorage.setItem("rc_tc_emp", empId);
      } catch {
      }
      post({ action: "my-week", token: d.token, date: todayStr$1() }).then((w) => setWeek(w.week)).catch(() => {
      });
      post({ action: "punch-status", token: d.token }).then((p) => setOpenPunch(p.open || null)).catch(() => {
      });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy("");
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!clockIn || !clockOut) return setErr("Enter your clock-in and clock-out times.");
    try {
      let where = {};
      if (locationStamp) {
        setBusy("Finding your location…");
        where = await getLoc();
      }
      setBusy("Saving…");
      const d = await post({ action: "submit", token, date, clockIn, clockOut, lunch, jobId, address, ...where });
      if (d.week) setWeek(d.week);
      setOpenPunch(null);
      setDone({ hours: d.entry.hours, pay: d.entry.pay });
    } catch (e2) {
      fail(e2);
    } finally {
      setBusy("");
    }
  };
  const clockInNow = async () => {
    setErr("");
    try {
      let where = {};
      if (locationStamp) {
        setBusy("Finding your location…");
        where = await getLoc();
      }
      setBusy("Clocking in…");
      const d = await post({ action: "punch-in", token, ...where });
      setOpenPunch(d.open);
    } catch (e2) {
      fail(e2);
    } finally {
      setBusy("");
    }
  };
  const clockOutNow = () => {
    if (!openPunch) return;
    setDate(openPunch.date);
    setClockIn(openPunch.clockIn);
    setClockOut(nowTime());
    setLunch(30);
    setJobId("");
    setAddress("");
    setMode("manual");
  };
  const cancelPunch = async () => {
    if (!confirm("Cancel your clock-in?")) return;
    setBusy("…");
    try {
      await post({ action: "punch-cancel", token });
      setOpenPunch(null);
    } catch (e2) {
      fail(e2);
    } finally {
      setBusy("");
    }
  };
  const startManual = () => {
    setClockIn("08:00");
    setClockOut("16:00");
    setLunch(30);
    setJobId("");
    setAddress("");
    setDate(todayStr$1());
    setMode("manual");
  };
  const logAnother = () => {
    setDone(null);
    setMode("home");
    resetEntry();
  };
  const locationNote = locationStamp && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Your location is saved when you clock in and when you clock out. It is not followed during your shift." });
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-on-background font-body-md min-h-screen", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "pt-32 pb-24", children: /* @__PURE__ */ jsxs("section", { className: "max-w-xl mx-auto px-margin-mobile md:px-margin-desktop", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
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
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "pin",
                  className: `${input$1} tracking-[0.5em] pr-20`,
                  type: showPin ? "text" : "password",
                  inputMode: "numeric",
                  autoComplete: "off",
                  maxLength: 4,
                  value: pin,
                  onChange: (e) => setPin(e.target.value.replace(/\D/g, "")),
                  placeholder: "••••"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPin(!showPin),
                  "aria-pressed": showPin,
                  "aria-label": showPin ? "Hide PIN" : "Show PIN",
                  className: "absolute right-0 top-0 h-full px-4 text-on-surface-variant hover:text-primary text-xs uppercase tracking-widest font-label-bold",
                  children: showPin ? "Hide" : "Show"
                }
              )
            ] })
          ] }),
          err && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-error text-sm font-label-bold", children: err }),
          /* @__PURE__ */ jsx("button", { className: btn$1, disabled: !!busy, children: busy || "Continue" })
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
                fmtTime$1(openPunch.clockIn)
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-sm mt-1", children: openPunch.date === todayStr$1() ? "Today" : `Started ${openPunch.date}` })
            ] }),
            /* @__PURE__ */ jsx("button", { className: btn$1, disabled: !!busy, onClick: clockOutNow, children: "Clock Out Now" }),
            /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant text-xs underline", onClick: cancelPunch, disabled: !!busy, children: "Cancel clock-in" })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 border-2 border-surface-container-highest text-center space-y-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "Tap to start your shift. It stamps the time for you." }),
            /* @__PURE__ */ jsx("button", { className: btn$1, disabled: !!busy, onClick: clockInNow, children: busy || "Clock In Now" }),
            /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant text-sm underline", onClick: startManual, children: "Or log a past shift by hand" }),
            locationNote
          ] }),
          err && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-error text-sm font-label-bold text-center", children: err })
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
            /* @__PURE__ */ jsx("input", { id: "date", type: "date", className: input$1, value: date, max: todayStr$1(), onChange: (e) => setDate(e.target.value) })
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
            /* @__PURE__ */ jsxs("select", { id: "job", className: input$1, value: jobId, onChange: (e) => onJobChange(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select a job…" }),
              jobs.map((j) => /* @__PURE__ */ jsx("option", { value: j.id, children: j.name }, j.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label$1, htmlFor: "addr", children: "Job Address" }),
            /* @__PURE__ */ jsx("input", { id: "addr", className: input$1, value: address, onChange: (e) => setAddress(e.target.value), placeholder: "Auto-fills when you pick a job" }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs mt-1", children: "Picks up the saved address for the job. Edit it if you were somewhere else." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-surface-container p-4 border border-surface-container-highest", children: [
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-label-bold uppercase text-on-surface-variant tracking-widest", children: "Today's Total" }),
            /* @__PURE__ */ jsxs("span", { className: "font-display-lg text-2xl text-primary", children: [
              hours,
              " hrs · $",
              pay.toFixed(2)
            ] })
          ] }),
          locationNote,
          err && /* @__PURE__ */ jsx("p", { role: "alert", className: "text-error text-sm font-label-bold", children: err }),
          /* @__PURE__ */ jsx("button", { className: btn$1, disabled: !!busy, children: busy || "Submit Today's Hours" })
        ] })
      ),
      /* @__PURE__ */ jsx("p", { className: "text-center text-on-surface-variant/70 text-xs mt-6", children: "Private to Randolph Construction." })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const JOB_STATUS_LABEL = { active: "Active", future: "Future", finished: "Finished" };
const label = "font-label-bold text-label-bold uppercase text-primary tracking-[0.2em] block mb-2";
const input = "bg-surface-container border-b border-surface-container-highest p-3 text-on-surface focus:border-primary focus:outline-none transition-all w-full";
const btn = "bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-5 py-3 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95 disabled:opacity-50";
const btnGhost = "border border-surface-container-highest text-on-surface-variant font-label-bold text-label-bold uppercase px-4 py-2 hover:text-primary hover:border-primary transition-all disabled:opacity-50";
const textLink = "text-on-surface-variant hover:text-primary text-sm underline underline-offset-4 disabled:opacity-50";
const hairline = "border-surface-container-highest";
const errorText = "text-error text-sm font-label-bold";
const okText = "text-primary text-sm font-label-bold";
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
  if (!n) return "no lunch";
  if (n % 60 === 0) return `${n / 60} hr lunch`;
  if (n > 60) return `${Math.floor(n / 60)} hr ${n % 60} min lunch`;
  return `${n} min lunch`;
};
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const r2 = (n) => Math.round(n * 100) / 100;
const money = (n) => `$${(Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money0 = (n) => "$" + Math.round(n || 0).toLocaleString("en-US");
const hrs = (n) => (Number(n) || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
const utc = (iso) => /* @__PURE__ */ new Date(`${iso}T00:00:00Z`);
const fmtDay = (iso) => utc(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const fmtDate = (iso) => utc(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const fmtWeek = (iso) => utc(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fmtStamp = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const fmtTime = (t) => {
  if (!/^\d{2}:\d{2}$/.test(t || "")) return t || "";
  const [h, m] = t.split(":").map(Number);
  return `${(h + 11) % 12 + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const todayStr = () => {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function addDays(dateStr, n) {
  const d = utc(dateStr);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekStart(dateStr, startDay = 0) {
  const d = utc(dateStr);
  const off = (d.getUTCDay() - startDay + 7) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
}
const fmtPhone = (p) => {
  const d = (p || "").replace(/\D/g, "").replace(/^1/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : p;
};
const mapLink = (l) => `https://www.google.com/maps?q=${l.lat},${l.lng}`;
const LOC_NOTE = {
  denied: "location turned off on the phone",
  timeout: "no signal for location",
  unavailable: "location not available"
};
function computePayroll(entries, startDay = 0) {
  const groups = /* @__PURE__ */ new Map();
  for (const e of entries) {
    const key = `${e.employeeId || e.employeeName}|${weekStart(e.date, startDay)}`;
    const arr = groups.get(key) || [];
    arr.push(e);
    groups.set(key, arr);
  }
  const rows = [];
  for (const [key, list] of Array.from(groups.entries())) {
    const week = key.split("|")[1];
    const shifts = [...list].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
    let cum = 0, reg = 0, ot = 0, gross = 0;
    const lines = /* @__PURE__ */ new Map();
    const add = (kind, hours, rate) => {
      if (hours <= 0) return;
      const k = `${kind}|${rate}`;
      const cur = lines.get(k) || { kind, hours: 0, rate, amount: 0 };
      cur.hours += hours;
      cur.amount += hours * rate;
      lines.set(k, cur);
    };
    for (const e of shifts) {
      const h = e.hours || 0;
      const regPart = Math.min(h, Math.max(0, 40 - cum));
      const otPart = h - regPart;
      reg += regPart;
      ot += otPart;
      gross += regPart * e.rate + otPart * e.rate * 1.5;
      cum += h;
      add("Regular", regPart, e.rate);
      add("Overtime", otPart, r2(e.rate * 1.5));
    }
    rows.push({
      key,
      employee: shifts[0].employeeName,
      week,
      reg: r2(reg),
      ot: r2(ot),
      total: r2(reg + ot),
      gross: r2(gross),
      shifts,
      lines: Array.from(lines.values()).map((l) => ({ ...l, hours: r2(l.hours), amount: r2(l.amount) })).sort((a, b) => a.kind.localeCompare(b.kind) * -1 || a.rate - b.rate)
    });
  }
  rows.sort((a, b) => b.week.localeCompare(a.week) || a.employee.localeCompare(b.employee));
  return rows;
}
const entryIsForJob = (e, j) => e.jobId ? e.jobId === j.id : !!e.jobName && e.jobName === j.name;
function laborForJob(job, entries) {
  let hours = 0, pay = 0;
  for (const e of entries) {
    if (entryIsForJob(e, job)) {
      hours += e.hours || 0;
      pay += e.pay || 0;
    }
  }
  return { hours, pay };
}
const csvText = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
function downloadFile(name, content, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2e3);
}
function SectionHead({ title, note, children }) {
  return /* @__PURE__ */ jsxs("div", { className: `border-b ${hairline} pb-3 mb-4`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-x-4 gap-y-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-headline-md text-headline-md uppercase", children: title }),
      children && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-3", children })
    ] }),
    note && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm mt-1 max-w-2xl", children: note })
  ] });
}
function Counts({ items }) {
  return /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-lg leading-relaxed", children: items.map((it, i) => /* @__PURE__ */ jsxs("span", { children: [
    /* @__PURE__ */ jsx("strong", { className: `font-label-bold ${it.tone === "good" ? "text-[#5ec26a]" : it.tone === "bad" ? "text-error" : "text-on-surface"}`, children: it.n }),
    " ",
    it.label,
    i < items.length - 1 ? ", " : ""
  ] }, it.label)) });
}
function PasscodeField({ id, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        id,
        className: `${input} pr-20`,
        type: show ? "text" : "password",
        autoComplete: autoComplete || "off",
        autoCapitalize: "none",
        spellCheck: false,
        maxLength: 64,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setShow(!show),
        "aria-pressed": show,
        "aria-label": show ? "Hide passcode" : "Show passcode",
        className: "absolute right-0 top-0 h-full px-4 text-on-surface-variant hover:text-primary text-xs uppercase tracking-widest font-label-bold",
        children: show ? "Hide" : "Show"
      }
    )
  ] });
}
function Toggle({ id, checked, onChange, children, disabled }) {
  return /* @__PURE__ */ jsxs("label", { htmlFor: id, className: `flex items-start gap-3 ${disabled ? "opacity-60" : "cursor-pointer"}`, children: [
    /* @__PURE__ */ jsx("input", { id, type: "checkbox", className: "mt-1 h-5 w-5 shrink-0 accent-[#d32f2f]", checked, disabled, onChange: (e) => onChange(e.target.checked) }),
    /* @__PURE__ */ jsx("span", { className: "text-on-surface", children })
  ] });
}
const PAGE = 100;
function EntriesTab({ entries, jobs, lockedThrough, trashCount, showLocation, post: post2, onChange }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [emp, setEmp] = useState("");
  const [job, setJob] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [editing, setEditing] = useState(null);
  const [saveErr, setSaveErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [trash, setTrash] = useState(null);
  const [trashErr, setTrashErr] = useState("");
  const empNames = useMemo(() => Array.from(new Set(entries.map((e) => e.employeeName))).sort(), [entries]);
  const jobNames = useMemo(() => Array.from(new Set(entries.map((e) => e.jobName).filter(Boolean))).sort(), [entries]);
  const filtered = entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to) && (!emp || e.employeeName === emp) && (!job || e.jobName === job));
  const totalHrs = filtered.reduce((s, e) => s + e.hours, 0);
  const totalPay = filtered.reduce((s, e) => s + e.pay, 0);
  const byKey = (key) => {
    const m = /* @__PURE__ */ new Map();
    for (const e of filtered) {
      const k = e[key] || "(no job picked)";
      const cur = m.get(k) || { hours: 0, pay: 0 };
      m.set(k, { hours: cur.hours + e.hours, pay: cur.pay + e.pay });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].pay - a[1].pay);
  };
  const csv = () => {
    const head = ["Date", "Employee", "Job", "Address", "Clock In", "Clock Out", "Lunch (min)", "Hours", "Rate", "Pay"];
    const rows = filtered.map((e) => [e.date, e.employeeName, e.jobName, e.address, e.clockIn, e.clockOut, lunchToMins(e.lunch), e.hours, e.rate, e.pay]);
    downloadFile(`randolph-hours${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`, csvText([head, ...rows]));
  };
  const del = async (id) => {
    if (!confirm("Delete this shift? It stays in Deleted Shifts for 90 days in case you need it back.")) return;
    await post2({ action: "delete-entry", id });
    setTrash(null);
    onChange();
  };
  const saveEdit = async (ev) => {
    ev.preventDefault();
    setSaveErr("");
    if (!editing) return;
    setBusy(true);
    try {
      await post2({ action: "update-entry", id: editing.id, date: editing.date, clockIn: editing.clockIn, clockOut: editing.clockOut, lunch: lunchToMins(editing.lunch), jobId: editing.jobId || "", jobName: editing.jobName, address: editing.address });
      setEditing(null);
      await onChange();
    } catch (e2) {
      setSaveErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const openTrash = async () => {
    setTrashErr("");
    if (trash) return setTrash(null);
    try {
      setTrash((await post2({ action: "admin-trash" })).trash || []);
    } catch (e2) {
      setTrashErr(e2.message);
    }
  };
  const restore = async (id) => {
    setTrashErr("");
    try {
      await post2({ action: "restore-entry", id });
      setTrash((await post2({ action: "admin-trash" })).trash || []);
      onChange();
    } catch (e2) {
      setTrashErr(e2.message);
    }
  };
  const editingJobValue = editing ? editing.jobId || (editing.jobName ? `name:${editing.jobName}` : "") : "";
  const pickJob = (v) => {
    if (!editing) return;
    const j = jobs.find((x) => x.id === v);
    if (j) setEditing({ ...editing, jobId: j.id, jobName: j.name, address: j.address || editing.address });
    else if (!v) setEditing({ ...editing, jobId: "", jobName: "" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4", onClick: () => setEditing(null), children: /* @__PURE__ */ jsxs(
      "form",
      {
        onClick: (ev) => ev.stopPropagation(),
        onSubmit: saveEdit,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": `Edit shift for ${editing.employeeName}`,
        className: "bg-surface-container-lowest border-2 border-primary p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto",
        children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-headline-md text-headline-md uppercase", children: [
            "Edit Shift: ",
            editing.employeeName
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-date", children: "Date" }),
            /* @__PURE__ */ jsx("input", { id: "ed-date", type: "date", className: input, value: editing.date, onChange: (ev) => setEditing({ ...editing, date: ev.target.value }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-in", children: "Clock In" }),
              /* @__PURE__ */ jsx("input", { id: "ed-in", type: "time", className: input, value: editing.clockIn, onChange: (ev) => setEditing({ ...editing, clockIn: ev.target.value }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-out", children: "Clock Out" }),
              /* @__PURE__ */ jsx("input", { id: "ed-out", type: "time", className: input, value: editing.clockOut, onChange: (ev) => setEditing({ ...editing, clockOut: ev.target.value }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-lunch", children: "Lunch Break" }),
            /* @__PURE__ */ jsxs("select", { id: "ed-lunch", className: input, value: lunchToMins(editing.lunch), onChange: (ev) => setEditing({ ...editing, lunch: Number(ev.target.value) }), children: [
              LUNCH_OPTIONS.map((o) => /* @__PURE__ */ jsx("option", { value: o.v, children: o.label }, o.v)),
              !LUNCH_OPTIONS.some((o) => o.v === lunchToMins(editing.lunch)) && /* @__PURE__ */ jsx("option", { value: lunchToMins(editing.lunch), children: lunchLabel(editing.lunch) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-job", children: "Job" }),
            /* @__PURE__ */ jsxs("select", { id: "ed-job", className: input, value: editingJobValue, onChange: (ev) => pickJob(ev.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "No job picked" }),
              jobs.map((j) => /* @__PURE__ */ jsx("option", { value: j.id, children: j.name }, j.id)),
              editingJobValue.startsWith("name:") && /* @__PURE__ */ jsxs("option", { value: editingJobValue, children: [
                editing.jobName,
                " (old name)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "ed-addr", children: "Address" }),
            /* @__PURE__ */ jsx("input", { id: "ed-addr", className: input, value: editing.address, onChange: (ev) => setEditing({ ...editing, address: ev.target.value }) })
          ] }),
          saveErr && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: saveErr }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("button", { className: btn, disabled: busy, children: busy ? "Saving…" : "Save" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: () => setEditing(null), children: "Cancel" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "Hours and pay recalculate when you save, at the rate this shift was logged at." }),
          !!editing.history?.length && /* @__PURE__ */ jsxs("div", { className: `border-t ${hairline} pt-3`, children: [
            /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-xs uppercase tracking-widest font-label-bold mb-2", children: "Earlier versions" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-on-surface-variant text-xs", children: editing.history.map((h, i) => /* @__PURE__ */ jsxs("li", { children: [
              "Until ",
              fmtStamp(h.at),
              ": ",
              fmtDay(h.before.date),
              ", ",
              fmtTime(h.before.clockIn),
              " to ",
              fmtTime(h.before.clockOut),
              ", ",
              hrs(h.before.hours),
              " hrs at ",
              money(h.before.rate),
              ", ",
              money(h.before.pay),
              h.what === "rate" ? " (changed by a raise)" : ""
            ] }, i)) })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "f-from", children: "From" }),
        /* @__PURE__ */ jsx("input", { id: "f-from", type: "date", className: input, value: from, onChange: (e) => {
          setFrom(e.target.value);
          setShown(PAGE);
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "f-to", children: "To" }),
        /* @__PURE__ */ jsx("input", { id: "f-to", type: "date", className: input, value: to, onChange: (e) => {
          setTo(e.target.value);
          setShown(PAGE);
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "f-emp", children: "Employee" }),
        /* @__PURE__ */ jsxs("select", { id: "f-emp", className: input, value: emp, onChange: (e) => {
          setEmp(e.target.value);
          setShown(PAGE);
        }, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
          empNames.map((n) => /* @__PURE__ */ jsx("option", { children: n }, n))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "f-job", children: "Job" }),
        /* @__PURE__ */ jsxs("select", { id: "f-job", className: input, value: job, onChange: (e) => {
          setJob(e.target.value);
          setShown(PAGE);
        }, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "All" }),
          jobNames.map((n) => /* @__PURE__ */ jsx("option", { children: n }, n))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Counts, { items: [
      { n: filtered.length.toLocaleString("en-US"), label: filtered.length === 1 ? "shift" : "shifts" },
      { n: hrs(totalHrs), label: "hours" },
      { n: money(totalPay), label: "in pay before overtime" }
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-x-10 gap-y-8", children: [
      /* @__PURE__ */ jsx(RollUp, { title: "By Employee", rows: byKey("employeeName") }),
      /* @__PURE__ */ jsx(RollUp, { title: "By Job", rows: byKey("jobName") })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Shifts", children: /* @__PURE__ */ jsx("button", { className: btn, onClick: csv, disabled: !filtered.length, children: "Export CSV" }) }),
      filtered.length === 0 && /* @__PURE__ */ jsx("p", { className: "py-6 text-on-surface-variant", children: "No shifts match." }),
      /* @__PURE__ */ jsx("ul", { children: filtered.slice(0, shown).map((e) => {
        const isLocked = !!lockedThrough && e.date <= lockedThrough;
        return /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`, children: [
          /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0 text-on-surface-variant", children: fmtDay(e.date) }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold min-w-[9rem] flex-1", children: e.employeeName }),
          /* @__PURE__ */ jsx("span", { className: "basis-full md:basis-0 md:flex-[2] min-w-0 text-on-surface-variant break-words", children: e.jobName || "No job picked" }),
          /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant text-sm md:w-[17rem] md:text-right", children: [
            fmtTime(e.clockIn),
            " to ",
            fmtTime(e.clockOut),
            ", ",
            lunchLabel(e.lunch)
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-label-bold md:w-16 md:text-right", children: [
            hrs(e.hours),
            " hrs"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-primary md:w-24 md:text-right", children: money(e.pay) }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto flex items-baseline justify-end gap-4 md:w-28", children: isLocked ? /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant/70 text-xs uppercase tracking-wider", children: "Locked" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setSaveErr("");
              setEditing(e);
            }, className: textLink, children: "Edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => del(e.id), className: "text-on-surface-variant hover:text-error text-sm underline underline-offset-4", children: "Delete" })
          ] }) }),
          (showLocation || e.locIn || e.locOut) && (e.locIn || e.locOut || e.locInNote || e.locOutNote) && /* @__PURE__ */ jsxs("span", { className: "basis-full text-on-surface-variant/80 text-xs", children: [
            "Clocked in: ",
            e.locIn ? /* @__PURE__ */ jsx("a", { className: "underline underline-offset-2 hover:text-primary", href: mapLink(e.locIn), target: "_blank", rel: "noreferrer", children: "see on map" }) : e.source === "manual" ? "logged by hand" : LOC_NOTE[e.locInNote || ""] || "no location",
            " · ",
            "Clocked out: ",
            e.locOut ? /* @__PURE__ */ jsx("a", { className: "underline underline-offset-2 hover:text-primary", href: mapLink(e.locOut), target: "_blank", rel: "noreferrer", children: "see on map" }) : LOC_NOTE[e.locOutNote || ""] || "no location"
          ] }),
          !!e.history?.length && /* @__PURE__ */ jsxs("span", { className: "basis-full text-on-surface-variant/70 text-xs", children: [
            "Changed ",
            fmtStamp(e.history[0].at),
            ". Open Edit to see what it was before."
          ] })
        ] }, e.id);
      }) }),
      filtered.length > shown && /* @__PURE__ */ jsx("div", { className: "pt-5", children: /* @__PURE__ */ jsxs("button", { className: btnGhost, onClick: () => setShown(shown + PAGE), children: [
        "Show ",
        Math.min(PAGE, filtered.length - shown),
        " more"
      ] }) }),
      trashCount > 0 && /* @__PURE__ */ jsxs("div", { className: "pt-8", children: [
        /* @__PURE__ */ jsx("button", { className: textLink, onClick: openTrash, "aria-expanded": !!trash, children: trash ? "Hide deleted shifts" : `Deleted shifts (${trashCount})` }),
        trashErr && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mt-2`, children: trashErr }),
        trash && /* @__PURE__ */ jsx("ul", { className: "mt-3", children: trash.map((e) => /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1 text-on-surface-variant`, children: [
          /* @__PURE__ */ jsx("span", { className: "w-28 shrink-0", children: fmtDay(e.date) }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-on-surface min-w-[9rem] flex-1", children: e.employeeName }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
            fmtTime(e.clockIn),
            " to ",
            fmtTime(e.clockOut),
            ", ",
            hrs(e.hours),
            " hrs, ",
            money(e.pay)
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs", children: [
            "deleted ",
            e.deletedAt ? fmtStamp(e.deletedAt) : ""
          ] }),
          /* @__PURE__ */ jsx("button", { className: `${textLink} ml-auto`, onClick: () => restore(e.id), children: "Put back" })
        ] }, e.id)) })
      ] })
    ] })
  ] });
}
function RollUp({ title, rows }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(SectionHead, { title }),
    rows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm", children: "Nothing logged in this range." }) : /* @__PURE__ */ jsx("ul", { children: rows.map(([k, v]) => /* @__PURE__ */ jsxs("li", { className: `flex flex-wrap justify-between items-baseline gap-x-4 py-2 border-b ${hairline}`, children: [
      /* @__PURE__ */ jsx("span", { className: "min-w-0 break-words", children: k }),
      /* @__PURE__ */ jsxs("span", { className: "whitespace-nowrap", children: [
        /* @__PURE__ */ jsxs("strong", { className: "text-on-surface", children: [
          hrs(v.hours),
          " hrs"
        ] }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-primary font-label-bold", children: money(v.pay) })
      ] })
    ] }, k)) })
  ] });
}
function PayStubs({ rows, onClose }) {
  useEffect(() => {
    document.body.classList.add("printing-stubs");
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("printing-stubs");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: "stub-sheet fixed inset-0 z-[200] bg-white text-black overflow-y-auto", role: "dialog", "aria-modal": "true", "aria-label": "Pay stubs", children: [
      /* @__PURE__ */ jsxs("div", { className: "stub-toolbar sticky top-0 bg-white border-b border-neutral-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-neutral-700", children: [
          rows.length,
          " pay stub",
          rows.length === 1 ? "" : "s",
          '. Choose "Save as PDF" in the print window to keep a copy.'
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => window.print(), className: "bg-black text-white font-bold uppercase text-sm px-5 py-2.5", children: "Print" }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "border border-neutral-400 text-neutral-800 font-bold uppercase text-sm px-5 py-2.5", children: "Close" })
        ] })
      ] }),
      rows.map((r) => /* @__PURE__ */ jsx(Stub, { row: r }, r.key))
    ] }),
    document.body
  );
}
function Stub({ row }) {
  const cell = "py-1.5 pr-3 align-top";
  return /* @__PURE__ */ jsxs("article", { className: "stub-page max-w-3xl mx-auto px-6 py-10 text-[14px] leading-snug", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-wrap justify-between gap-4 border-b-2 border-black pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold uppercase tracking-wide", children: BUSINESS.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-neutral-700", children: [
          BUSINESS.address.locality,
          ", ",
          BUSINESS.address.regionFull,
          " · ",
          BUSINESS.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold uppercase tracking-wide", children: "Earnings Statement" }),
        /* @__PURE__ */ jsxs("div", { className: "text-neutral-700", children: [
          "Pay period ",
          fmtDate(row.week),
          " to ",
          fmtDate(addDays(row.week, 6))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between gap-4 py-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-neutral-600 text-xs uppercase tracking-wide", children: "Employee" }),
        /* @__PURE__ */ jsx("div", { className: "text-lg font-bold", children: row.employee })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("div", { className: "text-neutral-600 text-xs uppercase tracking-wide", children: "Gross pay" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold", children: money(row.gross) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "font-bold uppercase text-xs tracking-wide border-b border-neutral-400 pb-1 mb-1", children: "Earnings" }),
    /* @__PURE__ */ jsxs("table", { className: "w-full mb-6", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-neutral-600 text-xs uppercase", children: [
        /* @__PURE__ */ jsx("th", { className: cell, children: "Type" }),
        /* @__PURE__ */ jsx("th", { className: `${cell} text-right`, children: "Hours" }),
        /* @__PURE__ */ jsx("th", { className: `${cell} text-right`, children: "Rate" }),
        /* @__PURE__ */ jsx("th", { className: "py-1.5 text-right", children: "Amount" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        row.lines.map((l) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-neutral-200", children: [
          /* @__PURE__ */ jsxs("td", { className: cell, children: [
            l.kind,
            l.kind === "Overtime" ? " (1.5 times the hourly rate)" : ""
          ] }),
          /* @__PURE__ */ jsx("td", { className: `${cell} text-right`, children: hrs(l.hours) }),
          /* @__PURE__ */ jsx("td", { className: `${cell} text-right`, children: money(l.rate) }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 text-right", children: money(l.amount) })
        ] }, `${l.kind}${l.rate}`)),
        /* @__PURE__ */ jsxs("tr", { className: "border-t-2 border-black font-bold", children: [
          /* @__PURE__ */ jsx("td", { className: cell, children: "Total" }),
          /* @__PURE__ */ jsx("td", { className: `${cell} text-right`, children: hrs(row.total) }),
          /* @__PURE__ */ jsx("td", { className: cell }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 text-right", children: money(row.gross) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "font-bold uppercase text-xs tracking-wide border-b border-neutral-400 pb-1 mb-1", children: "Shifts" }),
    /* @__PURE__ */ jsxs("table", { className: "w-full mb-6", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-neutral-600 text-xs uppercase", children: [
        /* @__PURE__ */ jsx("th", { className: cell, children: "Day" }),
        /* @__PURE__ */ jsx("th", { className: cell, children: "In" }),
        /* @__PURE__ */ jsx("th", { className: cell, children: "Out" }),
        /* @__PURE__ */ jsx("th", { className: cell, children: "Lunch" }),
        /* @__PURE__ */ jsx("th", { className: "py-1.5 text-right", children: "Hours" })
      ] }) }),
      row.shifts.map((e) => /* @__PURE__ */ jsxs("tbody", { className: "border-t border-neutral-200", children: [
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: `${cell} whitespace-nowrap`, children: fmtDay(e.date) }),
          /* @__PURE__ */ jsx("td", { className: `${cell} whitespace-nowrap`, children: fmtTime(e.clockIn) }),
          /* @__PURE__ */ jsx("td", { className: `${cell} whitespace-nowrap`, children: fmtTime(e.clockOut) }),
          /* @__PURE__ */ jsx("td", { className: `${cell} whitespace-nowrap`, children: lunchToMins(e.lunch) ? `${lunchToMins(e.lunch)} min` : "None" }),
          /* @__PURE__ */ jsx("td", { className: "py-1.5 text-right", children: hrs(e.hours) })
        ] }),
        e.jobName && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "pb-1.5 text-neutral-600 text-xs break-words", children: e.jobName }) })
      ] }, e.id))
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-neutral-700 text-xs", children: "Gross pay is the amount earned before taxes and other withholdings. Overtime is paid on hours past 40 in the workweek." })
  ] });
}
const usDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${y}`;
};
const usDatePadded = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};
const customerFor = (e, jobs) => {
  const j = jobs.find((x) => e.jobId ? x.id === e.jobId : x.name === e.jobName);
  return (j?.customer || e.jobName || "").trim();
};
const noteFor = (e, jobs) => {
  const j = jobs.find((x) => e.jobId ? x.id === e.jobId : x.name === e.jobName);
  return [j?.workType, e.address].filter(Boolean).join(", ");
};
const byDate = (list) => [...list].sort((a, b) => (a.date + a.employeeName + (a.createdAt || "")).localeCompare(b.date + b.employeeName + (b.createdAt || "")));
function qboCsv(entries, jobs, qb) {
  const head = ["TXNDATE", "NAME", "TIME", "DESCRIPTION", "BILLABLESTATUS", "CUSTOMER", "SERVICEITEM"];
  const rows = byDate(entries).filter((e) => e.hours > 0).map((e) => [usDatePadded(e.date), e.employeeName, r2(e.hours), noteFor(e, jobs), "NotBillable", customerFor(e, jobs), qb.serviceItem]);
  return csvText([head, ...rows]);
}
const tab = (v) => String(v ?? "").replace(/[\t\r\n]+/g, " ").trim();
const duration = (hours) => {
  const mins = Math.round(hours * 60);
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;
};
function desktopIif(entries, jobs, qb, startDay) {
  const lines = [];
  if (qb.companyName.trim() && qb.companyCreateTime.trim()) {
    lines.push(["!TIMERHDR", "VER", "REL", "COMPANYNAME", "IMPORTEDBEFORE", "FROMTIMER", "COMPANYCREATETIME"].join("	"));
    lines.push(["TIMERHDR", "8", "0", tab(qb.companyName), "N", "Y", tab(qb.companyCreateTime)].join("	"));
  }
  lines.push(["!TIMEACT", "DATE", "JOB", "EMP", "ITEM", "PITEM", "DURATION", "PROJ", "NOTE", "XFERTOPAYROLL", "BILLINGSTATUS"].join("	"));
  const soFar = /* @__PURE__ */ new Map();
  const chrono = [...entries].sort((a, b) => (a.date + (a.createdAt || "")).localeCompare(b.date + (b.createdAt || "")));
  const out = [];
  for (const e of chrono) {
    const key = `${e.employeeId || e.employeeName}|${weekStart(e.date, startDay)}`;
    const cum = soFar.get(key) || 0;
    const reg = Math.min(e.hours, Math.max(0, 40 - cum));
    const ot = r2(e.hours - reg);
    soFar.set(key, cum + e.hours);
    if (reg > 0) out.push({ e, hours: reg, item: qb.payrollItem });
    if (ot > 0) out.push({ e, hours: ot, item: qb.otPayrollItem || qb.payrollItem });
  }
  out.sort((a, b) => (a.e.date + a.e.employeeName).localeCompare(b.e.date + b.e.employeeName));
  for (const { e, hours, item } of out) {
    lines.push(["TIMEACT", usDate(e.date), tab(customerFor(e, jobs)), tab(e.employeeName), tab(qb.serviceItem), tab(item), duration(hours), "", tab(noteFor(e, jobs)), "Y", "0"].join("	"));
  }
  return lines.join("\r\n") + "\r\n";
}
function PayrollTab({ entries, jobs, settings, post: post2, onChange }) {
  const { weekStartDay, lockedThrough } = settings;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [lockDate, setLockDate] = useState(lockedThrough || "");
  const [lockErr, setLockErr] = useState("");
  const [stubs, setStubs] = useState(null);
  const saveLock = async (clear = false) => {
    setLockErr("");
    try {
      await post2({ action: "set-lock", lockedThrough: clear ? "" : lockDate });
      await onChange();
    } catch (e) {
      setLockErr(e.message);
    }
  };
  const filtered = useMemo(() => entries.filter((e) => (!from || e.date >= from) && (!to || e.date <= to)), [entries, from, to]);
  const rows = useMemo(() => computePayroll(filtered, weekStartDay), [filtered, weekStartDay]);
  const weeks = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const list = m.get(r.week) || [];
      list.push(r);
      m.set(r.week, list);
    }
    return Array.from(m.entries());
  }, [rows]);
  const grossTotal = rows.reduce((s, r) => s + r.gross, 0);
  const otTotal = rows.reduce((s, r) => s + r.ot, 0);
  const hoursTotal = rows.reduce((s, r) => s + r.total, 0);
  const csv = () => {
    const head = ["Week of", "Employee", "Regular Hrs", "Overtime Hrs", "Total Hrs", "Gross Pay"];
    downloadFile(`randolph-payroll${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}.csv`, csvText([head, ...rows.map((r) => [r.week, r.employee, r.reg, r.ot, r.total, r.gross.toFixed(2)])]));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    stubs && /* @__PURE__ */ jsx(PayStubs, { rows: stubs, onClose: () => setStubs(null) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Lock Payroll", note: "Once you've paid a period, lock it so nobody can add or change times on or before that date." }),
      lockedThrough ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-primary uppercase tracking-widest text-sm", children: [
          "Locked through ",
          fmtDate(lockedThrough)
        ] }),
        /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => saveLock(true), children: "Unlock" })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "lock-date", children: "Lock Through" }),
          /* @__PURE__ */ jsx("input", { id: "lock-date", type: "date", className: input, value: lockDate, onChange: (e) => setLockDate(e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("button", { className: btn, disabled: !lockDate, onClick: () => saveLock(), children: "Lock" })
      ] }),
      lockErr && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mt-3`, children: lockErr })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Weekly Payroll", children: /* @__PURE__ */ jsx("button", { className: btn, onClick: csv, disabled: !rows.length, children: "Export Payroll CSV" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 max-w-md mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "p-from", children: "From" }),
          /* @__PURE__ */ jsx("input", { id: "p-from", type: "date", className: input, value: from, onChange: (e) => setFrom(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "p-to", children: "To" }),
          /* @__PURE__ */ jsx("input", { id: "p-to", type: "date", className: input, value: to, onChange: (e) => setTo(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Counts, { items: [
        { n: money(grossTotal), label: "gross pay" },
        { n: hrs(hoursTotal), label: "hours" },
        { n: hrs(otTotal), label: "of them overtime" }
      ] }),
      rows.length === 0 && /* @__PURE__ */ jsx("p", { className: "py-6 text-on-surface-variant", children: "No hours logged in this range." }),
      weeks.map(([week, list]) => /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap items-baseline justify-between gap-3 border-b ${hairline} pb-2`, children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-label-bold text-label-bold uppercase tracking-widest text-on-surface-variant", children: [
            "Week of ",
            fmtWeek(week),
            " to ",
            fmtWeek(addDays(week, 6))
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-baseline gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-label-bold text-primary", children: money(list.reduce((s, r) => s + r.gross, 0)) }),
            /* @__PURE__ */ jsx("button", { className: textLink, onClick: () => setStubs(list), children: "Print pay stubs" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("ul", { children: list.map((r) => /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`, children: [
          /* @__PURE__ */ jsx("span", { className: "font-label-bold min-w-[9rem] flex-1", children: r.employee }),
          /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant", children: [
            hrs(r.reg),
            " regular"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: r.ot > 0 ? "text-primary font-label-bold" : "text-on-surface-variant", children: [
            hrs(r.ot),
            " overtime"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-label-bold", children: [
            hrs(r.total),
            " hrs"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-label-bold text-primary", children: money(r.gross) }),
          /* @__PURE__ */ jsx("button", { className: `${textLink} ml-auto`, onClick: () => setStubs([r]), children: "Pay stub" })
        ] }, r.key)) })
      ] }, week)),
      /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant/80 text-xs mt-6", children: [
        "Overtime is calculated at 1.5× the hourly rate for hours over 40 in a workweek (starts ",
        DAYS[weekStartDay],
        "). Gross pay shown is before taxes and withholdings. Change the workweek under Settings."
      ] })
    ] }),
    /* @__PURE__ */ jsx(QuickBooksExport, { entries: filtered, jobs, settings, from, to, post: post2, onChange })
  ] });
}
function QuickBooksExport({ entries, jobs, settings, from, to, post: post2, onChange }) {
  const [kind, setKind] = useState("online");
  const [qb, setQb] = useState(settings.quickbooks);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k, v) => setQb({ ...qb, [k]: v });
  const noJob = entries.filter((e) => !e.jobName).length;
  const range = `${from ? `-${from}` : ""}${to ? `-to-${to}` : ""}`;
  const download = async () => {
    setErr("");
    setMsg("");
    if (kind === "desktop" && !qb.payrollItem.trim()) return setErr("Enter the payroll item name from QuickBooks first.");
    try {
      await post2({ action: "save-settings", quickbooks: qb });
      onChange();
    } catch (e) {
      return setErr(e.message);
    }
    if (kind === "online") downloadFile(`randolph-time-quickbooks-online${range}.csv`, qboCsv(entries, jobs, qb));
    else downloadFile(`randolph-time-quickbooks-desktop${range}.iif`, desktopIif(entries, jobs, qb, settings.weekStartDay), "text/plain");
    setMsg(`Downloaded ${entries.length} shift${entries.length === 1 ? "" : "s"}.`);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(SectionHead, { title: "Send Hours to QuickBooks", note: "Downloads the shifts in the date range above as a file QuickBooks can read, so nobody retypes hours. Names have to match QuickBooks exactly: the employee, the customer, and the items below." }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-x-10 gap-y-5 max-w-3xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 max-w-sm", children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-kind", children: "Which QuickBooks" }),
        /* @__PURE__ */ jsxs("select", { id: "qb-kind", className: input, value: kind, onChange: (e) => setKind(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "online", children: "QuickBooks Online" }),
          /* @__PURE__ */ jsx("option", { value: "desktop", children: "QuickBooks Desktop" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-service", children: "Service item" }),
        /* @__PURE__ */ jsx("input", { id: "qb-service", className: input, value: qb.serviceItem, onChange: (e) => set("serviceItem", e.target.value), placeholder: "As named in QuickBooks" })
      ] }),
      kind === "desktop" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-pay", children: "Payroll item for regular hours" }),
          /* @__PURE__ */ jsx("input", { id: "qb-pay", className: input, value: qb.payrollItem, onChange: (e) => set("payrollItem", e.target.value), placeholder: "As named in QuickBooks" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-ot", children: "Payroll item for overtime" }),
          /* @__PURE__ */ jsx("input", { id: "qb-ot", className: input, value: qb.otPayrollItem, onChange: (e) => set("otPayrollItem", e.target.value), placeholder: "As named in QuickBooks" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-co", children: "Company name (2021 and older only)" }),
          /* @__PURE__ */ jsx("input", { id: "qb-co", className: input, value: qb.companyName, onChange: (e) => set("companyName", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: label, htmlFor: "qb-cct", children: "Company create time (2021 and older only)" }),
          /* @__PURE__ */ jsx("input", { id: "qb-cct", className: input, inputMode: "numeric", value: qb.companyCreateTime, onChange: (e) => set("companyCreateTime", e.target.value.replace(/\D/g, "")) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-on-surface-variant text-sm mt-5 max-w-3xl space-y-2", children: [
      kind === "online" ? /* @__PURE__ */ jsx("p", { children: "QuickBooks Online cannot import hours by itself. This file loads through an importer app, Transaction Pro or SaasAnt Transactions, and is laid out in their column order." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { children: "In QuickBooks 2022 and newer, import it under File, Utilities, Import, IIF Files, and leave the two company fields blank." }),
        /* @__PURE__ */ jsx("p", { children: "In 2021 and older, import it under File, Utilities, Import, Timer Activities. That version needs both company fields. To find them, export Timer Lists from QuickBooks, open that file, and copy the company name and the number at the end of the TIMERHDR line." })
      ] }),
      noJob > 0 && /* @__PURE__ */ jsxs("p", { children: [
        noJob,
        " shift",
        noJob === 1 ? " has" : "s have",
        " no job picked, so the customer will be blank. Set the job under Entries first, or QuickBooks will reject those lines."
      ] })
    ] }),
    err && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mt-4`, children: err }),
    msg && /* @__PURE__ */ jsx("p", { role: "status", className: `${okText} mt-4`, children: msg }),
    /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx("button", { className: btn, onClick: download, disabled: !entries.length, children: "Download for QuickBooks" }) })
  ] });
}
const matTotalOf = (j) => (j.materials || []).reduce((s, m) => s + (m.amount || 0), 0);
function ProjectsTab({ jobs, entries, post: post2, onChange }) {
  const totals = useMemo(() => {
    let revenue = 0, cost = 0, count = 0;
    for (const j of jobs) {
      const value = j.contractValue || 0;
      if (value <= 0) continue;
      revenue += value;
      cost += laborForJob(j, entries).pay + matTotalOf(j);
      count++;
    }
    const profit = revenue - cost;
    return { revenue, cost, profit, margin: revenue > 0 ? profit / revenue * 100 : 0, count };
  }, [jobs, entries]);
  const sorted = useMemo(() => [...jobs].sort((a, b) => (b.contractValue || 0) - (a.contractValue || 0)), [jobs]);
  const byType = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const j of jobs) {
      const value = j.contractValue || 0;
      if (value <= 0) continue;
      const type = (j.workType || "Other").trim() || "Other";
      const c = m.get(type) || { count: 0, revenue: 0, cost: 0 };
      c.count++;
      c.revenue += value;
      c.cost += laborForJob(j, entries).pay + matTotalOf(j);
      m.set(type, c);
    }
    return Array.from(m.entries()).map(([type, d]) => ({ type, count: d.count, revenue: d.revenue, profit: d.revenue - d.cost, margin: d.revenue > 0 ? (d.revenue - d.cost) / d.revenue * 100 : 0 })).sort((a, b) => b.margin - a.margin);
  }, [jobs, entries]);
  const csv = () => {
    const head = ["Project", "Status", "Contract Value", "Labor Hours", "Labor $", "Materials $", "Total Cost", "Profit", "Margin %"];
    const rows = jobs.filter((j) => (j.contractValue || 0) > 0).map((j) => {
      const l = laborForJob(j, entries);
      const mat = matTotalOf(j);
      const cost = l.pay + mat;
      const value = j.contractValue || 0;
      const profit = value - cost;
      return [j.name, j.status || "active", value, l.hours.toFixed(2), Math.round(l.pay), Math.round(mat), Math.round(cost), Math.round(profit), (value > 0 ? profit / value * 100 : 0).toFixed(1)];
    });
    downloadFile("randolph-projects-pnl.csv", csvText([head, ...rows]));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm max-w-2xl", children: "Your money side, private to you. Add the contract value and materials for a job and the labor pulls straight from the time clock. Profit and margin add up automatically, and every job stays on file so you can look back years later." }),
      /* @__PURE__ */ jsx(Counts, { items: [
        { n: money0(totals.revenue), label: `revenue across ${totals.count} priced job${totals.count === 1 ? "" : "s"}` },
        { n: money0(totals.cost), label: "cost" },
        { n: money0(totals.profit), label: "profit", tone: totals.profit >= 0 ? "good" : "bad" },
        { n: `${totals.margin.toFixed(0)}%`, label: "average margin" }
      ] })
    ] }),
    byType.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Profit by Type of Work", note: "Across all priced jobs. Shows which kind of work actually makes you money, so you know what to chase." }),
      /* @__PURE__ */ jsx("ul", { children: byType.map((r) => /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-baseline gap-x-5 gap-y-1`, children: [
        /* @__PURE__ */ jsx("span", { className: "font-label-bold min-w-[9rem] flex-1 break-words", children: r.type }),
        /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant", children: [
          r.count,
          " job",
          r.count === 1 ? "" : "s"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant", children: [
          money0(r.revenue),
          " revenue"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: `font-label-bold ${r.profit >= 0 ? "text-[#5ec26a]" : "text-error"}`, children: [
          money0(r.profit),
          " profit"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "font-label-bold text-primary", children: [
          r.margin.toFixed(0),
          "% margin"
        ] })
      ] }, r.type)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Jobs", children: /* @__PURE__ */ jsx("button", { className: btn, onClick: csv, disabled: totals.count === 0, children: "Export P&L CSV" }) }),
      jobs.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "No jobs yet. Add one under the Jobs tab first." }),
      /* @__PURE__ */ jsx("div", { className: "space-y-10", children: sorted.map((j) => /* @__PURE__ */ jsx(ProjectCard, { job: j, labor: laborForJob(j, entries), post: post2, onChange }, j.id)) })
    ] })
  ] });
}
function ProjectCard({ job, labor, post: post2, onChange }) {
  const [value, setValue] = useState(job.contractValue ? String(job.contractValue) : "");
  const [materials, setMaterials] = useState(job.materials?.length ? job.materials.map((m) => ({ ...m })) : []);
  const [estH, setEstH] = useState(job.estHours ? String(job.estHours) : "");
  const [estL, setEstL] = useState(job.estLabor ? String(job.estLabor) : "");
  const [estM, setEstM] = useState(job.estMaterials ? String(job.estMaterials) : "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const matTotal = materials.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const v = Number(value) || 0;
  const cost = labor.pay + matTotal;
  const profit = v - cost;
  const margin = v > 0 ? profit / v * 100 : 0;
  const eH = Number(estH) || 0, eL = Number(estL) || 0, eM = Number(estM) || 0;
  const estCost = eL + eM;
  const estMargin = v > 0 ? (v - estCost) / v * 100 : 0;
  const hasBid = eH > 0 || eL > 0 || eM > 0;
  const addLine = () => setMaterials([...materials, { desc: "", amount: 0 }]);
  const setLine = (i, patch) => setMaterials(materials.map((m, idx) => idx === i ? { ...m, ...patch } : m));
  const rmLine = (i) => setMaterials(materials.filter((_, idx) => idx !== i));
  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      await post2({ action: "save-job", job: { id: job.id, contractValue: v, materials: materials.map((m) => ({ desc: m.desc, amount: Number(m.amount) || 0 })), estHours: eH, estLabor: eL, estMaterials: eM } });
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      await onChange();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  const status = job.status || "active";
  const mInput = `bg-surface-container border-b ${hairline} p-2 text-on-surface focus:border-primary focus:outline-none w-full min-w-0`;
  const line = `flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 border-b ${hairline}`;
  const pid = `p-${job.id}`;
  const over = (n) => n > 0 ? "text-error" : "text-[#5ec26a]";
  return /* @__PURE__ */ jsxs("section", { "aria-label": job.name, children: [
    /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap items-baseline justify-between gap-3 pb-2 border-b-2 ${hairline}`, children: [
      /* @__PURE__ */ jsxs("h4", { className: "font-headline-md text-headline-md uppercase break-words min-w-0", children: [
        job.customer || job.name,
        job.workType ? `, ${job.workType}` : ""
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-label-bold uppercase tracking-widest text-on-surface-variant", children: JOB_STATUS_LABEL[status] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: line, children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: `${pid}-value`, className: "text-on-surface", children: [
        "Contract value ",
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant text-xs", children: "(approved estimate)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 w-40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "$" }),
        /* @__PURE__ */ jsx("input", { id: `${pid}-value`, className: mInput, inputMode: "decimal", value, onChange: (e) => setValue(e.target.value.replace(/[^0-9.]/g, "")), placeholder: "0" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `py-3 border-b ${hairline}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "text-on-surface mb-2", children: [
        "Your bid ",
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant text-xs", children: "(what you estimated, optional)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${pid}-eh`, className: "block text-on-surface-variant text-xs mb-1", children: "Est. hours" }),
          /* @__PURE__ */ jsx("input", { id: `${pid}-eh`, className: mInput, inputMode: "decimal", value: estH, onChange: (e) => setEstH(e.target.value.replace(/[^0-9.]/g, "")), placeholder: "0" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${pid}-el`, className: "block text-on-surface-variant text-xs mb-1", children: "Est. labor $" }),
          /* @__PURE__ */ jsx("input", { id: `${pid}-el`, className: mInput, inputMode: "decimal", value: estL, onChange: (e) => setEstL(e.target.value.replace(/[^0-9.]/g, "")), placeholder: "0" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: `${pid}-em`, className: "block text-on-surface-variant text-xs mb-1", children: "Est. materials $" }),
          /* @__PURE__ */ jsx("input", { id: `${pid}-em`, className: mInput, inputMode: "decimal", value: estM, onChange: (e) => setEstM(e.target.value.replace(/[^0-9.]/g, "")), placeholder: "0" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: line, children: [
      /* @__PURE__ */ jsxs("span", { className: "text-on-surface", children: [
        "Labor ",
        /* @__PURE__ */ jsxs("span", { className: "text-primary text-xs", children: [
          labor.hours.toFixed(1),
          " hrs, from the time clock"
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "font-label-bold", children: money0(labor.pay) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `py-3 border-b ${hairline}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-on-surface", children: [
          "Materials ",
          /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant text-xs", children: "(itemized)" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-label-bold", children: money0(matTotal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        materials.map((m, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("input", { "aria-label": `Material ${i + 1} description`, className: `${mInput} flex-1`, value: m.desc, onChange: (e) => setLine(i, { desc: e.target.value }), placeholder: "e.g. Block & stone" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 w-28 shrink-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "$" }),
            /* @__PURE__ */ jsx("input", { "aria-label": `Material ${i + 1} cost`, className: mInput, inputMode: "decimal", value: m.amount || "", onChange: (e) => setLine(i, { amount: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 }), placeholder: "0" })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => rmLine(i), className: "text-on-surface-variant hover:text-error text-sm px-2 py-1", "aria-label": `Remove material ${i + 1}`, children: "✕" })
        ] }, i)),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: addLine, className: "text-primary text-sm font-label-bold hover:underline", children: "+ Add line item" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: line, children: [
      /* @__PURE__ */ jsxs("span", { className: "text-on-surface", children: [
        "Total cost ",
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant text-xs", children: "(labor + materials)" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "font-label-bold", children: money0(cost) })
    ] }),
    hasBid && /* @__PURE__ */ jsxs("div", { className: `py-3 border-b ${hairline} text-sm space-y-1`, children: [
      /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-xs uppercase tracking-widest font-label-bold", children: "Bid against actual" }),
      eH > 0 && /* @__PURE__ */ jsxs("p", { children: [
        "Hours: bid ",
        eH.toFixed(0),
        ", actual ",
        labor.hours.toFixed(1),
        ", ",
        /* @__PURE__ */ jsxs("span", { className: `font-label-bold ${over(labor.hours - eH)}`, children: [
          labor.hours - eH > 0 ? "over by" : "under by",
          " ",
          Math.abs(labor.hours - eH).toFixed(1)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Cost: bid ",
        money0(estCost),
        ", actual ",
        money0(cost),
        ", ",
        /* @__PURE__ */ jsxs("span", { className: `font-label-bold ${over(cost - estCost)}`, children: [
          cost - estCost > 0 ? "over by" : "under by",
          " ",
          money0(Math.abs(cost - estCost))
        ] })
      ] }),
      v > 0 && /* @__PURE__ */ jsxs("p", { children: [
        "Margin: bid ",
        estMargin.toFixed(0),
        "%, actual ",
        margin.toFixed(0),
        "%, ",
        /* @__PURE__ */ jsxs("span", { className: `font-label-bold ${over(estMargin - margin)}`, children: [
          margin - estMargin >= 0 ? "up" : "down",
          " ",
          Math.abs(margin - estMargin).toFixed(0),
          " points"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 pt-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg", children: v > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("strong", { className: `font-display-lg text-3xl ${profit >= 0 ? "text-[#5ec26a]" : "text-error"}`, children: money0(profit) }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "profit at" }),
        " ",
        /* @__PURE__ */ jsxs("strong", { className: "font-display-lg text-3xl text-primary", children: [
          margin.toFixed(0),
          "%"
        ] }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant", children: "margin" })
      ] }) : /* @__PURE__ */ jsx("span", { className: "text-on-surface-variant text-sm", children: "Add a contract value to see profit." }) }),
      /* @__PURE__ */ jsx("button", { className: btn, disabled: busy, onClick: save, children: busy ? "Saving…" : saved ? "Saved" : "Save" })
    ] }),
    err && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mt-2`, children: err })
  ] });
}
const blankCrew = () => ({ name: "", rate: "", pin: "", phone: "", effectiveFrom: todayStr() });
function crewFormError(f) {
  if (!f.name.trim()) return "Enter a name.";
  if (f.rate.trim() === "" || !(Number(f.rate) >= 0)) return "Enter an hourly rate.";
  if (!/^\d{4}$/.test(f.pin)) return "PIN must be 4 digits.";
  const digits = f.phone.replace(/\D/g, "").replace(/^1/, "");
  if (f.phone.trim() && digits.length !== 10) return "The cell number needs all 10 digits.";
  return "";
}
function CrewFields({ f, setF, idPrefix, autoFocus, currentRate, smsOn }) {
  const rateChanged = currentRate !== void 0 && f.rate.trim() !== "" && Number(f.rate) !== currentRate;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: label, htmlFor: `${idPrefix}-name`, children: "Name" }),
      /* @__PURE__ */ jsx("input", { id: `${idPrefix}-name`, className: input, autoFocus, autoComplete: "off", value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: label, htmlFor: `${idPrefix}-rate`, children: "Hourly Rate ($)" }),
      /* @__PURE__ */ jsx("input", { id: `${idPrefix}-rate`, className: input, inputMode: "decimal", autoComplete: "off", value: f.rate, onChange: (e) => setF({ ...f, rate: e.target.value.replace(/[^0-9.]/g, "") }), placeholder: "25" })
    ] }),
    rateChanged && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: label, htmlFor: `${idPrefix}-from`, children: "New Rate Starts" }),
      /* @__PURE__ */ jsx("input", { id: `${idPrefix}-from`, type: "date", className: input, value: f.effectiveFrom, onChange: (e) => setF({ ...f, effectiveFrom: e.target.value }) }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs mt-1", children: f.effectiveFrom > todayStr() ? `Shifts keep paying ${money(currentRate)} until that day, then ${money(Number(f.rate))}.` : `Shifts already logged on or after this day move to ${money(Number(f.rate))}. Weeks you've locked stay as paid.` })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: label, htmlFor: `${idPrefix}-pin`, children: "4-Digit PIN" }),
      /* @__PURE__ */ jsx("input", { id: `${idPrefix}-pin`, className: `${input} tracking-[0.4em]`, inputMode: "numeric", autoComplete: "off", maxLength: 4, value: f.pin, onChange: (e) => setF({ ...f, pin: e.target.value.replace(/\D/g, "") }), placeholder: "0000" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: label, htmlFor: `${idPrefix}-phone`, children: "Cell Number (optional)" }),
      /* @__PURE__ */ jsx("input", { id: `${idPrefix}-phone`, className: input, type: "tel", inputMode: "tel", autoComplete: "off", value: f.phone, onChange: (e) => setF({ ...f, phone: e.target.value }), placeholder: "(330) 555-0100" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs mt-1", children: smsOn ? "Used only to text a reminder when they forget to clock out. Get their OK before adding it." : "For clock-out reminder texts. Texting is not connected yet, so nothing is sent." })
    ] })
  ] });
}
function CrewTab({ employees, entries, smsOn, post: post2, onChange }) {
  const [f, setF] = useState(blankCrew);
  const [err, setErr] = useState("");
  const [editId, setEditId] = useState("");
  const [ef, setEf] = useState(blankCrew);
  const [editErr, setEditErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(null);
  const [rowErr, setRowErr] = useState(null);
  const [copied, setCopied] = useState("");
  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
    }
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };
  const shiftCount = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const e of entries) if (e.employeeId) m.set(e.employeeId, (m.get(e.employeeId) || 0) + 1);
    return m;
  }, [entries]);
  const active = employees.filter((e) => e.active);
  const former = employees.filter((e) => !e.active);
  const add = async (e) => {
    e.preventDefault();
    const problem = crewFormError(f);
    setErr(problem);
    if (problem) return;
    try {
      await post2({ action: "save-employee", employee: { name: f.name, rate: Number(f.rate), pin: f.pin, phone: f.phone } });
      setF(blankCrew());
      await onChange();
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const startEdit = (e) => {
    setEditId(e.id);
    setEf({ name: e.name, rate: String(e.rate), pin: e.pin, phone: e.phone ? fmtPhone(e.phone) : "", effectiveFrom: todayStr() });
    setEditErr("");
    setRowErr(null);
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    const problem = crewFormError(ef);
    setEditErr(problem);
    if (problem) return;
    setBusy(true);
    try {
      const d = await post2({ action: "save-employee", employee: { id: editId, name: ef.name, rate: Number(ef.rate), pin: ef.pin, phone: ef.phone, effectiveFrom: ef.effectiveFrom } });
      await onChange();
      const parts = ["Changes saved."];
      if (d.rerated) parts.push(`${d.rerated} shift${d.rerated === 1 ? "" : "s"} moved to the new rate.`);
      if (d.lockedSkipped) parts.push(`${d.lockedSkipped} in a locked week stayed as paid.`);
      setSaved({ id: editId, note: parts.join(" ") });
      setTimeout(() => setSaved(null), 6e3);
      setEditId("");
    } catch (e2) {
      setEditErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const act = async (id, body) => {
    setRowErr(null);
    try {
      await post2(body);
      if (editId === id) setEditId("");
      await onChange();
    } catch (e2) {
      setRowErr({ id, note: e2.message });
    }
  };
  const setActive = (e, on) => {
    if (!on && !confirm(`Take ${e.name} off the crew list? They won't be able to clock in. Their hours stay on file and you can bring them back any time.`)) return;
    act(e.id, { action: "set-employee-active", id: e.id, active: on });
  };
  const remove = (e) => {
    if (confirm(`Remove ${e.name} for good? This is for someone added by mistake.`)) act(e.id, { action: "delete-employee", id: e.id });
  };
  const cancelRaise = (e) => act(e.id, { action: "save-employee", employee: { id: e.id, cancelNextRate: true } });
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-x-12 gap-y-12", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: add, className: "space-y-5 h-fit", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Add Crew Member" }),
      /* @__PURE__ */ jsx(CrewFields, { f, setF, idPrefix: "crew-add", smsOn }),
      err && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: err }),
      /* @__PURE__ */ jsx("button", { className: btn, children: "Add Member" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: `On the Crew (${active.length})` }),
      active.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "No crew yet. Add your first person." }),
      /* @__PURE__ */ jsx("ul", { children: active.map((e) => {
        const link = `${typeof window !== "undefined" ? window.location.origin : ""}/employee?u=${e.id}`;
        if (editId === e.id) {
          return /* @__PURE__ */ jsx("li", { className: `py-5 border-b ${hairline}`, children: /* @__PURE__ */ jsxs("form", { onSubmit: saveEdit, className: "space-y-4 max-w-md", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-headline-md text-headline-md uppercase", children: [
              "Edit ",
              e.name
            ] }),
            /* @__PURE__ */ jsx(CrewFields, { f: ef, setF: setEf, idPrefix: `crew-edit-${e.id}`, autoFocus: true, currentRate: e.rate, smsOn }),
            editErr && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: editErr }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("button", { className: btn, disabled: busy, children: busy ? "Saving…" : "Save Changes" }),
              /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, disabled: busy, onClick: () => setEditId(""), children: "Cancel" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "Their login link stays the same. A new PIN signs them out until they enter it." })
          ] }) }, e.id);
        }
        return /* @__PURE__ */ jsxs("li", { className: `py-4 border-b ${hairline} space-y-2`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-headline-md text-headline-md break-words", children: e.name }),
              /* @__PURE__ */ jsxs("div", { className: "text-on-surface-variant text-sm", children: [
                money(e.rate),
                " an hour, PIN ",
                e.pin,
                e.phone ? `, ${fmtPhone(e.phone)}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-4", children: [
              /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => startEdit(e), children: "Edit" }),
              /* @__PURE__ */ jsx("button", { className: textLink, onClick: () => setActive(e, false), children: "No longer on crew" })
            ] })
          ] }),
          e.nextRate && /* @__PURE__ */ jsxs("p", { className: "text-on-surface text-sm", children: [
            "Goes to ",
            money(e.nextRate.rate),
            " an hour on ",
            fmtDate(e.nextRate.from),
            ". ",
            /* @__PURE__ */ jsx("button", { className: textLink, onClick: () => cancelRaise(e), children: "Cancel this change" })
          ] }),
          saved?.id === e.id && /* @__PURE__ */ jsx("p", { role: "status", className: "text-primary text-sm font-label-bold", children: saved.note }),
          rowErr?.id === e.id && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: rowErr.note }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 border ${hairline} p-2`, children: [
            /* @__PURE__ */ jsx("input", { readOnly: true, "aria-label": `Login link for ${e.name}`, value: link, onFocus: (ev) => ev.currentTarget.select(), className: "flex-1 min-w-0 bg-transparent text-on-surface-variant text-xs outline-none" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => copy(e.id, link), className: "shrink-0 bg-primary-container text-on-primary-container font-label-bold text-xs uppercase px-3 py-1.5 metallic-gradient beveled-edge", children: copied === e.id ? "Copied" : "Copy link" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant/70 text-xs", children: [
            "Text this link to ",
            e.name.split(" ")[0],
            ". It opens straight to their name, and they just enter PIN ",
            e.pin,
            "."
          ] })
        ] }, e.id);
      }) }),
      former.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsx(SectionHead, { title: `No Longer on Crew (${former.length})`, note: "They can't clock in, and their hours stay in your records and reports." }),
        /* @__PURE__ */ jsx("ul", { children: former.map((e) => /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1`, children: [
          /* @__PURE__ */ jsxs("span", { className: "min-w-0 break-words", children: [
            /* @__PURE__ */ jsx("span", { className: "font-label-bold", children: e.name }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant text-sm", children: [
              money(e.rate),
              " an hour, ",
              (shiftCount.get(e.id) || 0).toLocaleString("en-US"),
              " shifts on file"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex flex-wrap items-baseline gap-4", children: [
            /* @__PURE__ */ jsx("button", { className: textLink, onClick: () => setActive(e, true), children: "Bring back" }),
            !shiftCount.get(e.id) && /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant hover:text-error text-sm underline underline-offset-4", onClick: () => remove(e), children: "Remove for good" })
          ] }),
          rowErr?.id === e.id && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} basis-full`, children: rowErr.note })
        ] }, e.id)) })
      ] })
    ] })
  ] });
}
function JobsTab({ jobs, entries, post: post2, onChange }) {
  const blank = { id: "", customer: "", workType: "", address: "", status: "active" };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const [rowErr, setRowErr] = useState(null);
  const formRef = useRef(null);
  const save = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await post2({ action: "save-job", job: { id: f.id || void 0, customer: f.customer, workType: f.workType, address: f.address, status: f.status } });
      setF(blank);
      await onChange();
    } catch (e2) {
      setErr(e2.message);
    }
  };
  const editJob = (j) => {
    setF({ id: j.id, customer: j.customer || (j.workType ? "" : j.name || ""), workType: j.workType || "", address: j.address || "", status: j.status || "active" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formRef.current?.querySelector("input")?.focus({ preventScroll: true });
  };
  const act = async (id, body) => {
    setRowErr(null);
    try {
      await post2(body);
      await onChange();
    } catch (e2) {
      setRowErr({ id, note: e2.message });
    }
  };
  const setStatus = (j, status) => act(j.id, { action: "save-job", job: { id: j.id, status } });
  const del = (j) => {
    if (!confirm("Remove this job? Its logged hours stay in your records.")) return;
    if (f.id === j.id) setF(blank);
    act(j.id, { action: "delete-job", id: j.id });
  };
  const order = { active: 0, future: 1, finished: 2 };
  const sortedJobs = [...jobs].sort((a, b) => order[a.status || "active"] - order[b.status || "active"]);
  const loose = useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const e of entries) {
      if (e.jobId || !e.jobName || jobs.some((j) => j.name === e.jobName)) continue;
      const c = m.get(e.jobName) || { hours: 0, pay: 0, shifts: 0 };
      m.set(e.jobName, { hours: c.hours + e.hours, pay: c.pay + e.pay, shifts: c.shifts + 1 });
    }
    return Array.from(m.entries()).sort((a, b) => b[1].hours - a[1].hours);
  }, [entries, jobs]);
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-x-12 gap-y-12", children: [
    /* @__PURE__ */ jsxs("form", { ref: formRef, onSubmit: save, className: "space-y-5 h-fit scroll-mt-32", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: f.id ? "Edit Job" : "Add a Job", note: "Only Active jobs show in the crew's dropdown. Future and Finished jobs are hidden from them, so their list stays short." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "job-customer", children: "Customer" }),
        /* @__PURE__ */ jsx("input", { id: "job-customer", className: input, value: f.customer, onChange: (e) => setF({ ...f, customer: e.target.value }), placeholder: "e.g. Chick-fil-A or Mr. Smith" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "job-type", children: "Type of Work" }),
        /* @__PURE__ */ jsx("input", { id: "job-type", className: input, value: f.workType, onChange: (e) => setF({ ...f, workType: e.target.value }), placeholder: "e.g. Retaining Wall" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "job-addr", children: "Job Site Address" }),
        /* @__PURE__ */ jsx("input", { id: "job-addr", className: input, value: f.address, onChange: (e) => setF({ ...f, address: e.target.value }), placeholder: "123 Main St, Wadsworth, OH" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "job-status", children: "Status" }),
        /* @__PURE__ */ jsxs("select", { id: "job-status", className: input, value: f.status, onChange: (e) => setF({ ...f, status: e.target.value }), children: [
          /* @__PURE__ */ jsx("option", { value: "active", children: "Active (crew can pick it)" }),
          /* @__PURE__ */ jsx("option", { value: "future", children: "Future (hidden from crew)" }),
          /* @__PURE__ */ jsx("option", { value: "finished", children: "Finished (hidden from crew)" })
        ] })
      ] }),
      f.id && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-xs", children: "Renaming a job keeps every hour already logged against it." }),
      err && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: err }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: f.id ? "Save Changes" : "Add Job" }),
        f.id && /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: () => setF(blank), children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHead, { title: `Jobs (${jobs.length})` }),
        jobs.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "No jobs yet." }),
        /* @__PURE__ */ jsx("ul", { children: sortedJobs.map((j) => {
          const s = laborForJob(j, entries);
          const status = j.status || "active";
          return /* @__PURE__ */ jsxs("li", { className: `py-4 border-b ${hairline} ${status !== "active" ? "opacity-75" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-label-bold break-words", children: [
                  j.customer || j.name,
                  j.workType ? /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant font-normal", children: [
                    ", ",
                    j.workType
                  ] }) : null
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-sm break-words", children: j.address || "No address saved" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-4", children: [
                /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => editJob(j), children: "Edit" }),
                /* @__PURE__ */ jsx("button", { className: "text-on-surface-variant hover:text-error text-sm underline underline-offset-4", onClick: () => del(j), children: "Remove" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-sm", children: [
              /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-on-surface-variant", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider font-label-bold", children: "Status" }),
                /* @__PURE__ */ jsx("select", { "aria-label": `Status for ${j.name}`, className: `bg-surface-container border ${hairline} text-on-surface text-sm px-2 py-1 focus:border-primary focus:outline-none`, value: status, onChange: (e) => setStatus(j, e.target.value), children: Object.keys(JOB_STATUS_LABEL).map((k) => /* @__PURE__ */ jsx("option", { value: k, children: JOB_STATUS_LABEL[k] }, k)) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-primary font-label-bold", children: [
                  hrs(s.hours),
                  " man-hours"
                ] }),
                ", ",
                money(s.pay),
                " labor to date"
              ] })
            ] }),
            rowErr?.id === j.id && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mt-2`, children: rowErr.note })
          ] }, j.id);
        }) }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs pt-3", children: "Labor shown is straight-time hours logged against each job, totaled across all time." })
      ] }),
      loose.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(SectionHead, { title: "Hours Not Tied to a Job", note: "These were logged under a job name that has since changed or been removed, so they are not counting toward any job. Pick the job each one belongs to." }),
        /* @__PURE__ */ jsx("ul", { children: loose.map(([name, v]) => /* @__PURE__ */ jsx(LooseRow, { name, v, jobs: sortedJobs, post: post2, onChange }, name)) })
      ] })
    ] })
  ] });
}
function LooseRow({ name, v, jobs, post: post2, onChange }) {
  const [jobId, setJobId] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");
  const link = async () => {
    setErr("");
    setBusy(true);
    try {
      const d = await post2({ action: "link-job-name", jobName: name, jobId });
      setDone(`${d.linked} shift${d.linked === 1 ? "" : "s"} tied to that job.`);
      await onChange();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("li", { className: `py-3 border-b ${hairline} flex flex-wrap items-center gap-x-4 gap-y-2`, children: [
    /* @__PURE__ */ jsxs("span", { className: "min-w-0 flex-1 break-words", children: [
      /* @__PURE__ */ jsx("span", { className: "font-label-bold", children: name }),
      " ",
      /* @__PURE__ */ jsxs("span", { className: "text-on-surface-variant text-sm", children: [
        v.shifts,
        " shift",
        v.shifts === 1 ? "" : "s",
        ", ",
        hrs(v.hours),
        " hrs, ",
        money(v.pay)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("select", { "aria-label": `Job for hours logged as ${name}`, className: `bg-surface-container border ${hairline} text-on-surface text-sm px-2 py-2 max-w-full focus:border-primary focus:outline-none`, value: jobId, onChange: (e) => setJobId(e.target.value), children: [
      /* @__PURE__ */ jsx("option", { value: "", children: "Pick the job…" }),
      jobs.map((j) => /* @__PURE__ */ jsx("option", { value: j.id, children: j.name }, j.id))
    ] }),
    /* @__PURE__ */ jsx("button", { className: textLink, disabled: !jobId || busy, onClick: link, children: busy ? "Saving…" : "Tie to this job" }),
    err && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} basis-full`, children: err }),
    done && /* @__PURE__ */ jsx("p", { role: "status", className: `${okText} basis-full`, children: done })
  ] });
}
const NotConnected = ({ what }) => /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant text-sm", children: [
  what,
  " is not connected to this site yet, so nothing is sent. Your choices here are saved and start working the day it is connected. Adam Loomis Marketing sets that up."
] });
const Said = ({ note }) => /* @__PURE__ */ jsxs(Fragment, { children: [
  note.ok && /* @__PURE__ */ jsx("p", { role: "status", className: okText, children: note.ok }),
  note.err && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: note.err })
] });
function SettingsTab({ settings, connected, backup, weakPasscode, post: post2, onChange, onToken, onSignOut }) {
  const run = async (set, fn) => {
    set({});
    try {
      set({ ok: await fn() });
    } catch (e) {
      set({ err: e.message });
    }
  };
  const [pass, setPass] = useState("");
  const [passNote, setPassNote] = useState({});
  const savePass = (e) => {
    e.preventDefault();
    if (pass.length < 6) return setPassNote({ err: "Use at least 6 characters." });
    run(setPassNote, async () => {
      const d = await post2({ action: "set-admin-passcode", newPasscode: pass });
      onToken(d.token);
      setPass("");
      await onChange();
      return "Passcode updated. Any other phone or computer that was signed in has been signed out.";
    });
  };
  const [wd, setWd] = useState(String(settings.weekStartDay));
  const [weekNote, setWeekNote] = useState({});
  const saveWeek = (e) => {
    e.preventDefault();
    run(setWeekNote, async () => {
      await post2({ action: "set-week-start", weekStartDay: Number(wd) });
      await onChange();
      return `Workweek now starts ${DAYS[Number(wd)]}.`;
    });
  };
  const [locNote, setLocNote] = useState({});
  const saveLoc = (on) => run(setLocNote, async () => {
    await post2({ action: "save-settings", locationStamp: on });
    await onChange();
    return on ? "On. Tell the crew before their next shift. Their phone will ask permission the first time." : "Off. No location is saved.";
  });
  const [mail, setMail] = useState(settings.payrollEmail);
  const [mailNote, setMailNote] = useState({});
  const saveMail = (e) => {
    e.preventDefault();
    run(setMailNote, async () => {
      await post2({ action: "save-settings", payrollEmail: mail });
      await onChange();
      return mail.on ? `Saved. The summary goes to ${mail.to} every ${DAYS[mail.day]} morning.` : "Saved. The weekly email is off.";
    });
  };
  const sendNow = () => run(setMailNote, async () => {
    await post2({ action: "save-settings", payrollEmail: mail });
    const d = await post2({ action: "send-payroll-email" });
    return `Sent last week's summary to ${d.to}.`;
  });
  const [rem, setRem] = useState(settings.reminders);
  const [remNote, setRemNote] = useState({});
  const saveRem = (e) => {
    e.preventDefault();
    run(setRemNote, async () => {
      await post2({ action: "save-settings", reminders: rem });
      await onChange();
      return rem.on ? `Saved. Anyone on the clock longer than ${rem.afterHours} hours gets one text.` : "Saved. Reminder texts are off.";
    });
  };
  const [backNote, setBackNote] = useState({});
  const backupNow = () => run(setBackNote, async () => {
    const d = await post2({ action: "backup-now" });
    await onChange();
    return `Backed up ${d.backup.entries} shifts just now.`;
  });
  const downloadCopy = () => run(setBackNote, async () => {
    const d = await post2({ action: "backup-download" });
    downloadFile(`randolph-timeclock-${todayStr()}.json`, JSON.stringify(d, null, 2), "application/json");
    return `Downloaded ${d.entries.length} shifts, your crew list, and your jobs.`;
  });
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-x-14 gap-y-14 max-w-5xl", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: savePass, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Owner Passcode", note: weakPasscode ? "You are still on the 4-digit PIN. Set a longer passcode here. Letters, numbers, or both, at least 6 characters." : "Letters, numbers, or both, at least 6 characters." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "new-pass", children: "New Passcode" }),
        /* @__PURE__ */ jsx(PasscodeField, { id: "new-pass", value: pass, onChange: setPass, autoComplete: "new-password" })
      ] }),
      /* @__PURE__ */ jsx(Said, { note: passNote }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: "Update Passcode" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: onSignOut, children: "Sign Out" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "Five wrong tries locks the login for 15 minutes. This phone stays signed in for a week." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveWeek, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Workweek for Overtime", note: "Overtime pays 1.5× for hours over 40 in a week. Pick the day your pay week starts so the totals match your payroll." }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "week-day", children: "Week Starts On" }),
        /* @__PURE__ */ jsx("select", { id: "week-day", className: input, value: wd, onChange: (e) => setWd(e.target.value), children: DAYS.map((d, i) => /* @__PURE__ */ jsx("option", { value: i, children: d }, i)) })
      ] }),
      /* @__PURE__ */ jsx(Said, { note: weekNote }),
      /* @__PURE__ */ jsx("button", { className: btn, children: "Save Workweek" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Location at Clock-In", note: "Saves where the phone is at the moment someone clocks in and again when they clock out, with a map link on each shift. Nobody is followed during the day." }),
      /* @__PURE__ */ jsx(Toggle, { id: "loc-on", checked: settings.locationStamp, onChange: saveLoc, children: "Save location at clock-in and clock-out" }),
      /* @__PURE__ */ jsx(Said, { note: locNote }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "If someone turns location off on their phone, they can still clock in. The shift is marked so you can see it." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveMail, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Weekly Payroll Email", note: "Last week's hours and gross pay for each person, in your inbox, with every shift attached as a spreadsheet." }),
      /* @__PURE__ */ jsx(Toggle, { id: "mail-on", checked: mail.on, onChange: (on) => setMail({ ...mail, on }), children: "Email me the payroll summary every week" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "mail-to", children: "Send To" }),
        /* @__PURE__ */ jsx("input", { id: "mail-to", type: "email", autoComplete: "email", className: input, value: mail.to, onChange: (e) => setMail({ ...mail, to: e.target.value }), placeholder: "you@example.com" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "mail-day", children: "Send On" }),
        /* @__PURE__ */ jsx("select", { id: "mail-day", className: input, value: mail.day, onChange: (e) => setMail({ ...mail, day: Number(e.target.value) }), children: DAYS.map((d, i) => /* @__PURE__ */ jsxs("option", { value: i, children: [
          d,
          " morning"
        ] }, i)) })
      ] }),
      !connected.email && /* @__PURE__ */ jsx(NotConnected, { what: "Email" }),
      /* @__PURE__ */ jsx(Said, { note: mailNote }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, children: "Save" }),
        connected.email && /* @__PURE__ */ jsx("button", { type: "button", className: btnGhost, onClick: sendNow, disabled: !mail.to, children: "Send Last Week Now" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: saveRem, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Clock-Out Reminder Texts", note: "When someone is still on the clock long after a normal day, they get one text with their clock-out link. Add each person's cell number under Crew." }),
      /* @__PURE__ */ jsx(Toggle, { id: "rem-on", checked: rem.on, onChange: (on) => setRem({ ...rem, on }), children: "Text a reminder to anyone who forgets to clock out" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: label, htmlFor: "rem-hours", children: "Send After This Many Hours on the Clock" }),
        /* @__PURE__ */ jsx("select", { id: "rem-hours", className: input, value: rem.afterHours, onChange: (e) => setRem({ ...rem, afterHours: Number(e.target.value) }), children: [8, 9, 10, 11, 12, 13, 14].map((h) => /* @__PURE__ */ jsxs("option", { value: h, children: [
          h,
          " hours"
        ] }, h)) })
      ] }),
      !connected.sms && /* @__PURE__ */ jsx(NotConnected, { what: "Texting" }),
      /* @__PURE__ */ jsx(Said, { note: remNote }),
      /* @__PURE__ */ jsx("button", { className: btn, children: "Save" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "Backups", note: "Every night at 3:00 AM a full copy of your shifts, crew, and jobs is saved. The last 35 nights are kept, plus one from the start of every month." }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface", children: backup ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Last backup ",
        /* @__PURE__ */ jsx("strong", { className: "font-label-bold", children: fmtStamp(backup.takenAt) }),
        backup.entries != null ? `, ${backup.entries.toLocaleString("en-US")} shifts` : "",
        "."
      ] }) : "The first nightly backup runs tonight." }),
      /* @__PURE__ */ jsx(Said, { note: backNote }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: btn, onClick: backupNow, children: "Back Up Now" }),
        /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: downloadCopy, children: "Download a Copy" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant/70 text-xs", children: "Payroll records have to be kept for three years. The downloaded copy is yours to store wherever you keep business records." })
    ] })
  ] });
}
const API = "/.netlify/functions/timeclock";
const TOKEN_KEY = "rc_tc_admin";
const TABS = ["entries", "payroll", "projects", "crew", "jobs", "settings"];
const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};
const writeToken = (t) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
  }
};
const NO_SETTINGS = {
  weekStartDay: 0,
  lockedThrough: null,
  locationStamp: false,
  payrollEmail: { on: false, to: "", day: 1 },
  reminders: { on: false, afterHours: 10 },
  quickbooks: { serviceItem: "", payrollItem: "", otPayrollItem: "", companyName: "", companyCreateTime: "" }
};
function TimeClockAdmin() {
  const [passcode, setPasscode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab2, setTab] = useState("entries");
  const token = useRef("");
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [entries, setEntries] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [settings, setSettings] = useState(NO_SETTINGS);
  const [connected, setConnected] = useState({ email: false, sms: false });
  const [backup, setBackup] = useState(null);
  const [weak, setWeak] = useState(false);
  const [loadErr, setLoadErr] = useState("");
  const setToken = (t) => {
    token.current = t;
    writeToken(t);
  };
  const signOut = useCallback((why = "") => {
    setToken("");
    setAuthed(false);
    setPasscode("");
    setEntries([]);
    setEmployees([]);
    setJobs([]);
    setErr(why);
  }, []);
  const call = async (body) => {
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, d };
  };
  const post2 = useCallback(async (body) => {
    const { ok, d } = await call({ ...body, adminToken: token.current });
    if (!ok) {
      if (d.relogin) signOut("You were signed out. Sign in again.");
      throw new Error(d.error || "Something went wrong.");
    }
    return d;
  }, [signOut]);
  const refresh = useCallback(async () => {
    const [a, e] = await Promise.all([post2({ action: "admin-bootstrap" }), post2({ action: "admin-entries" })]);
    const crew = a.employees || [];
    const jobList = a.jobs || [];
    setEmployees(crew);
    setJobs(jobList);
    setSettings({ ...NO_SETTINGS, weekStartDay: a.weekStartDay ?? 0, lockedThrough: a.lockedThrough ?? null, locationStamp: a.locationStamp === true, payrollEmail: a.payrollEmail || NO_SETTINGS.payrollEmail, reminders: a.reminders || NO_SETTINGS.reminders, quickbooks: a.quickbooks || NO_SETTINGS.quickbooks });
    setConnected(a.connected || { email: false, sms: false });
    setBackup(a.backup || null);
    setWeak(a.weakPasscode === true);
    const nameById = new Map(crew.map((x) => [x.id, x.name]));
    const jobById = new Map(jobList.map((x) => [x.id, x.name]));
    setEntries((e.entries || []).map((x) => ({
      ...x,
      employeeName: x.employeeId && nameById.get(x.employeeId) || x.employeeName,
      jobName: x.jobId && jobById.get(x.jobId) || x.jobName
    })));
    setTrashCount(e.trashCount || 0);
  }, [post2]);
  const reload = useCallback(async () => {
    setLoadErr("");
    try {
      await refresh();
    } catch (e) {
      setLoadErr(e.message);
    }
  }, [refresh]);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Time Clock Admin | Randolph Construction";
    const saved = readToken();
    if (!saved) {
      setChecking(false);
      return;
    }
    token.current = saved;
    refresh().then(() => setAuthed(true)).catch(() => {
      setToken("");
      setErr("");
    }).finally(() => setChecking(false));
  }, []);
  const login = async (e) => {
    e.preventDefault();
    setErr("");
    if (!passcode) return setErr("Enter your passcode.");
    setBusy(true);
    try {
      const { ok, d } = await call({ action: "admin-login", passcode });
      if (!ok) throw new Error(d.error || "Something went wrong.");
      setToken(d.token);
      setPasscode("");
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
        checking ? /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant", children: "Loading…" }) : /* @__PURE__ */ jsxs("form", { onSubmit: login, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: label, htmlFor: "apin", children: "Passcode" }),
            /* @__PURE__ */ jsx(PasscodeField, { id: "apin", value: passcode, onChange: setPasscode, autoComplete: "current-password" })
          ] }),
          err && /* @__PURE__ */ jsx("p", { role: "alert", className: errorText, children: err }),
          /* @__PURE__ */ jsx("button", { className: `${btn} w-full`, disabled: busy, children: busy ? "Checking…" : "Sign In" })
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
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: reload, children: "Refresh" }),
          /* @__PURE__ */ jsx("button", { className: btnGhost, onClick: () => signOut(), children: "Sign Out" })
        ] })
      ] }),
      weak && /* @__PURE__ */ jsxs("p", { className: "mb-8 border border-primary p-4 text-on-surface", children: [
        "Your login is still a 4-digit PIN, which is easy to guess. ",
        /* @__PURE__ */ jsx("button", { className: "underline underline-offset-4 text-primary font-label-bold", onClick: () => setTab("settings"), children: "Set a longer passcode" }),
        ". It takes a minute."
      ] }),
      loadErr && /* @__PURE__ */ jsx("p", { role: "alert", className: `${errorText} mb-6`, children: loadErr }),
      /* @__PURE__ */ jsx("div", { role: "tablist", "aria-label": "Time clock sections", className: "flex flex-wrap gap-x-2 mb-10 border-b border-surface-container-highest", children: TABS.map((t) => /* @__PURE__ */ jsx(
        "button",
        {
          role: "tab",
          "aria-selected": tab2 === t,
          onClick: () => setTab(t),
          className: `font-label-bold text-label-bold uppercase px-4 sm:px-5 py-3 -mb-px border-b-2 transition-all ${tab2 === t ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`,
          children: t
        },
        t
      )) }),
      tab2 === "entries" && /* @__PURE__ */ jsx(EntriesTab, { entries, jobs, lockedThrough: settings.lockedThrough, trashCount, showLocation: settings.locationStamp, post: post2, onChange: reload }),
      tab2 === "payroll" && /* @__PURE__ */ jsx(PayrollTab, { entries, jobs, settings, post: post2, onChange: reload }),
      tab2 === "projects" && /* @__PURE__ */ jsx(ProjectsTab, { jobs, entries, post: post2, onChange: reload }),
      tab2 === "crew" && /* @__PURE__ */ jsx(CrewTab, { employees, entries, smsOn: connected.sms, post: post2, onChange: reload }),
      tab2 === "jobs" && /* @__PURE__ */ jsx(JobsTab, { jobs, entries, post: post2, onChange: reload }),
      tab2 === "settings" && /* @__PURE__ */ jsx(SettingsTab, { settings, connected, backup, weakPasscode: weak, post: post2, onChange: reload, onToken: setToken, onSignOut: () => signOut() })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
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
    /* @__PURE__ */ jsx(Route, { path: "/employee", component: TimeClock }),
    /* @__PURE__ */ jsx(Route, { path: "/404", component: NotFound }),
    /* @__PURE__ */ jsx(Route, { component: NotFound })
  ] });
}
function GlobalCtas() {
  const [location] = useLocation();
  if (location.startsWith("/timeclock") || location.startsWith("/employee") || location.startsWith("/admin")) return null;
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
