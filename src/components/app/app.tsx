import { Navigate, Route, Routes } from "react-router";
import { I18nWrapper } from "@/components/i18n-wrapper/i18n-wrapper";

export default function App() {
  return (
    <Routes>
      <Route index element={<I18nWrapper language="en" />}></Route>
      <Route path="en" element={<Navigate to="/" />}></Route>
      <Route path="de" element={<I18nWrapper language="de" />}></Route>
      <Route path="es" element={<I18nWrapper language="es" />}></Route>
      <Route path="hi" element={<I18nWrapper language="hi" />}></Route>
      <Route path="pt" element={<I18nWrapper language="pt" />}></Route>
    </Routes>
  );
}
