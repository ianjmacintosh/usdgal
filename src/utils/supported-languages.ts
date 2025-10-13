import en from "@/languages/en";
import es from "@/languages/es";
import de from "@/languages/de";
import hi from "@/languages/hi";
import pt from "@/languages/pt";

type LanguageObject = {
  id: string;
  languageName: string;
  countryName?: string;
  countryCode: string;
  path: string;
  messages: Record<string, string>;
};

export const supportedLanguages: LanguageObject[] = [
  // ⬇️ WARNING: The first language in this array will be the site language picker's value when we don't know what language they're using!!
  {
    id: "en",
    languageName: "English",
    countryName: "United States",
    countryCode: "US",
    path: "/",
    messages: en,
  },
  // ⬆️ WARNING: The first language in this array will be the site language picker's value when we don't know what language they're using!!
  {
    id: "de",
    languageName: "Deutsch",
    countryCode: "DE",
    path: "/de/",
    messages: de,
  },
  {
    id: "es",
    languageName: "Español",
    countryCode: "MX",
    path: "/es/",
    messages: es,
  },
  {
    id: "hi",
    languageName: "हिन्दी",
    countryCode: "IN",
    path: "/hi/",
    messages: hi,
  },
  {
    id: "pt",
    languageName: "Português",
    countryCode: "BR",
    path: "/pt/",
    messages: pt,
  },
];

export const isSupportedLanguage = (language: string) => {
  return supportedLanguages.some(({ id }) => id === language);
};

export const getClosestSupportedLanguage = (
  language: string | undefined,
): LanguageObject => {
  if (typeof language === "undefined") return supportedLanguages[0];
  return (
    // Try to find an exact match
    supportedLanguages.find(({ id }) => id === language) ||
    // Try to match just the first part
    supportedLanguages.find(({ id }) => id === language.split("-")[0]) ||
    // Worst case, deliver the default (English)
    supportedLanguages[0]
  );
};
