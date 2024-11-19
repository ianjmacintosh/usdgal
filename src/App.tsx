import { useState } from "react";
import "./App.css";

function App() {
  const LITERS_PER_GALLON = 3.78541

  // This table shows how much a dollar costs
  // Updated on 2024-11-17
  const dollarCost: { [key: string]: number } = {
    "BRL": 5.7955874,
    "USD": 1
  }
  const BRL_PER_USD = 5.7955874

  const [localPricePerLiter, setLocalPricePerLiter] = useState(0);
  const getPriceInUSDFromPriceInBRL = (priceInBrl: number, brlPerUsd: number) => (priceInBrl / brlPerUsd).toFixed(2)
  const getPriceInCurrency = (price: number, currency: string, targetCurrency: string) => {
    // Get the price in USD, then convert from USD to target currency
    return Number(price / dollarCost[currency] * dollarCost[targetCurrency]).toFixed(2);
  }
  return (
    <>
    <div className="container">
      <h1>Convert Gas Price</h1>
      <fieldset>
        <label htmlFor="localPrice">Local price (BRL per liter)
          <input type="number" value={localPricePerLiter} onChange={(e) => setLocalPricePerLiter(Number(e.target.value))} name="localPrice" id="localPrice" />
        </label>
        <label htmlFor="homePrice">Home price (USD per gallon)
          <input type="number" value={getPriceInCurrency(localPricePerLiter * LITERS_PER_GALLON, "BRL", "USD")} disabled name="homePrice" id="homePrice" />
        </label>
      </fieldset>
      </div>
    </>
  );
}

export default App;
