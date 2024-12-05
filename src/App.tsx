import { useState } from "react";
import "./App.css";
import { getNumberFormatChar, getFormattedPrice, isLegalPriceValue, getPriceInCurrency, dollarCost, getUnits } from "./utils/numberFormat";

import GasPrice from "./GasPrice";

function App() {
  const userLocale = "en-US";

  const [sourceNumber, setSourceNumber] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState<keyof typeof dollarCost>("BRL");
  const [sourceUnit, setSourceUnit] = useState("liters");
  const targetUnit = "gallons"
  const targetCurrency = "USD"
  const targetNumber = getFormattedPrice(getPriceInCurrency(getUnits(Number(
    sourceNumber.replace(new RegExp(getNumberFormatChar("groupingSeparatorChar", userLocale), "g"), ""),
  ), sourceUnit, targetUnit), sourceCurrency, targetCurrency), userLocale, "USD");

  /**
   * Handles changes to either the local or home gas price inputs.
   * Takes the new value, the currency of the input that triggered the change,
   * and the currency of the other input.
   *
   * @param event - The change event that triggered this function
   * @param sourceCurrency - The currency of the input that triggered the change
   * @param targetCurrency - The currency of the other input
   */
  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    /**
     * Get the new value from the input element
     */
    const newValue = event.target.value;

    /**
     * If the new value is not a valid price (i.e. contains characters other than numbers, periods, and commas), return
     */
    if (!isLegalPriceValue(newValue)) return;

    setSourceNumber(newValue);
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Local price (${sourceCurrency} per liter)`}
            number={sourceNumber}
            onChange={(event) => {
              handlePriceChange(event)
            }}
          />
          <label>Local currency
            <select id="localCurrency" defaultValue={sourceCurrency} onChange={(event) => setSourceCurrency(event.target.value as keyof typeof dollarCost)}>
              <option value="USD">US Dollar (USD)</option>
              <option value="BRL">Brazilian Real (BRL)</option>
            </select>
          </label>
          <label>Local unit of measure
            <select id="sourceUnit" defaultValue={sourceUnit} onChange={(event) => setSourceUnit(event.target.value)}>
              <option value="gallons">per gallon</option>
              <option value="liters">per liter</option>
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
                  {sourceCurrency} per USD
                  <br />
                  <em>(updated 2024-11-17)</em>
                </td>
              </tr>
            </tbody>
          </table>
          <GasPrice
            id="homePrice"
            label={`Home price (USD per gallon)`}
            number={targetNumber}
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
