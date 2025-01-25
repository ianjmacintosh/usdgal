import { I18nProvider, useI18n } from "@/context/i18n";
import "./language-alert.css";
import { useState } from "react";
import { getClosestSupportedLanguage } from "@/utils/supported-languages";
import { FormattedMessage } from "react-intl";
import { useLocalStorage } from "@/utils/use-local-storage";

const LanguageAlert = () => {
  const {
    state: { userLanguage, siteLanguage },
  } = useI18n();
  // Guess the best language for the visitor based on their browser settings
  const bestSupportedLanguageId = getClosestSupportedLanguage(userLanguage).id;

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
  const [showMessage, setShowMessage] = useState(
    siteLanguage !== preferredLanguageId,
  );

  const closeMessage = () => {
    // Store the user's preferred language in local storage
    setPreferredLanguageId(siteLanguage);

    // Dismiss the message (it won't come back again)
    setShowMessage(false);
  };

  return (
    showMessage && (
      <I18nProvider siteLanguage={preferredLanguageId}>
        <aside className="language-alert" role="alert">
          <button
            type="button"
            aria-label="Close"
            className="close-button"
            onClick={closeMessage}
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
          <main>
            <p>
              <a href={preferredLanguagePath}>
                <FormattedMessage id="languageAlertText" />
              </a>
            </p>
          </main>
        </aside>
      </I18nProvider>
    )
  );
};

export default LanguageAlert;
