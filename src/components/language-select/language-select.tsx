import * as Ariakit from "@ariakit/react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import "./language-select.css";
import * as Flag from "country-flag-icons/react/3x2";
import { supportedLanguages } from "@/utils/supported-languages";
import { useState } from "react";

type LanguageSelectProps = {
  siteLanguage: string;
};

// LanguageSelect component: Renders the language select dropdown and handles language changes
const LanguageSelect = ({ siteLanguage }: LanguageSelectProps) => {
  // getFlagIcon function: Maps country codes to flag icons
  const getFlagIcon = (country: string) => {
    switch (country) {
      case "US":
        return <Flag.US height={14} aria-hidden="true" />;
      case "DE":
        return <Flag.DE height={14} aria-hidden="true" />;
      case "IN":
        return <Flag.IN height={14} aria-hidden="true" />;
      case "BR":
        return <Flag.BR height={14} aria-hidden="true" />;
      case "MX":
        return <Flag.MX height={14} aria-hidden="true" />;
      default:
        return <Flag.EU height={14} aria-hidden="true" />;
    }
  };

  const navigate = useNavigate();
  // handleLanguageChange function: Handles language changes by navigating to its URL
  const handleLanguageChange = (newLanguageId: string) => {
    if (newLanguageId === currentLanguage.id) return;

    const newLanguage = supportedLanguages.find(
      ({ id }) => id === newLanguageId,
    );
    if (newLanguage === undefined) return;

    setCurrentLanguage(newLanguage);
    // The site's English version has a special URL ("/" instead of "/en")
    const newPath =
      supportedLanguages.find(({ id }) => id === newLanguageId)?.path || "/";
    navigate(newPath);
  };
  const [currentLanguage, setCurrentLanguage] = useState(
    supportedLanguages.find(({ id }) => id === siteLanguage) ||
      supportedLanguages[0],
  );
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
          handleLanguageChange(newValue);
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
            {getFlagIcon(currentLanguage.countryCode)}
            {currentLanguage.languageName}
          </span>
          <Ariakit.SelectArrow className="chevron" />
        </Ariakit.Select>
        <Ariakit.SelectPopover
          gutter={4}
          className="popover language-popover"
          unmountOnHide={true}
        >
          {supportedLanguages.map(
            ({ id, countryCode, languageName, countryName }) => {
              return (
                <Ariakit.SelectItem
                  className={`select-item ${id === currentLanguage.id ? "selected" : ""}`}
                  key={id}
                  value={id}
                  id={id}
                  lang={id} // This is useful for screen readers; we're about to render text in a different language
                >
                  {currentLanguage.id === id ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    ""
                  )}
                  {getFlagIcon(countryCode)}
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
