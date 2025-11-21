import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./pages/home.css";

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);

// Eruda mobile console (remove before production)
if (true) {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/eruda";
  script.onload = () => (window as any).eruda.init();
  document.head.appendChild(script);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        console.log("SW registered: ", registration);
      },
      (error) => {
        console.log("SW registration failed: ", error);
      },
    );
  });
}
