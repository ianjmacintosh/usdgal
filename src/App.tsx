import { useState } from "react";
import "./App.css";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;

  // This table shows how much a dollar costs
  // Updated on 2024-11-17
  const dollarCost: { [key: string]: number } = {
    BRL: 5.7955874,
    USD: 1,
  };
  const [localCurrency, setLocalCurrency] = useState("BRL");
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [localPricePerLiter, setLocalPricePerLiter] = useState(0);
  const getPriceInCurrency = (
    price: number,
    currency: string,
    targetCurrency: string,
  ) => {
    // Get the price in USD, then convert from USD to target currency
    return Number(
      (price / dollarCost[currency]) * dollarCost[targetCurrency],
    ).toFixed(2);
  };
  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            label={`Local price (${localCurrency} per liter)`}
            currency={localCurrency}
            price={localPricePerLiter}
            onChange={(e: any) => setLocalPricePerLiter(Number(e.target.value))}
          />
          <GasPrice
            label={`Home price (${homeCurrency} per gallon)`}
            currency={homeCurrency}
            price={getPriceInCurrency(
              localPricePerLiter * LITERS_PER_GALLON,
              localCurrency,
              homeCurrency,
            )}
          ></GasPrice>
          <label htmlFor="homePrice">
            Home price (USD per gallon)
            <input
              type="number"
              value={getPriceInCurrency(
                localPricePerLiter * LITERS_PER_GALLON,
                localCurrency,
                homeCurrency,
              )}
              disabled
            />
          </label>
        </fieldset>
      </div>
    </>
  );
}

export default App;
