import { useReducer } from "react";
import GithubLogo from "@/assets/github.svg?react";
import "./converter.css";

import GasPrice from "@/components/gas-price/gas-price";
import ConversionTable from "@/components/conversion-table/conversion-table";
import exchangeRateData from "@/utils/exchange-rate-data";
import { FormattedMessage, useIntl } from "react-intl";
import LanguageSelect from "@/components/language-select/language-select";
import {
  GasPricesContext,
  GasPricesDispatchContext,
  gasPricesReducer,
  getInitialGasPrices,
} from "@/contexts/gas-price-context";

type ConverterProps = {
  userLanguage: string;
  userLocation: string;
};

function Converter({ userLanguage, userLocation }: ConverterProps) {
  const intl = useIntl();
  const userLanguageCountry = userLanguage.split("-")[1];

  const [gasPrices, dispatch] = useReducer(
    gasPricesReducer,
    getInitialGasPrices(userLanguageCountry, userLocation),
  );

  return (
    <>
      <div className="container">
        <GasPricesContext.Provider value={gasPrices}>
          <GasPricesDispatchContext.Provider value={dispatch}>
            <h2 className="text-3xl font-bold my-4">
              <FormattedMessage id="gasCost" />
            </h2>
            <GasPrice
              label={intl.formatMessage({ id: "gasCost" })}
              gasPricesKey="top"
              userLanguage={userLanguage}
            />

            <h2 className="text-3xl font-bold my-4">
              <FormattedMessage id="convertedGasCost" />
            </h2>
            <GasPrice
              label={intl.formatMessage({ id: "convertedGasCost" })}
              gasPricesKey="bottom"
              userLanguage={userLanguage}
            />
          </GasPricesDispatchContext.Provider>
        </GasPricesContext.Provider>
        <p className="my-2 text-sm">
          <em>
            <FormattedMessage id="exchangeRatesLastUpdated" />{" "}
            {Intl.DateTimeFormat(userLanguage, {
              dateStyle: "medium",
            }).format(exchangeRateData.timestamp * 1000) ?? "Unknown"}
          </em>
        </p>
        <ConversionTable
          topNumber={gasPrices.top.number}
          topCurrency={gasPrices.top.currency}
          topUnit={gasPrices.top.unit}
          bottomNumber={gasPrices.bottom.number}
          bottomCurrency={gasPrices.bottom.currency}
          bottomUnit={gasPrices.bottom.unit}
          exchangeRateData={exchangeRateData}
        />
      </div>
      <footer>
        <LanguageSelect userLanguage={userLanguage} />
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
        &copy; 2024{" "}
        <a href="https://www.ianjmacintosh.com/" target="_blank">
          Ian J. MacIntosh
        </a>
      </footer>
    </>
  );
}

export default Converter;
