import LanguageSelect from "@/components/language-select/language-select";
import "./footer.css";
import { FormattedMessage } from "react-intl";
import GithubLogo from "@/assets/github.svg?react";
import DocumentText from "@/assets/document-text.svg?react";

type FooterProps = {
  siteLanguage: string;
};

const Footer = ({ siteLanguage }: FooterProps) => {
  return (
    <footer>
      <LanguageSelect siteLanguage={siteLanguage} />
      <nav>
        <ul>
          {/* Link to article about building this app */}
          <li>
            <a
              href="https://www.ianjmacintosh.com/articles/introducing-gascost/"
              target="_blank"
            >
              <span>
                <FormattedMessage
                  id="aboutSite"
                  defaultMessage={"About this site"}
                />
              </span>
              <DocumentText height={18} width={18} className="link-icon" />
            </a>
          </li>
          {/* Link to source code */}
          <li>
            <a
              href="https://www.github.com/ianjmacintosh/usdgal"
              target="_blank"
            >
              <span>
                <FormattedMessage id="sourceCode" />
              </span>
              <GithubLogo height={18} width={18} className="link-icon" />
            </a>
          </li>
        </ul>
      </nav>
      <p>
        &copy; 2025{" "}
        <a href="https://www.ianjmacintosh.com/" target="_blank">
          Ian J. MacIntosh
        </a>
      </p>
    </footer>
  );
};

export default Footer;
