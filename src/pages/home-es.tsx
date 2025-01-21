import { defaultLinks, getMetaTags } from "./home-defaults.ts";
import Converter from "@/components/converter/converter.tsx";
import { I18nProvider } from "@/context/i18n.tsx";

const language = "es";

export const links = () => {
  return [
    ...defaultLinks(),
    { rel: "canonical", href: "https://gasco.st/es/" },
  ];
};

export function meta() {
  return [
    ...getMetaTags(language),
    {
      property: "og:url",
      content: "https://gasco.st/",
    },
    {
      property: "og:image",
      content: "https://gasco.st/banner-es.png",
    },
    {
      property: "og:image:secure_url",
      content: "https://gasco.st/banner-es.png",
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
