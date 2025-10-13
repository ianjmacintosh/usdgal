import "./language-alert.css";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { I18nProvider, useI18n } from "@/context/i18n";
import { getClosestSupportedLanguage } from "@/utils/supported-languages";
import { useLocalStorage } from "@/utils/use-local-storage";
import TranslateIcon from "@/assets/translate.svg?react";

const LanguageAlert = () => {
  const {
    state: { userLanguage, siteLanguage },
  } = useI18n();
  const closeButtonElement = useRef<HTMLButtonElement | null>(null);
  // Guess the best language for the visitor based on their browser settings
  const bestSupportedLanguageId = getClosestSupportedLanguage(userLanguage).id;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMessage();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const [preferredLanguageId, setPreferredLanguageId] = useLocalStorage(
    "preferredLanguageId",
    bestSupportedLanguageId,
  );

  // Store the name of that language and the site path
  const preferredLanguagePath =
    getClosestSupportedLanguage(preferredLanguageId).path;

  // Only offer a translation if the site language is both...
  // - Not one the user has suggested they want by dismissing the alert
  // - Not our idea of the best language to show them based on their system settings and our supported languages
  const [wrongLanguage, setWrongLanguage] = useState(
    siteLanguage !== preferredLanguageId,
  );

  useEffect(() => {
    setWrongLanguage(siteLanguage !== preferredLanguageId);
  }, [siteLanguage, preferredLanguageId]);
  const closeMessage = () => {
    // Update the user's preferred language; if they want to see the site in the language they're seeing it in, leave them alone
    setPreferredLanguageId(siteLanguage);

    // If the close button is focused (it might not be if the user dismissed the alert with the escape key), clear it!
    // You cannot hide a parent element that contains a focused child element
    if (closeButtonElement.current) {
      closeButtonElement.current.blur();
    }
  };

  return (
    <I18nProvider siteLanguage={preferredLanguageId}>
      <div
        className="language-alert"
        role="alert"
        aria-labelledby="language-alert-label"
        aria-hidden={!wrongLanguage}
        lang={preferredLanguageId}
      >
        <figure className="translate-icon">
          <TranslateIcon height={20} width={20} />
        </figure>
        <main>
          <a href={preferredLanguagePath}>
            <p id="language-alert-label">
              <FormattedMessage id="languageAlertText" />
            </p>
          </a>
        </main>
        <button
          type="button"
          aria-label="Close"
          className="close-button"
          onClick={closeMessage}
          ref={closeButtonElement}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 44 44"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M0.549989 4.44999L4.44999 0.549988L43.45 39.55L39.55 43.45L0.549989 4.44999Z" />
            <path d="M39.55 0.549988L43.45 4.44999L4.44999 43.45L0.549988 39.55L39.55 0.549988Z" />
          </svg>
        </button>
      </div>
    </I18nProvider>
  );
};

export default LanguageAlert;
