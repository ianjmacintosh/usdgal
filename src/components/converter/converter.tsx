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
} from "@/contexts/gas-price-context";
import Footer from "../footer/footer";

type ConverterProps = {
  siteLanguage: string;
  userLanguage: string;
  userLocation: string;
};

function Converter({
  siteLanguage,
  userLanguage,
  userLocation,
}: ConverterProps) {
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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <h2 className="text-3xl font-bold my-4">
                <FormattedMessage id="gasCost" />
              </h2>
              <GasPrice
                label={intl.formatMessage({ id: "gasCost" })}
                gasPricesKey="top"
                userLanguage={userLanguage}
              />
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <h2 className="text-3xl font-bold my-4">
                <FormattedMessage id="convertedGasCost" />
              </h2>
              <GasPrice
                label={intl.formatMessage({ id: "convertedGasCost" })}
                gasPricesKey="bottom"
                userLanguage={userLanguage}
              />
            </ErrorBoundary>
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

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Footer siteLanguage={siteLanguage} />
      </ErrorBoundary>
    </>
  );
}

export default Converter;
