import { useState } from "react";
import "./App.css";

function App() {
  const LITERS_PER_GALLON = 3.78541

  // Updated on 2024-11-17
  const BRL_PER_USD = 5.7955874

  const [localPricePerLiter, setLocalPricePerLiter] = useState(0);
  const getPriceInUSDFromPriceInBRL = (priceInBrl: number, brlPerUsd: number) => (priceInBrl / brlPerUsd).toFixed(2)
  return (
    <>
      <h1>Convert BRL per liter to USD per gallon</h1>
      <fieldset>
        <label htmlFor="localPrice">Per liter price in BRL
          <input type="number" value={localPricePerLiter} onChange={(e) => setLocalPricePerLiter(Number(e.target.value))} name="localPrice" id="localPrice" />
        </label>
        <label htmlFor="homePrice">Per gallon price in USD
          <input type="number" value={getPriceInUSDFromPriceInBRL(localPricePerLiter * LITERS_PER_GALLON, BRL_PER_USD)} disabled name="homePrice" id="homePrice" />
        </label>
      </fieldset>
    </>
  );
}

export default App;
