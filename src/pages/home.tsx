import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { getMessage, I18nProvider } from "@/context/i18n.tsx";
import { useLoaderData, useParams } from "react-router";
import { supportedLanguages } from "@/utils/supported-languages.ts";
import { getExchangeRateData } from "@/utils/exchange-rate-data.server";

export async function loader() {
  const exchangeRateData = await getExchangeRateData();
  return { exchangeRateData };
}

export const links = ({ params }: { params: { lang?: string } }) => {
  const language = params.lang || "en";
  return [
    ...defaultLinks(),
    {
      rel: "canonical",
      href: getMessage({ id: "meta_canonical_url", language }),
    },
  ];
};

export function meta({ params }: { params: { lang?: string } }) {
  const language = params.lang || "en";
  return [...getMetaTags(language)];
}

export const handle = ({ params }: { params: { lang?: string } }) => {
  const language = params.lang || "en";
  const matchedLanguage = supportedLanguages.find(({ id }) => id === language);
  return {
    lang: matchedLanguage ? matchedLanguage.id : "en",
  };
};

export default function Component() {
  const { exchangeRateData } = useLoaderData();

  const params = useParams();
  const langParam = params.lang || "en";
  const matchedLanguage = supportedLanguages.find(({ id }) => id === langParam);
  const language = matchedLanguage ? matchedLanguage.id : "en";

  return (
    <I18nProvider siteLanguage={language}>
      <Converter exchangeRateData={exchangeRateData} />
    </I18nProvider>
  );
}
