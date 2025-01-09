import Converter from "../converter/converter.tsx";
import "@/pages/home.css";
import { IntlProvider } from "react-intl";
import en from "@/languages/en.ts";
import es from "@/languages/es.ts";
import pt from "@/languages/pt.ts";
import hi from "@/languages/hi.ts";
import de from "@/languages/de.ts";
import { getInitialGasPrices } from "@/contexts/gas-price-context.ts";
import { fetchCountryCode } from "@/utils/api.ts";
import { useEffect, useState } from "react";

type I18nWrapperProps = { language: string };

const getMessages = (language: string) => {
  // Why does FormatJS want consumers handling this logic? RFC-5646 is complicated:
  // https://datatracker.ietf.org/doc/html/rfc5646

  // Language without region; 2 chars as defined in ISO 639-1
  const languageAsTwoChars = language.split("-")[0];

  const messageFiles = {
    en: en,
    es: es,
    pt: pt,
    hi: hi,
    de: de,
  };

  // TODO: An more elegant way to do this would maybe use matchSorter

  // First, if we've got an exact language match, use it
  if (Object.keys(messageFiles).includes(language)) {
    return messageFiles[language as keyof typeof messageFiles];

    // But if we don't have an exact match, try to use the language by itself
  } else if (Object.keys(messageFiles).includes(languageAsTwoChars)) {
    return messageFiles[languageAsTwoChars as keyof typeof messageFiles];

    // If that doesn't work, default to English
  } else {
    return messageFiles["en"];
  }
};

export function I18nWrapper({ language }: I18nWrapperProps) {
  // The "language" prop indicates what language the site is displayed in
  // The "userLanguage" variable indicates what language the user's browser is set to
  const userLanguage = navigator.language;

  const [geolocation, setGeolocation] = useState(null);

  useEffect(() => {
    // If we already have geolocated the user, return early
    if (geolocation) return;

    async function startFetching() {
      const countryCode = await fetchCountryCode();
      if (!ignore) {
        setGeolocation(countryCode);
      }
      // Change this to set a value in context that may be read when a consumer calls getInitialGasPrices
      return getInitialGasPrices;
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <IntlProvider
        locale={language}
        messages={getMessages(language)}
        defaultLocale="en"
      >
        {geolocation && (
          <Converter userLanguage={userLanguage} userLocation={geolocation} />
        )}
      </IntlProvider>
    </>
  );
}
