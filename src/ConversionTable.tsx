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
        <>
            <h2>Conversion Operations</h2>
            <ol className="operations">
                <li aria-label="Initial cost">
                    <span className="operator"></span> <span className="operand">{topNumber} {topCurrency}</span> <span className="operation-description">Initial price</span>
                </li>
                <li aria-label="Unit of measure conversion">
                    <span className="operator">{unitConversionFormula.operation}</span> <span className="operand">{unitConversionFormula.rate}</span> <span className="operation-description">{unitConversionFormula.operation === "÷" ? `${bottomUnit}s per ${topUnit}` : `${topUnit}s per ${bottomUnit}`}</span>
                </li>
                <li aria-label="Currency conversion">
                    <span className="operator">{currencyExchangeFormula.operation}</span> <span className="operand">{currencyExchangeFormula.rate}</span> <span className="operation-description">{currencyExchangeFormula.operation === "÷" ? `${topCurrency} per ${bottomCurrency}` : `${bottomCurrency} per ${topCurrency}`}<br />(last updated: {bottomCurrencyUpdatedDate})</span>
                </li>
                <li aria-label="Converted cost">
                    <span className="operator">=</span> <span className="operand">{bottomNumber} {bottomCurrency}</span> <span className="operation-description">Converted price</span>
                </li>
            </ol>
        </>
    );
};

export default ConversionTable;
