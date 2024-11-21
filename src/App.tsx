import { useEffect, useMemo, useState } from "react";
import "./App.css";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;
  const [localCurrency] = useState("BRL");
  const [homeCurrency] = useState("USD");
  const [localPrice, setLocalPrice] = useState("0.00");
  const [homePrice, setHomePrice] = useState("0.00");
  // This table shows how much a dollar costs
  // Updated on 2024-11-17
  const dollarCost = useMemo((): { [key: string]: number } => ({
    BRL: 5.7955874,
    USD: 1,
  }), []);

  useEffect(() => {
    const getPriceInCurrency = (
      price: number,
      currency: string,
      targetCurrency: string,
    ) => {

      // Get the price in USD, then convert from USD to target currency
      return Number(
        (price / dollarCost[currency]) * dollarCost[targetCurrency],
      )
    };

    const newHomePrice = Number(getPriceInCurrency(
      Number(localPrice) * LITERS_PER_GALLON,
      localCurrency,
      homeCurrency,
    )).toFixed(2)

  setHomePrice(newHomePrice)

  }, [ localPrice, localCurrency, homeCurrency, LITERS_PER_GALLON, dollarCost ])

  const handleLocalPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const newChar = newValue?.slice(-1)

    if (newValue && RegExp(/[0-9\\.]/).test(newChar) === false) return
    setLocalPrice(event.target.value);
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
                <td className="operation-description">{localCurrency} per USD<br /><em>(updated 2024-11-17)</em></td>
              </tr>
            </tbody>
          </table>
          <GasPrice
            id="homePrice"
            label={`Home price (${homeCurrency} per gallon)`}
            price={homePrice}
            disabled
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
