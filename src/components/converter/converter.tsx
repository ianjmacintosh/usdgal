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
  initialGasPrices,
} from "@/contexts/gas-price-context";

type ConverterProps = {
  userLanguage: string;
};

function Converter({ userLanguage }: ConverterProps) {
  const intl = useIntl();

  const [gasPrices, dispatch] = useReducer(gasPricesReducer, initialGasPrices);

  // useEffect(() => {
  //   async function startFetching() {
  //     let countryCode = await fetchCountryCode();
  //     if (!ignore) {
  //       // If the user is in their home country, let's guess where they want to go
  //       if (countryCode === userHomeCountry) {
  //         countryCode = userHomeCountry === "US" ? "MX" : "US";
  //       }
  //       const currency = getCurrencyByCountry(countryCode);
  //       const units = getUnitsByCountry(countryCode);
  //       setTopCurrency(currency);
  //       setTopUnit(units as Units);
  //     }
  //   }

  //   let ignore = false;
  //   startFetching();
  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

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
            />

            <h2 className="text-3xl font-bold my-4">
              <FormattedMessage id="convertedGasCost" />
            </h2>
            <GasPrice
              label={intl.formatMessage({ id: "convertedGasCost" })}
              gasPricesKey="bottom"
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
