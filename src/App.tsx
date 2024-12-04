import { useState } from "react";
import "./App.css";
import { getNumberFormatChar, getFormattedPrice, isLegalPriceValue, getPriceInCurrency, dollarCost } from "./utils/numberFormat";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;
  const userLocale = "en-US";

  const [localCurrency] = useState<keyof typeof dollarCost>("BRL");
  const [homeCurrency] = useState<keyof typeof dollarCost>("USD");
  const [localPrice, setLocalPrice] = useState("");
  const [homePrice, setHomePrice] = useState("0.00");

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
    const convertedPrice = getPriceInCurrency(
      newPrice * (sourceCurrency === localCurrency ? LITERS_PER_GALLON : 1 / LITERS_PER_GALLON),
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
    setPrice(sourceCurrency, newValue);
    setPrice(targetCurrency, formattedConvertedPrice);
  };

  const setPrice = (currency: keyof typeof dollarCost, value: string) => {
    if (currency === localCurrency) setLocalPrice(value);
    else setHomePrice(value);
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
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
