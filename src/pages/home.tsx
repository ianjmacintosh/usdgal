import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { getMessage, I18nProvider } from "@/context/i18n.tsx";
import { useLoaderData, useParams } from "react-router";
import { isSupportedLanguage } from "@/utils/supported-languages.ts";
import { getExchangeRateData } from "@/utils/exchange-rate-data.server";

export async function loader() {
  const exchangeRateData = await getExchangeRateData();
  return { exchangeRateData };
}

export const links = ({
  params = { lang: "en" },
}: { params?: { lang: string } } = {}) => {
  const language = isSupportedLanguage(params.lang) ? params.lang : "en";
  return [
    ...defaultLinks(),
    {
      rel: "canonical",
      href: getMessage({ id: "meta_canonical_url", language }),
    },
  ];
};

export function meta({
  params = { lang: "en" },
}: { params?: { lang: string } } = {}) {
  const language = isSupportedLanguage(params.lang) ? params.lang : "en";
  return [...getMetaTags(language)];
}

export const handle = ({
  params = { lang: "en" },
}: { params?: { lang: string } } = {}) => {
  const language = isSupportedLanguage(params.lang) ? params.lang : "en";
  return {
    lang: language,
  };
};

export default function Component() {
  const { exchangeRateData } = useLoaderData();

  const params = useParams();
  const language =
    params && params.lang && isSupportedLanguage(params.lang)
      ? params.lang
      : "en";

  return (
    <I18nProvider siteLanguage={language}>
      <Converter exchangeRateData={exchangeRateData} />
    </I18nProvider>
  );
}
