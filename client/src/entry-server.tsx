import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { Router as WouterRouter } from "wouter";
import App from "./App";

/**
 * Server-side render the app for a given route path.
 * Called from scripts/prerender.mjs at build time to produce real static
 * HTML body content (not just the head meta + empty #root).
 *
 * We do NOT import "./index.css" or "./main.tsx" here on purpose — the SSR
 * output is pure HTML; styles and hydration are wired in by the client build.
 */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <WouterRouter ssrPath={path}>
        <App />
      </WouterRouter>
    </StrictMode>
  );
}
