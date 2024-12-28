import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { I18nWrapper } from "./I18nWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nWrapper />
  </StrictMode>,
);
