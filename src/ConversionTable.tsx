import "./ConversionTable.css";

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
    dollarCost
}: {
    sourceUnit: SupportedUnits;
    targetUnit: SupportedUnits;
    sourceCurrency: string;
    targetCurrency: string;
    dollarCost: { currency: string; price: number, updated?: string; }[]
}) => {

    const sourceCurrencyDollarCost = dollarCost.find((currencyInfo) => currencyInfo.currency === sourceCurrency)?.price ?? 1;
    const targetCurrencyDollarCost = dollarCost.find((currencyInfo) => currencyInfo.currency === targetCurrency)?.price ?? 1;
    const targetCurrencyUpdatedDate = dollarCost.find((currencyInfo) => currencyInfo.currency === targetCurrency)?.updated ?? "2024-11-17";
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
                    <td className="operation">{currencyExchangeFormula.operation} {Number(currencyExchangeFormula.rate).toFixed(7)} </td>
                    <td className="operation-description">
                        {currencyExchangeFormula.operation === "÷" ? `${sourceCurrency} per ${targetCurrency}` : `${targetCurrency} per ${sourceCurrency}`}
                        <br />
                        <em>(updated {targetCurrencyUpdatedDate})</em>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ConversionTable;
