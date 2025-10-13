import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { getMessage, I18nProvider } from "@/context/i18n.tsx";
import {
  LoaderFunctionArgs,
  Params,
  useLoaderData,
  useParams,
} from "react-router";
import { isSupportedLanguage } from "@/utils/supported-languages.ts";
import { getExchangeRateData } from "@/utils/exchange-rate-data.server";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params?.lang && !isSupportedLanguage(params.lang)) {
    throw new Response(`Not Found: Invalid language '${params.lang}'`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const exchangeRateData = await getExchangeRateData();
  return { exchangeRateData };
}

export const links = ({ params }: { params?: Params<string> } = {}) => {
  return [
    ...defaultLinks(),
    {
      rel: "canonical",
      href: getMessage({
        id: "meta_canonical_url",
        language: params?.lang ?? "en",
      }),
    },
  ];
};

export const meta = ({ params }: { params?: Params<string> } = {}) => {
  return [...getMetaTags(params?.lang ?? "en")];
};

export const handle = ({ params }: { params?: Params<string> } = {}) => {
  return {
    lang: params?.lang ?? "en",
  };
};

export default function Component() {
  const { exchangeRateData } = useLoaderData<typeof loader>();
  const { lang } = useParams();

  return (
    <I18nProvider siteLanguage={lang ?? "en"}>
      <Converter exchangeRateData={exchangeRateData} />
    </I18nProvider>
  );
}
