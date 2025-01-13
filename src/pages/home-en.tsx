import { createIntl } from "react-intl";
import { defaultLinks } from "./home-defaults.ts";
import en from "../languages/en.ts";
import Converter from "@/components/converter/converter.tsx";
import { I18nProvider } from "@/context/i18n.tsx";

const language = "en";

const intl = createIntl({
  locale: language,
  messages: en,
});

export const links = () => {
  return [...defaultLinks(), { rel: "canonical", href: "https://gasco.st/" }];
};

export function meta() {
  return [
    { title: intl.formatMessage({ id: "meta_title" }) },
    {
      property: "og:title",
      content: intl.formatMessage({ id: "meta_title" }),
    },
    {
      name: "description",
      content: intl.formatMessage({ id: "meta_description" }),
    },
  ];
}

export default function Component() {
  return (
    <I18nProvider siteLanguage={language}>
      <Converter userLocation="US" />
    </I18nProvider>
  );
}
