import { Navigate, Route, Routes } from "react-router";
import { I18nWrapper } from "@/components/i18n-wrapper/i18n-wrapper";

export default function App() {
  return (
    <Routes>
      <Route index element={<I18nWrapper siteLanguage="en" />}></Route>
      <Route path="en" element={<Navigate to="/" />}></Route>
      <Route path="de" element={<I18nWrapper siteLanguage="de" />}></Route>
      <Route path="es" element={<I18nWrapper siteLanguage="es" />}></Route>
      <Route path="hi" element={<I18nWrapper siteLanguage="hi" />}></Route>
      <Route path="pt" element={<I18nWrapper siteLanguage="pt" />}></Route>
    </Routes>
  );
}
