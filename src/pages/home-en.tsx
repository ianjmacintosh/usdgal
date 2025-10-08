import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { getMessage, I18nProvider } from "@/context/i18n.tsx";
import { useLoaderData } from "react-router";
import { getExchangeRateData } from "@/utils/exchange-rate-data.server";

export async function loader() {
  const exchangeRateData = await getExchangeRateData();
  return { exchangeRateData };
}

const language = "en";

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
  const { exchangeRateData } = useLoaderData();
  return (
    <I18nProvider siteLanguage={language}>
      <Converter exchangeRateData={exchangeRateData} />
    </I18nProvider>
  );
}
