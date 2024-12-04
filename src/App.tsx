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

  const handleLocalPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    if (isLegalPriceValue(newValue) === false) return;

    setLocalPrice(newValue);

    const newValueAsNumber = Number(
      newValue.replaceAll(getNumberFormatChar("groupingSeparatorChar", userLocale), ""),
    );

    const newHomePrice = getPriceInCurrency(
      newValueAsNumber * LITERS_PER_GALLON,
      localCurrency,
      homeCurrency,
    );
    const newFormattedHomePrice = getFormattedPrice(newHomePrice, userLocale, localCurrency);

    setHomePrice(newFormattedHomePrice);
  };

  const handleHomePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    if (isLegalPriceValue(newValue) === false) return;

    setHomePrice(newValue);

    const newValueAsNumber = Number(
      newValue.replaceAll(getNumberFormatChar("groupingSeparatorChar", userLocale), ""),
    );

    const newLocalPrice = getPriceInCurrency(
      newValueAsNumber / LITERS_PER_GALLON,
      homeCurrency,
      localCurrency,
    );
    const newFormattedLocalPrice = getFormattedPrice(newLocalPrice, userLocale, localCurrency);

    setLocalPrice(newFormattedLocalPrice);
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
            onChange={handleLocalPriceChange}
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
            onChange={handleHomePriceChange}
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
