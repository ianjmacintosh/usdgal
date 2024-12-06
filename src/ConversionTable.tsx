const ConversionTable = ({
    exchangeRate,
    sourceCurrency,
    targetCurrency,
}: {
    exchangeRate: number;
    sourceCurrency: string;
    targetCurrency: string;
}) => {
    return (
        <table className="operations">
            <tbody>
                <tr>
                    <td className="operation">× 3.78541</td>
                    <td className="operation-description">liters per gallon</td>
                </tr>
                <tr>
                    <td className="operation">÷ {exchangeRate}</td>
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
