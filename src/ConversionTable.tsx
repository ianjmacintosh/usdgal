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


    return (
        <table className="operations">
            <caption>Conversion Operations</caption>
            <tbody>
                <tr aria-label="Initial cost">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "x 1gallons per gallon" */}
                    <td className="operator">= </td>
                    <td className="operand">{topNumber} {topCurrency}</td>
                </tr>
                <tr aria-label="Unit of measure conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "x 1gallons per gallon" */}
                    <td className="operator">{unitConversionFormula.operation} </td>
                    <td className="operand">{unitConversionFormula.rate} </td>
                    {/* TODO: Use an Intl method to pluralize the source unit. Adding an "s" to pluralize the source unit is a bit of a hack */}
                    <td className="operation-description">
                        {unitConversionFormula.operation === "÷" ? `${bottomUnit}s per ${topUnit}` : `${topUnit}s per ${bottomUnit}`}
                    </td>
                </tr>
                <tr aria-label="Currency conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "÷ 1USD per USD" */}
                    <td className="operator">{currencyExchangeFormula.operation}</td>
                    <td className="operand">{currencyExchangeFormula.rate} </td>
                    <td className="operation-description">
                        {currencyExchangeFormula.operation === "÷" ? `${topCurrency} per ${bottomCurrency}` : `${bottomCurrency} per ${topCurrency}`}
                        <br />
                        <em>(updated {bottomCurrencyUpdatedDate})</em>
                    </td>
                </tr>
                <tr aria-label="Converted cost">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "x 1gallons per gallon" */}
                    <td className="operator">= </td>
                    <td className="operand"><span style={{ textWrap: "nowrap", textOverflow: "ellipsis" }}>{bottomNumber}</span> {bottomCurrency}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default ConversionTable;
