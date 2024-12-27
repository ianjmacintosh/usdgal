import React, { useState } from "react";
import "./ConversionTable.css";

type SupportedUnits = "liter" | "gallon";

const volumesInLiters = {
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
  topUnit: SupportedUnits;
  bottomUnit: SupportedUnits;
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
  const [showDetails, setShowDetails] = useState(false);
  const sourceCurrencyAbsoluteCost =
    exchangeRateData.rates[topCurrency === "" ? "USD" : topCurrency] ?? 1;
  const targetCurrencyAbsoluteCost =
    exchangeRateData.rates[bottomCurrency] ?? 1;

  const sourceVolumeInLiters = volumesInLiters[topUnit];
  const targetVolumeInLiters = volumesInLiters[bottomUnit];

  if (topCurrency === null) {
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
        {showDetails ? "Hide details" : "Show details"}
      </button>
      <ul
        className={`details ${showDetails ? "visible" : ""}`}
        aria-hidden={!showDetails}
        aria-label="Conversion Details"
      >
        <li style={{ "--i": 0 } as React.CSSProperties}>
          <label id="cost-label">Cost</label>
          <span aria-labelledby="cost-label">
            {topNumber} {topCurrency} per {topUnit}
          </span>
        </li>

        {/* Only show conversion rates if the currencies are different */}
        {topCurrency !== bottomCurrency && (
          <li style={{ "--i": 1 } as React.CSSProperties}>
            <label id="currency-conversion-rate-label">
              Currency conversion rate
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
              Volume conversion rate
            </label>
            <span aria-labelledby="volume-conversion-rate-label">
              {targetVolumeInLiters > sourceVolumeInLiters
                ? `${targetVolumeInLiters / sourceVolumeInLiters} ${topUnit}s = 1 ${bottomUnit}`
                : `1 ${topUnit} = ${sourceVolumeInLiters / targetVolumeInLiters} ${bottomUnit}s`}
            </span>
          </li>
        )}
        <li style={{ "--i": 3 } as React.CSSProperties}>
          <label id="converted-cost-label">Converted cost</label>
          <span aria-labelledby="converted-cost-label">
            {bottomNumber} {bottomCurrency} per {bottomUnit}
          </span>
        </li>
      </ul>
    </>
  );
};

export default ConversionTable;
