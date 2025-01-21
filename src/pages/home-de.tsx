import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { getMessage, I18nProvider } from "@/context/i18n.tsx";

const language = "de";

export const links = () => {
  return [
    ...defaultLinks(),
    {
      rel: "canonical",
      href: getMessage({ id: "meta_canonical_url", language }),
    },
  ];
};

export function meta() {
  return [...getMetaTags(language)];
}

export default function Component() {
  return (
    <I18nProvider siteLanguage={language}>
      <Converter />
    </I18nProvider>
  );
}
