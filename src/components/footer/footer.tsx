import LanguageSelect from "@/components/language-select/language-select";
import { FormattedMessage } from "react-intl";
import GithubLogo from "@/assets/github.svg?react";

type FooterProps = {
  siteLanguage: string;
};

const Footer = ({ siteLanguage }: FooterProps) => {
  return (
    <footer>
      <LanguageSelect siteLanguage={siteLanguage} />
      <nav>
        <ul>
          <li>
            <a
              href="https://www.github.com/ianjmacintosh/usdgal"
              target="_blank"
            >
              <span>
                <FormattedMessage id="sourceCode" />
              </span>
              <GithubLogo height={18} width={18} />
            </a>
          </li>
        </ul>
      </nav>
      &copy; 2025{" "}
      <a href="https://www.ianjmacintosh.com/" target="_blank">
        Ian J. MacIntosh
      </a>
    </footer>
  );
};

export default Footer;
