// Create a new context to contain values for: site language, user language, and user location
// Follow KCD's [recommendations](https://kentcdodds.com/blog/how-to-use-react-context-effectively):
// * Export functional component to be used as a context provider
// * Export a custom hook to access context properties ([read more](https://kentcdodds.com/blog/how-to-use-react-context-effectively#the-custom-consumer-hook))
//   * Throw error when used outside provider
// * Use TypeScript union type to support creating a context with undefined initial value
// * Support async "user location" lookup via [helper function](https://kentcdodds.com/blog/how-to-use-react-context-effectively#what-about-async-actions)

import { fetchCountryCode } from "@/utils/api";
import { createContext, useContext, useReducer } from "react";
import { createIntl, IntlProvider } from "react-intl";
import en from "@/languages/en.ts";
import es from "@/languages/es.ts";
import pt from "@/languages/pt.ts";
import hi from "@/languages/hi.ts";
import de from "@/languages/de.ts";

type Action = {
  type: "setSiteLanguage" | "setUserLanguage" | "setUserLocation";
  payload: string;
};
type Dispatch = (action: Action) => void;
type State = {
  siteLanguage: string; // e.g., "pt"; TODO: Possible values for this should come from supportedLanguages
  userLanguage: string; // e.g., "pt-BR" (could come from navigator.language if available -- or default to siteLanguage if unavailable like during build)
  userLocation: string | null; // e.g., "BR" (comes from geolocation, maybe `null` before endpoint responds)
};

type I18nProviderProps = {
  children: React.ReactNode;
  siteLanguage: string;
  userLanguage?: string; // Only used for testing
  userLocation?: string; // Only used for testing -- bypasses geolocation
};

const I18nContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

const i18nReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setSiteLanguage":
      return { ...state, siteLanguage: action.payload };
    case "setUserLanguage":
      return { ...state, userLanguage: action.payload };
    case "setUserLocation":
      return { ...state, userLocation: action.payload };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

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

type GetMessageProps = {
  id: string;
  language: string;
};

export const getMessage = ({ id, language }: GetMessageProps) => {
  const intl = createIntl({
    locale: language,
    messages: getMessages(language),
  });

  return intl.formatMessage({
    id,
  });
};

const I18nProvider = ({
  siteLanguage,
  children,
  userLocation: userLocationProp,
  userLanguage: userLanguageProp,
}: I18nProviderProps) => {
  const initialState: State = {
    siteLanguage: "en",
    userLanguage: userLanguageProp || navigator?.language || "en-US",
    userLocation: userLocationProp || null,
  };

  const [state, dispatch] = useReducer(i18nReducer, {
    ...initialState,
    siteLanguage,
  });
  const value = { state, dispatch };

  initializeUserLocation(dispatch, state);

  return (
    <I18nContext.Provider value={value}>
      <IntlProvider
        locale={state.siteLanguage}
        messages={getMessages(state.siteLanguage)}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within a I18nProvider");
  }
  return context;
};

const initializeUserLocation = (dispatch: Dispatch, state: State) => {
  async function startFetching() {
    const countryCode = await fetchCountryCode();
    dispatch({ type: "setUserLocation", payload: countryCode });
  }
  if (state.userLocation === null) {
    startFetching();
  }
};

export { I18nProvider, useI18n, initializeUserLocation };
