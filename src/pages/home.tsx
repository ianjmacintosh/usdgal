import {
  defaultLinks,
  getMetaTags,
} from "../utils/remix-page-attribute-helpers.ts";
import Converter from "@/components/converter/converter.tsx";
import { I18nProvider } from "@/context/i18n.tsx";
import {
  ClientLoaderFunctionArgs,
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

// clientLoader runs on the client during client-side navigation
// It uses the serverLoader data from the initial page load/prerender
// This prevents trying to refetch data from a non-existent server on static sites
export async function clientLoader({
  params,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  if (params?.lang && !isSupportedLanguage(params.lang)) {
    throw new Response(`Not Found: Invalid language '${params.lang}'`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // Return the data from the server loader (prerendered data)
  // This avoids making additional fetch requests during client-side navigation
  return serverLoader();
}

// Tell React Router to hydrate from the server data
clientLoader.hydrate = true as const;

export const links = () => {
  return [...defaultLinks()];
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
