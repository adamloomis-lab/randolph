import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// Production builds ship SSR'd HTML in #root — hydrate it.
// The Vite dev server ships an empty #root — fall back to createRoot.
if (root.firstElementChild) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
