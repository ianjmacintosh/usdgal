import { useI18n } from "@/context/i18n";
import "./language-alert.css";

const LanguageAlert = () => {
  const {
    state: { userLanguage, siteLanguage },
  } = useI18n();

  const displayMessage = userLanguage.indexOf(siteLanguage) === -1;

  return (
    displayMessage && (
      <aside className="language-alert" role="alert">
        <button type="button" aria-label="Close" className="close-button">
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
            <a href="/">Go to the American English site</a>
          </p>
        </main>
      </aside>
    )
  );
};

export default LanguageAlert;
