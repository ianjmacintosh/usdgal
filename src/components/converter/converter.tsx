import { useReducer } from "react";
import "./converter.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback/error-fallback";

import GasPrice from "@/components/gas-price/gas-price";
import ConversionTable from "@/components/conversion-table/conversion-table";
import exchangeRateData from "@/utils/exchange-rate-data";
import { FormattedMessage, useIntl } from "react-intl";
import {
  GasPricesContext,
  GasPricesDispatchContext,
  gasPricesReducer,
  getInitialGasPrices,
} from "@/context/gas-price-context";
import Footer from "@/components/footer/footer";
import { useI18n } from "@/context/i18n";

type ConverterProps = {
  userLanguage?: string;
  userLocation: string;
};

/**
 * The main component of the gas price converter.
 *
 * @param {Object} props - Component props
 * @param {string} props.siteLanguage - The site's language (e.g., "en")
 * @param {string} props.userLanguage - The user's browser's language (e.g., "en-US")
 * @param {string} props.userLocation - The user's location based on geolocation (e.g., "HN")
 *
 * @returns {JSX.Element} The main component of the gas price converter
 */
function Converter({
  userLanguage = navigator.language,
  userLocation,
}: ConverterProps) {
  const {
    state: { siteLanguage },
  } = useI18n();
  const intl = useIntl();

  // Guess the user's home country based on the second part of their browser's language code (`navigator.language`),
  // (e.g., "en-US" -> "US")
  const userLanguageCountry = userLanguage.split("-")[1];

  // The `gasPrices` object contains the top and bottom gas prices and defines which gas price number is "driving" (and is responsible for the other)
  // The `dispatch` function is used to handle calls from the GasPrice component's child elements
  const [gasPrices, dispatch] = useReducer(
    // The gasPricesReducer method is what child elements use to update their parent gasPrices object
    gasPricesReducer,
    // getInitialGasPrices builds default conversion settings based on the user's geolocation and browser language
    getInitialGasPrices(userLanguageCountry, userLocation),
  );

  return (
    <>
      <div className="container">
        {/* GasPricesContext.Provider provides the top & bottom gas cost, currency, and amount (per gallon/per liter) */}
        <GasPricesContext.Provider value={gasPrices}>
          <GasPricesDispatchContext.Provider value={dispatch}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <h2 className="text-3xl font-bold my-4">
                <FormattedMessage id="gasCost" />
              </h2>
              {/* This <GasPrice /> component gives us the "top" number, currency, and unit -- what we're converting from */}
              <GasPrice
                label={intl.formatMessage({ id: "gasCost" })}
                gasPricesKey="top"
                siteLanguage={siteLanguage}
              />

              <h2 className="text-3xl font-bold my-4">
                <FormattedMessage id="convertedGasCost" />
              </h2>

              {/* This <GasPrice /> component gives us the "bottom" number, currency, and unit -- what we're converting to */}
              <GasPrice
                label={intl.formatMessage({ id: "convertedGasCost" })}
                gasPricesKey="bottom"
                siteLanguage={siteLanguage}
              />
            </ErrorBoundary>
          </GasPricesDispatchContext.Provider>
        </GasPricesContext.Provider>

        {/* This paragraph displays when the exchange rates were last converted */}
        <p className="my-2 text-sm">
          <em>
            <FormattedMessage id="exchangeRatesLastUpdated" />{" "}
            {Intl.DateTimeFormat(siteLanguage, {
              dateStyle: "medium",
            }).format(exchangeRateData.timestamp * 1000) ?? "Unknown"}
          </em>
        </p>

        {/* The "Conversion Table" explains in detail how we came up with the gas price conversion */}
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

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Footer siteLanguage={siteLanguage} />
      </ErrorBoundary>
    </>
  );
}

export default Converter;
