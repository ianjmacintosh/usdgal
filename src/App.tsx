import { useState } from "react";
import "./App.css";
import { getNumberFormatChar, getFormattedPrice, isLegalPriceValue, getPriceInCurrency, dollarCost } from "./utils/numberFormat";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;
  const userLocale = "en-US";

  const [localCurrency, setLocalCurrency] = useState<keyof typeof dollarCost>("BRL");
  const [homeCurrency, setHomeCurrency] = useState<keyof typeof dollarCost>("USD");
  const [localPrice, setLocalPrice] = useState("");
  const [homePrice, setHomePrice] = useState("0.00");
  const [localUnit, setLocalUnit] = useState("liters");
  const [homeUnit, setHomeUnit] = useState("gallons");

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
    event: React.ChangeEvent<HTMLInputElement>,
    sourceCurrency: keyof typeof dollarCost,
    targetCurrency: keyof typeof dollarCost,
  ) => {
    /**
     * Get the new value from the input element
     */
    const newValue = event.target.value;

    /**
     * If the new value is not a valid price (i.e. contains characters other than numbers, periods, and commas), return
     */
    if (!isLegalPriceValue(newValue)) return;

    /**
     * Remove any grouping characters (e.g. commas in the US) from the new value
     */
    const newPrice = Number(
      newValue.replace(new RegExp(getNumberFormatChar("groupingSeparatorChar", userLocale), "g"), ""),
    );

    /**
     * Convert the new price from the source currency to the target currency
     * Multiply by LITERS_PER_GALLON if the source currency is the local currency, divide by LITERS_PER_GALLON if it is the home currency
     */
    const convertUnit = (price: number, fromUnit: string, toUnit: string) => {
      if (fromUnit === "liters" && toUnit === "gallons") {
        return price * LITERS_PER_GALLON;
      }
      if (fromUnit === "gallons" && toUnit === "liters") {
        return price / LITERS_PER_GALLON;
      }
      return price;
    };

    const convertedUnitPrice = convertUnit(newPrice, sourceCurrency === localCurrency ? localUnit : homeUnit, sourceCurrency === localCurrency ? homeUnit : localUnit);

    const convertedPrice = getPriceInCurrency(
      convertedUnitPrice,
      sourceCurrency,
      targetCurrency,
    );

    /**
     * Format the converted price for display
     */
    const formattedConvertedPrice = getFormattedPrice(convertedPrice, userLocale, targetCurrency);

    /**
     * Set the state of both inputs to the new values
     */
    if (event.target.id === "localPrice") {
      setLocalPrice(newValue);
      setHomePrice(formattedConvertedPrice);
    } else {
      setHomePrice(newValue);
      setLocalPrice(formattedConvertedPrice);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Local price (${localCurrency} per liter)`}
            price={localPrice}

            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(event, localCurrency, homeCurrency)
            }
          />
          <label>Local currency
            <select id="localCurrency" defaultValue={localCurrency} onChange={(event) => setLocalCurrency(event.target.value as keyof typeof dollarCost)}>
              <option value="USD">US Dollar (USD)</option>
              <option value="BRL">Brazilian Real (BRL)</option>
            </select>
          </label>
          <label>Local unit of measure
            <select id="localUnit" defaultValue={localUnit} onChange={(event) => setLocalUnit(event.target.value)}>
              <option value="gallons">per gallon</option>
              <option value="liters">per liter</option>
            </select>
          </label>
          <table className="operations">
            <tbody>
              <tr>
                <td className="operation">× {LITERS_PER_GALLON}</td>
                <td className="operation-description">liters per gallon</td>
              </tr>
              <tr>
                <td className="operation">÷ {dollarCost[localCurrency]}</td>
                <td className="operation-description">
                  {localCurrency} per USD
                  <br />
                  <em>(updated 2024-11-17)</em>
                </td>
              </tr>
            </tbody>
          </table>
          <GasPrice
            id="homePrice"
            label={`Home price (${homeCurrency} per gallon)`}
            price={homePrice}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(event, homeCurrency, localCurrency)
            }
          ></GasPrice>
          <label>Home currency
            <select id="homeCurrency" defaultValue={homeCurrency} onChange={(event) => setHomeCurrency(event.target.value as keyof typeof dollarCost)}>
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </label>
          <label>Home unit of measure
            <select id="homeUnit" defaultValue={homeUnit} onChange={(event) => setHomeUnit(event.target.value)}>
              <option value="gallons">per gallon</option>
              <option value="liters">per liter</option>
            </select>
          </label>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
