import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./conversion-table.css";
import { Units } from "@/components/unit-select/unit-select";
import InfoIcon from "@/assets/info.svg?react";

type ConversionTableProps = {
  topNumber: number;
  bottomNumber: number;
  topUnit: Units | "";
  bottomUnit: Units | "";
  topCurrency: string;
  bottomCurrency: string;
  exchangeRateData: {
    base: string;
    date: string;
    rates: { [key: string]: number };
    success: boolean;
    timestamp: number;
  };
};

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
}: ConversionTableProps) => {
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
        className={`details-button ${showDetails ? "details-shown" : "details-hidden"}`}
        onClick={() => {
          const newValue = !showDetails;

          setShowDetails(newValue);
        }}
        aria-labelledby={
          showDetails ? "hide-details-text" : "show-details-text"
        }
      >
        <InfoIcon height={18} width={18} className="icon" />
        <span id="hide-details-text">
          {intl.formatMessage({ id: "hideDetails" })}
        </span>
        <span id="show-details-text">
          {intl.formatMessage({ id: "showDetails" })}
        </span>
      </button>
      <dl
        className={`details ${showDetails ? "visible" : ""}`}
        aria-hidden={!showDetails}
        aria-label={intl.formatMessage({ id: "conversionDetails" })}
      >
        <div style={{ "--i": 0 } as React.CSSProperties}>
          <dt id="cost">
            <FormattedMessage id="cost" />
          </dt>
          <dd aria-labelledby="cost">
            <FormattedMessage
              id="gasPriceFormula"
              values={{
                number: topNumber,
                currency: topCurrency,
                unit: topUnit,
              }}
            />
          </dd>
        </div>
        {/* Only show conversion rates if the currencies are different */}
        {topCurrency !== bottomCurrency && (
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <dt id="currency-conversion-rate">
              <FormattedMessage id="currencyConversionRate" />
            </dt>
            <dd aria-labelledby="currency-conversion-rate">
              {sourceCurrencyAbsoluteCost > targetCurrencyAbsoluteCost
                ? `${sourceCurrencyAbsoluteCost / targetCurrencyAbsoluteCost} ${topCurrency} = 1 ${bottomCurrency}`
                : `1 ${topCurrency} = ${targetCurrencyAbsoluteCost / sourceCurrencyAbsoluteCost} ${bottomCurrency}`}
            </dd>
          </div>
        )}

        {/* Only show volume conversion rates if the units are different */}
        {topUnit !== bottomUnit && (
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <dt id="volume-conversion-rate">
              <FormattedMessage id="volumeConversionRate" />
            </dt>
            <dd aria-labelledby="volume-conversion-rate">
              {targetVolumeInLiters > sourceVolumeInLiters
                ? `${targetVolumeInLiters / sourceVolumeInLiters} ${intl.formatMessage({ id: topUnit }, { quantity: targetVolumeInLiters })} = 1 ${intl.formatMessage({ id: bottomUnit }, { quantity: sourceVolumeInLiters })}`
                : `1 ${intl.formatMessage({ id: topUnit }, { quantity: targetVolumeInLiters })} = ${sourceVolumeInLiters / targetVolumeInLiters} ${intl.formatMessage({ id: bottomUnit }, { quantity: sourceVolumeInLiters })}`}
            </dd>
          </div>
        )}
        <div style={{ "--i": 3 } as React.CSSProperties}>
          <dt id="converted-cost">
            <FormattedMessage id="convertedCost" />
          </dt>
          <dd aria-labelledby="converted-cost">
            <FormattedMessage
              id="gasPriceFormula"
              values={{
                number: bottomNumber,
                currency: bottomCurrency,
                unit: bottomUnit,
              }}
            />
          </dd>
        </div>
      </dl>
    </>
  );
};

export default ConversionTable;
