import { useState } from "react";
import "./App.css";
import { getNumberFormatChar, getFormattedPrice, getPriceInCurrency, dollarCost, getUnits } from "./utils/numberFormat";

import GasPrice from "./GasPrice";

function App() {
  const userLocale = "en-US";

  const [sourceNumber, setSourceNumber] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState<keyof typeof dollarCost>("BRL");
  const [sourceUnit, setSourceUnit] = useState("liter");
  const targetUnit = "gallon"
  const targetCurrency = "USD"
  const targetNumber = () => {
    // Safely convert the number string into a Number()
    let result = Number(sourceNumber.replace(new RegExp(getNumberFormatChar("groupingSeparatorChar", userLocale), "g"), ""))

    // Convert that number from using source units to target units
    result = getUnits(result, sourceUnit, targetUnit)

    // Convert _that_ number using the exchange rate from source currency to target currency
    result = getPriceInCurrency(result, sourceCurrency, targetCurrency)

    // Finally, format that number as a string
    return getFormattedPrice(result, userLocale, targetCurrency);
  };

  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    setSourceNumber(newValue);
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Source gas price (${sourceCurrency} per ${sourceUnit})`}
            number={sourceNumber}
            onChange={(event) => {
              handlePriceChange(event)
            }}
          />
          <label>Source currency
            <select id="localCurrency" defaultValue={sourceCurrency} onChange={(event) => setSourceCurrency(event.target.value as keyof typeof dollarCost)}>
              <option value="USD">US Dollar (USD)</option>
              <option value="BRL">Brazilian Real (BRL)</option>
            </select>
          </label>
          <label>Source unit of measure
            <select id="sourceUnit" defaultValue={sourceUnit} onChange={(event) => setSourceUnit(event.target.value)}>
              <option value="gallon">per gallon</option>
              <option value="liter">per liter</option>
            </select>
          </label>
          <table className="operations">
            <tbody>
              <tr>
                <td className="operation">× 3.78541</td>
                <td className="operation-description">liters per gallon</td>
              </tr>
              <tr>
                <td className="operation">÷ {dollarCost[sourceCurrency]}</td>
                <td className="operation-description">
                  {sourceCurrency} per {targetCurrency}
                  <br />
                  <em>(updated 2024-11-17)</em>
                </td>
              </tr>
            </tbody>
          </table>
          <GasPrice
            id="homePrice"
            label={`Target gas price (${targetCurrency} per ${targetUnit})`}
            number={targetNumber()}
            disabled
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
