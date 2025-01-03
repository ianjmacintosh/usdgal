import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./index.css";

{
  /* <StrictMode>
<BrowserRouter>
  <Routes>
    <Route index element={<I18nWrapper language="en" />}></Route>
    <Route path="en" element={<Navigate to="/" />}></Route>
    <Route path="de" element={<I18nWrapper language="de" />}></Route>
    <Route path="es" element={<I18nWrapper language="es" />}></Route>
    <Route path="hi" element={<I18nWrapper language="hi" />}></Route>
    <Route path="pt" element={<I18nWrapper language="pt" />}></Route>
  </Routes>
</BrowserRouter>
</StrictMode>, */
}

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
