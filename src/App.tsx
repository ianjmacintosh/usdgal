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

  const handlePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sourceCurrency: keyof typeof dollarCost,
    targetCurrency: keyof typeof dollarCost,
  ) => {
    const newValue = event.target.value;

    if (!isLegalPriceValue(newValue)) return;

    const newPrice = Number(
      newValue.replace(new RegExp(getNumberFormatChar("groupingSeparatorChar", userLocale), "g"), ""),
    );

    const convertedPrice = getPriceInCurrency(
      newPrice * (sourceCurrency === localCurrency ? LITERS_PER_GALLON : 1 / LITERS_PER_GALLON),
      sourceCurrency,
      targetCurrency,
    );
    const formattedConvertedPrice = getFormattedPrice(convertedPrice, userLocale, targetCurrency);

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
