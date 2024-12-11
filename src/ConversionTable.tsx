import { useEffect, useState } from "react";
import "./ConversionTable.css";

type SupportedCurrencies = "BRL" | "USD";
type SupportedUnits = "liter" | "gallon";

const volumesInLiters = {
    "liter": 1,
    "gallon": 3.78541
}

const ConversionTable = ({
    sourceUnit,
    targetUnit,
    sourceCurrency,
    targetCurrency,
}: {
    sourceUnit: SupportedUnits;
    targetUnit: SupportedUnits;
    sourceCurrency: SupportedCurrencies;
    targetCurrency: SupportedCurrencies;
}) => {
    const [exchangeRates, setExchangeRates] = useState<Partial<Record<SupportedCurrencies, number>>>({ "BRL": 5.7955874, "USD": 1 });
    useEffect(() => {
        fetch("/currencies.json").then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setExchangeRates(data);
                });
            }
        })
    })
    const sourceCurrencyDollarCost = exchangeRates[sourceCurrency] ? exchangeRates[sourceCurrency] : 1;
    const targetCurrencyDollarCost = exchangeRates[targetCurrency] ? exchangeRates[targetCurrency] : 1;
    const exchangeRate = sourceCurrencyDollarCost / targetCurrencyDollarCost;
    const currencyExchangeFormula = {
        "operation": exchangeRate > 1 ? "÷" : "×",
        "rate": sourceCurrencyDollarCost < targetCurrencyDollarCost ?
            targetCurrencyDollarCost / sourceCurrencyDollarCost :
            sourceCurrencyDollarCost / targetCurrencyDollarCost
    }

    const sourceVolumeInLiters = volumesInLiters[sourceUnit];
    const targetVolumeInLiters = volumesInLiters[targetUnit];
    const unitExchangeRate = sourceVolumeInLiters / targetVolumeInLiters;
    const unitConversionFormula = {
        "operation": unitExchangeRate > 1 ? "÷" : "×",
        "rate": sourceVolumeInLiters < targetVolumeInLiters ?
            targetVolumeInLiters / sourceVolumeInLiters :
            sourceVolumeInLiters / targetVolumeInLiters
    }


    return (
        <table className="operations">
            <caption>Conversion Operations</caption>
            <tbody>
                <tr aria-label="Unit of measure conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "x 1gallons per gallon" */}
                    <td className="operation">{unitConversionFormula.operation} {unitConversionFormula.rate} </td>
                    {/* TODO: Use an Intl method to pluralize the source unit. Adding an "s" to pluralize the source unit is a bit of a hack */}
                    <td className="operation-description">{sourceUnit}s per {targetUnit}</td>
                </tr>
                <tr aria-label="Currency conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "÷ 1USD per USD" */}
                    <td className="operation">{currencyExchangeFormula.operation} {currencyExchangeFormula.rate} </td>
                    <td className="operation-description">
                        {sourceCurrency} per {targetCurrency}
                        <br />
                        <em>(updated 2024-11-17)</em>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ConversionTable;
