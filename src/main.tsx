import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { I18nWrapper } from "./I18nWrapper.tsx";
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<I18nWrapper language="en" />}></Route>
        <Route path="de" element={<I18nWrapper language="de" />}></Route>
        <Route path="es" element={<I18nWrapper language="es" />}></Route>
        <Route path="hi" element={<I18nWrapper language="hi" />}></Route>
        <Route path="pt" element={<I18nWrapper language="pt" />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
