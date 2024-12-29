import * as Ariakit from "@ariakit/react";
import * as Flag from "country-flag-icons/react/3x2";

const getFlagIcon = (country: string) => {
  switch (country) {
    case "US":
      return <Flag.US height={17} />;
    case "DE":
      return <Flag.DE height={17} />;
    case "IN":
      return <Flag.IN height={17} />;
    case "BR":
      return <Flag.BR height={17} />;
    case "MX":
      return <Flag.MX height={17} />;
    default:
      return <Flag.EU height={17} />;
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
    <Ariakit.SelectProvider
      defaultValue={userLanguage}
      setValue={(newValue) => {
        handleLanguageChange(String(newValue));
      }}
      value={currentLanguage.id}
    >
      <Ariakit.Select className="select-button button">
        <span className="current-value">
          {currentLanguage.flagElement} {currentLanguage.languageName}
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
            >
              {language.flagElement}
              {language.languageName} ({language.countryName})
            </Ariakit.SelectItem>
          );
        })}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  );
};

export default LanguageSelect;
