import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { IntlProvider } from "react-intl";
import en from "./languages/en.ts";
import es from "./languages/es.ts";
import pt from "./languages/pt.ts";
import hi from "./languages/hi.ts";

const userLanguage = navigator.language || "en-US";

const getMessages = (language: string) => {
  // Why does FormatJS want consumers handling this logic? RFC-5646 is complicated:
  // https://datatracker.ietf.org/doc/html/rfc5646

  // Language without region; 2 chars as defined in ISO 639-1
  const languageAsTwoChars = userLanguage.split("-")[0];

  const messageFiles = {
    en: en,
    es: es,
    pt: pt,
    hi: hi,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IntlProvider
      locale={userLanguage}
      messages={getMessages(userLanguage)}
      defaultLocale="en"
    >
      <App />
    </IntlProvider>
  </StrictMode>,
);
