// Create a new context to contain values for: site language, user language, and user location
// Follow KCD's [recommendations](https://kentcdodds.com/blog/how-to-use-react-context-effectively):
// * Export functional component to be used as a context provider
// * Export a custom hook to access context properties ([read more](https://kentcdodds.com/blog/how-to-use-react-context-effectively#the-custom-consumer-hook))
//   * Throw error when used outside provider
// * Use TypeScript union type to support creating a context with undefined initial value
// * Support async "user location" lookup via [helper function](https://kentcdodds.com/blog/how-to-use-react-context-effectively#what-about-async-actions)

import { createContext, useReducer } from "react";

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
};

const defaultState = {
  siteLanguage: "en",
  userLanguage: "en-US",
  userLocation: null,
};

const I18StateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined); // KCD-approved! https://kentcdodds.com/blog/how-to-use-react-context-effectively#typescript

const I18nReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setSiteLanguage":
      return { ...state, siteLanguage: action.payload };
    case "setUserLanguage":
      return { ...state, userLanguage: action.payload };
    case "setUserLocation":
      return { ...state, userLocation: action.payload };
    default:
      return state;
  }
};

const I18nProvider = ({ children }: I18nProviderProps) => {
  const [state, dispatch] = useReducer(I18nReducer, defaultState);
  const value = { state, dispatch };
  return (
    <I18StateContext.Provider value={value}>
      {children}
    </I18StateContext.Provider>
  );
};

export { I18nProvider };
