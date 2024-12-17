import React, { useRef, useState } from "react";
import "./ConversionTable.css";

type SupportedUnits = "liter" | "gallon";

const volumesInLiters = {
    "liter": 1,
    "gallon": 3.78541
}

const ConversionTable = ({
    topNumber,
    bottomNumber,
    topUnit,
    bottomUnit,
    topCurrency,
    bottomCurrency,
    exchangeRateData
}: {
    topNumber: number,
    bottomNumber: number,
    topUnit: SupportedUnits;
    bottomUnit: SupportedUnits;
    topCurrency: string;
    bottomCurrency: string;
    exchangeRateData: {
        base: string,
        date: string,
        rates: { [key: string]: number },
        success: boolean,
        timestamp: number,
    }
}) => {
    const detailsElement = useRef<HTMLUListElement>(null);
    const [showDetails, setShowDetails] = useState(false)
    const sourceCurrencyDollarCost = exchangeRateData.rates[topCurrency] ?? 1;
    const targetCurrencyDollarCost = exchangeRateData.rates[bottomCurrency] ?? 1;
    const bottomCurrencyUpdatedDate = exchangeRateData.date ?? "2024-11-17";
    const exchangeRate = sourceCurrencyDollarCost / targetCurrencyDollarCost;
    const currencyExchangeFormula = {
        "operation": exchangeRate > 1 ? "÷" : "×",
        "rate": sourceCurrencyDollarCost < targetCurrencyDollarCost ?
            targetCurrencyDollarCost / sourceCurrencyDollarCost :
            sourceCurrencyDollarCost / targetCurrencyDollarCost
    }

    const sourceVolumeInLiters = volumesInLiters[topUnit];
    const targetVolumeInLiters = volumesInLiters[bottomUnit];
    const unitExchangeRate = sourceVolumeInLiters / targetVolumeInLiters;
    const unitConversionFormula = {
        "operation": unitExchangeRate > 1 ? "÷" : "×",
        "rate": sourceVolumeInLiters < targetVolumeInLiters ?
            targetVolumeInLiters / sourceVolumeInLiters :
            sourceVolumeInLiters / targetVolumeInLiters
    }


    return (<>
        <button className="details-button" onClick={() => {
            const newValue = !showDetails

            setShowDetails(newValue)
        }}>{showDetails ? "Hide full conversion details..." : "Show full conversion details..."}</button>
        <ul ref={detailsElement} className={`details ${showDetails ? "visible" : ""}`} aria-hidden={!showDetails}>
            <li style={{ "--i": 0 } as React.CSSProperties}>
                <label>Cost</label>
                <span>{topNumber} {topCurrency} per {topUnit}</span>
            </li>
            <li style={{ "--i": 1 } as React.CSSProperties}>
                <label>Currency conversion rate</label>
                <span>{currencyExchangeFormula.operation === "÷" ? `1 ${bottomCurrency} = ${currencyExchangeFormula.rate} ${topCurrency}` : `1 ${topCurrency} = ${currencyExchangeFormula.rate} ${bottomCurrency}`}</span><br />
                <em>(Last updated: {bottomCurrencyUpdatedDate})</em>
            </li>
            <li style={{ "--i": 2 } as React.CSSProperties}>
                <label>Volume conversion rate</label>
                <span>1 {topUnit} = {unitConversionFormula.rate} {bottomUnit}</span>
            </li>
            <li style={{ "--i": 3 } as React.CSSProperties}>
                <label>Converted cost</label>
                <span>{bottomNumber} {bottomCurrency} per {bottomUnit}</span>
            </li>
        </ul>
    </>
    );
};

export default ConversionTable;
