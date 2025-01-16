import { I18nProvider, useI18n } from "@/context/i18n";
import "./language-alert.css";
import { useState } from "react";
import { getClosestSupportedLanguage } from "../language-select/language-select";
import { FormattedMessage } from "react-intl";

const LanguageAlert = () => {
  const {
    state: { userLanguage, siteLanguage },
  } = useI18n();

  // Identify the most likely best site language we support for the visitor, based on their browser settings
  const bestSupportedLanguage = getClosestSupportedLanguage(userLanguage);

  // Store the name of that language and the site path
  const newSitePath = bestSupportedLanguage?.path;

  // If the current site language isn't currently what we identified as best for them, show the message
  const [showMessage, setShowMessage] = useState(
    siteLanguage !== bestSupportedLanguage.id,
  );

  const closeMessage = () => {
    setShowMessage(false);
  };

  return (
    showMessage && (
      <I18nProvider siteLanguage={bestSupportedLanguage.id}>
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
              <a href={newSitePath}>
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
