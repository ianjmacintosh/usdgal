import { createIntl } from "react-intl";
import { defaultLinks } from "./home-defaults.ts";
import es from "../languages/es.ts";
import Converter from "@/components/converter/converter.tsx";
import { I18nProvider } from "@/context/i18n.tsx";

const language = "es";

const intl = createIntl({
  locale: language,
  messages: es,
});

export const links = () => {
  return [
    ...defaultLinks(),
    { rel: "canonical", href: "https://gasco.st/es/" },
  ];
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
    {
      property: "og:image",
      content: "https://gasco.st/banner-es.png",
    },
    {
      property: "og:image:secure_url",
      content: "https://gasco.st/banner-es.png",
    },
    {
      property: "og:image:type",
      content: "image/png",
    },
    {
      property: "og:image:width",
      content: "1920",
    },
    {
      property: "og:image:height",
      content: "1080",
    },
  ];
}

export default function Component() {
  return (
    <I18nProvider siteLanguage={language}>
      <Converter />
    </I18nProvider>
  );
}
