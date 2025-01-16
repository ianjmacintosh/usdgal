import { useI18n } from "@/context/i18n";
import "./language-alert.css";

const LanguageAlert = () => {
  const {
    state: { userLanguage, siteLanguage },
  } = useI18n();

  const displayMessage = userLanguage.indexOf(siteLanguage) === -1;

  return (
    displayMessage && (
      <div className="language-alert">
        <p>
          This site is in Spanish, but your system preferences are set to
          English.
        </p>
        <p>
          <a href="/">Go to the American English site</a>
        </p>
      </div>
    )
  );
};

export default LanguageAlert;
