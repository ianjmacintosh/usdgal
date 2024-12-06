import { dollarCost } from "./utils/numberFormat";

const ConversionTable = ({
    sourceUnit,
    targetUnit,
    sourceCurrency,
    targetCurrency,
}: {
    sourceUnit: string;
    targetUnit: string;
    sourceCurrency: keyof typeof dollarCost;
    targetCurrency: keyof typeof dollarCost;
}) => {
    const exchangeRate = Number(
        dollarCost[sourceCurrency] / dollarCost[targetCurrency],
    )
    const unitExchangeRate = sourceUnit === "gallon" ? 1 : 3.78541;
    return (
        <table className="operations">
            <caption>Conversion Operations</caption>
            <tbody>
                <tr aria-label="Unit of measure conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "x 1gallons per gallon" */}
                    <td className="operation">× {unitExchangeRate} </td>
                    {/* TODO: Use an Intl method to pluralize the source unit. Adding an "s" to pluralize the source unit is a bit of a hack */}
                    <td className="operation-description">{sourceUnit}s per {targetUnit}</td>
                </tr>
                <tr aria-label="Currency conversion">
                    {/* TODO: Look up what the best practice is for displaying a string across mulitple table cells. This trailing space feels hacky, but
                    if I don't include it, it reads like "÷ 1USD per USD" */}
                    <td className="operation">÷ {exchangeRate} </td>
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
