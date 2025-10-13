import "./language-alert.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "@/context/i18n";
import { getClosestSupportedLanguage } from "@/utils/supported-languages";
import TranslateIcon from "@/assets/translate.svg?react";

type LanguageAlertProps = {
  language: string;
  onDismiss?: () => void;
};

const LanguageAlert = ({ language, onDismiss }: LanguageAlertProps) => {
  const ANIMATION_DURATION = 400; // This must be kept in sync with the CSS
  const closeButtonElement = useRef<HTMLButtonElement | null>(null);

  // Store the name of that language and the site path
  const preferredLanguagePath = getClosestSupportedLanguage(language).path;

  // Only offer a translation if the site language is both...
  // - Not one the user has suggested they want by dismissing the alert
  // - Not our idea of the best language to show them based on their system settings and our supported languages
  const [wrongLanguage, setWrongLanguage] = useState(true);

  const closeMessage = useCallback(() => {
    setWrongLanguage(false);

    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, ANIMATION_DURATION);

    if (closeButtonElement.current) {
      closeButtonElement.current.blur();
    }
  }, [onDismiss]);

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
  }, [closeMessage]);

  return (
    <I18nProvider siteLanguage={language}>
      <div
        className="language-alert"
        role="alert"
        aria-labelledby="language-alert-label"
        aria-hidden={!wrongLanguage}
        lang={language}
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

export type { LanguageAlertProps };
export default LanguageAlert;
