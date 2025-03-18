import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// @ts-expect-error: App.jsx is a JavaScript file, and TypeScript cannot verify its types
import App from "./App.jsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
