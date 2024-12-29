import * as Ariakit from "@ariakit/react";
import * as Flag from "country-flag-icons/react/3x2";
import "./LanguageSelect.css";

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

const supportedLanguages = [
  {
    id: "en-US",
    languageName: "English",
    countryName: "United States",
    flagElement: getFlagIcon("US"),
  },
  {
    id: "es-MX",
    languageName: "Español",
    countryName: "México",
    flagElement: getFlagIcon("MX"),
  },
  {
    id: "pt-BR",
    languageName: "Português",
    countryName: "Brasil",
    flagElement: getFlagIcon("BR"),
  },
  {
    id: "de-DE",
    languageName: "Deutsch",
    countryName: "Deutschland",
    flagElement: getFlagIcon("DE"),
  },
  {
    id: "hi-IN",
    languageName: "हिन्दी",
    countryName: "भारत",
    flagElement: getFlagIcon("IN"),
  },
];

const defaultLanguage = {
  id: "en-US",
  languageName: "English",
  countryName: "United States",
  flagElement: getFlagIcon("US"),
};

const LanguageSelect = ({
  onLanguageChange: handleLanguageChange,
  userLanguage,
}: {
  onLanguageChange: (newValue: string) => void;
  userLanguage: string;
}) => {
  const currentLanguage =
    supportedLanguages.find((language) => {
      return language.id === userLanguage;
    }) ?? defaultLanguage;
  return (
    <form className="my-4 language-form">
      <Ariakit.SelectProvider
        defaultValue={userLanguage}
        setValue={(newValue) => {
          handleLanguageChange(String(newValue));
        }}
        value={currentLanguage.id}
      >
        <Ariakit.Select className="language-select select-button button">
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
          {supportedLanguages.map((language) => {
            return (
              <Ariakit.SelectItem
                className="select-item"
                key={language.id}
                value={language.id}
                id={language.id}
              >
                {currentLanguage.id === language.id ? "✓" : ""}
                {language.flagElement}
                {language.languageName} ({language.countryName})
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </form>
  );
};

export default LanguageSelect;
