import * as Ariakit from "@ariakit/react";
import * as Flag from "country-flag-icons/react/3x2";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import "./language-select.css";

type LanguageSelectProps = {
  siteLanguage: string;
};

// getFlagIcon function: Maps country codes to flag icons
const getFlagIcon = (country: string) => {
  switch (country) {
    case "US":
      return <Flag.US height={14} />;
    case "DE":
      return <Flag.DE height={14} />;
    case "IN":
      return <Flag.IN height={14} />;
    case "BR":
      return <Flag.BR height={14} />;
    case "MX":
      return <Flag.MX height={14} />;
    default:
      return <Flag.EU height={14} />;
  }
};

// supportedLanguages array: List of supported languages, with the first language being the default site language
const supportedLanguages = [
  // ⬇️ WARNING: The first language in this array will be the site language picker's value when we don't know what language they're using!!
  {
    id: "en",
    languageName: "English",
    countryName: "United States",
    flagElement: getFlagIcon("US"),
  },
  // ⬆️ WARNING: The first language in this array will be the site language picker's value when we don't know what language they're using!!
  {
    id: "de",
    languageName: "Deutsch",
    flagElement: getFlagIcon("DE"),
  },
  {
    id: "es",
    languageName: "Español",
    flagElement: getFlagIcon("MX"),
  },
  {
    id: "hi",
    languageName: "हिन्दी",
    flagElement: getFlagIcon("IN"),
  },
  {
    id: "pt",
    languageName: "Português",
    flagElement: getFlagIcon("BR"),
  },
];

// LanguageSelect component: Renders the language select dropdown and handles language changes
const LanguageSelect = ({ siteLanguage }: LanguageSelectProps) => {
  const navigate = useNavigate();
  // handleLanguageChange function: Handles language changes by navigating to its URL
  const handleLanguageChange = (newLanguage: string) => {
    // The site's English version has a special URL ("/" instead of "/en")
    if (newLanguage !== "en") {
      navigate(`/${newLanguage}`);
    } else {
      navigate(`/`);
    }
  };
  const currentLanguage =
    supportedLanguages.find(({ id }) => id === siteLanguage) ||
    supportedLanguages[0];
  return (
    <form className="my-4 language-form">
      <label
        htmlFor="language-select"
        className="font-bold"
        id="language-label"
      >
        <FormattedMessage defaultMessage="Language" id="language" />
      </label>
      <Ariakit.SelectProvider
        defaultValue={siteLanguage}
        setValue={(newValue) => {
          handleLanguageChange(String(newValue));
        }}
        placement="bottom"
        value={currentLanguage.id}
      >
        <Ariakit.Select
          className="language-select select-button button"
          id="language-select"
          aria-labelledby="language-label"
        >
          <span className="current-value">
            {currentLanguage.flagElement}
            {currentLanguage.languageName}
          </span>
          <Ariakit.SelectArrow className="chevron" />
        </Ariakit.Select>
        <Ariakit.SelectPopover
          gutter={4}
          className="popover unit-popover"
          unmountOnHide={true}
        >
          {supportedLanguages.map(
            ({ id, flagElement, languageName, countryName }) => {
              return (
                <Ariakit.SelectItem
                  className="select-item"
                  key={id}
                  value={id}
                  id={id}
                >
                  {currentLanguage.id === id ? "✓" : ""}
                  {flagElement}
                  {languageName} {countryName ? `(${countryName})` : ""}
                </Ariakit.SelectItem>
              );
            },
          )}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </form>
  );
};

export default LanguageSelect;
