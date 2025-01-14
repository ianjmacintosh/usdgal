import { I18nProvider } from "@/context/i18n";
import { Navigate, Route, Routes } from "react-router";
import Converter from "../converter/converter";

export default function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <I18nProvider siteLanguage="en">
            <Converter />
          </I18nProvider>
        }
      ></Route>
      <Route path="en" element={<Navigate to="/" />}></Route>
      <Route
        path="de"
        element={
          <I18nProvider siteLanguage="de">
            <Converter />
          </I18nProvider>
        }
      ></Route>
      <Route
        path="es"
        element={
          <I18nProvider siteLanguage="es">
            <Converter />
          </I18nProvider>
        }
      ></Route>
      <Route
        path="hi"
        element={
          <I18nProvider siteLanguage="hi">
            <Converter />
          </I18nProvider>
        }
      ></Route>
      <Route
        path="pt"
        element={
          <I18nProvider siteLanguage="pt">
            <Converter />
          </I18nProvider>
        }
      ></Route>
    </Routes>
  );
}
