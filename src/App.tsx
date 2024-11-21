import { useState } from "react";
import "./App.css";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;


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

  // This table shows how much a dollar costs
  // Updated on 2024-11-17
  const dollarCost: { [key: string]: number } = {
    BRL: 5.7955874,
    USD: 1,
  };
  const [localCurrency] = useState("BRL");
  const [homeCurrency] = useState("USD");
  const [localPrice, setLocalPrice] = useState(0);
  const homePrice = getPriceInCurrency(
    localPrice * LITERS_PER_GALLON,
    localCurrency,
    homeCurrency,
  )
  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Local price (${localCurrency} per liter)`}
            currency={localCurrency}
            price={localPrice}
            onChange={(e: any) => setLocalPrice(Number(e.target.value))}
          />
          <GasPrice
            id="homePrice"
            label={`Home price (${homeCurrency} per gallon)`}
            currency={homeCurrency}
            price={homePrice}
            disabled
          ></GasPrice>
        </fieldset>
      </div>
    </>
  );
}

export default App;
