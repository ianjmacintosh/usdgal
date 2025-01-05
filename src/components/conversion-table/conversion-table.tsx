import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./conversion-table.css";

type SupportedUnits = "liter" | "gallon";

const volumesInLiters = {
  // TODO: This "" key is because we may get "" when the parent is initializing
  "": 0,
  liter: 1,
  gallon: 3.78541,
};

const ConversionTable = ({
  topNumber,
  bottomNumber,
  topUnit,
  bottomUnit,
  topCurrency = "",
  bottomCurrency,
  exchangeRateData,
}: {
  topNumber: number;
  bottomNumber: number;
  topUnit: SupportedUnits | "";
  bottomUnit: SupportedUnits | "";
  topCurrency: string;
  bottomCurrency: string;
  exchangeRateData: {
    base: string;
    date: string;
    rates: { [key: string]: number };
    success: boolean;
    timestamp: number;
  };
}) => {
  const intl = useIntl();

  const [showDetails, setShowDetails] = useState(false);
  const sourceCurrencyAbsoluteCost =
    exchangeRateData.rates[topCurrency === "" ? "USD" : topCurrency] ?? 1;
  const targetCurrencyAbsoluteCost =
    exchangeRateData.rates[bottomCurrency] ?? 1;

  const sourceVolumeInLiters = volumesInLiters[topUnit];
  const targetVolumeInLiters = volumesInLiters[bottomUnit];

  if (
    topCurrency === "" ||
    bottomCurrency === "" ||
    topUnit === "" ||
    bottomUnit === ""
  ) {
    return null;
  }

  return (
    <>
      <button
        className="details-button"
        onClick={() => {
          const newValue = !showDetails;

          setShowDetails(newValue);
        }}
      >
        {showDetails
          ? intl.formatMessage({ id: "hideDetails" })
          : intl.formatMessage({ id: "showDetails" })}
      </button>
      <ul
        className={`details ${showDetails ? "visible" : ""}`}
        aria-hidden={!showDetails}
        aria-label={intl.formatMessage({ id: "conversionDetails" })}
      >
        <li style={{ "--i": 0 } as React.CSSProperties}>
          <label id="cost-label">
            <FormattedMessage id="cost" />
          </label>
          <span aria-labelledby="cost-label">
            <FormattedMessage
              id="gasPriceFormula"
              values={{
                number: topNumber,
                currency: topCurrency,
                unit: topUnit,
              }}
            />
          </span>
        </li>

        {/* Only show conversion rates if the currencies are different */}
        {topCurrency !== bottomCurrency && (
          <li style={{ "--i": 1 } as React.CSSProperties}>
            <label id="currency-conversion-rate-label">
              <FormattedMessage id="currencyConversionRate" />
            </label>
            <span aria-labelledby="currency-conversion-rate-label">
              {sourceCurrencyAbsoluteCost > targetCurrencyAbsoluteCost
                ? `${sourceCurrencyAbsoluteCost / targetCurrencyAbsoluteCost} ${topCurrency} = 1 ${bottomCurrency}`
                : `1 ${topCurrency} = ${targetCurrencyAbsoluteCost / sourceCurrencyAbsoluteCost} ${bottomCurrency}`}
            </span>
          </li>
        )}

        {/* Only show volume conversion rates if the units are different */}
        {topUnit !== bottomUnit && (
          <li style={{ "--i": 2 } as React.CSSProperties}>
            <label id="volume-conversion-rate-label">
              <FormattedMessage id="volumeConversionRate" />
            </label>
            <span aria-labelledby="volume-conversion-rate-label">
              {targetVolumeInLiters > sourceVolumeInLiters
                ? `${targetVolumeInLiters / sourceVolumeInLiters} ${intl.formatMessage({ id: topUnit }, { quantity: targetVolumeInLiters })} = 1 ${intl.formatMessage({ id: bottomUnit }, { quantity: sourceVolumeInLiters })}`
                : `1 ${intl.formatMessage({ id: topUnit }, { quantity: targetVolumeInLiters })} = ${sourceVolumeInLiters / targetVolumeInLiters} ${intl.formatMessage({ id: bottomUnit }, { quantity: sourceVolumeInLiters })}`}
            </span>
          </li>
        )}
        <li style={{ "--i": 3 } as React.CSSProperties}>
          <label id="converted-cost-label">
            <FormattedMessage id="convertedCost" />
          </label>
          <span aria-labelledby="converted-cost-label">
            <FormattedMessage
              id="gasPriceFormula"
              values={{
                number: bottomNumber,
                currency: bottomCurrency,
                unit: bottomUnit,
              }}
            />
          </span>
        </li>
      </ul>
    </>
  );
};

export default ConversionTable;
