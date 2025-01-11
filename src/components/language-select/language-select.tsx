import * as Ariakit from "@ariakit/react";
import * as Flag from "country-flag-icons/react/3x2";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import "./language-select.css";

type LanguageSelectProps = {
  siteLanguage: string;
};

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
    id: "en",
    languageName: "English",
    countryName: "United States",
    flagElement: getFlagIcon("US"),
  },
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

const defaultLanguage = {
  id: "en",
  languageName: "English",
  countryName: "United States",
  flagElement: getFlagIcon("US"),
};

const LanguageSelect = ({
  siteLanguage: userLanguage,
}: LanguageSelectProps) => {
  const navigate = useNavigate();
  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage !== "en") {
      navigate(`/${newLanguage}`);
    } else {
      navigate(`/`);
    }
  };
  const currentLanguage =
    supportedLanguages.find((language) => {
      return language.id === userLanguage;
    }) ?? defaultLanguage;
  return (
    <form className="my-4 language-form">
      <label htmlFor="language-select" className="font-bold">
        <FormattedMessage defaultMessage="Language" id="language" />
      </label>
      <Ariakit.SelectProvider
        defaultValue={userLanguage}
        setValue={(newValue) => {
          handleLanguageChange(String(newValue));
        }}
        placement="bottom"
        value={currentLanguage.id}
      >
        <Ariakit.Select
          className="language-select select-button button"
          id="language-select"
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
                {language.languageName}{" "}
                {language.countryName ? `(${language.countryName})` : ""}
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </form>
  );
};

export default LanguageSelect;
