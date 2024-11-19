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
    <div className="container">
      <h1>Convert Gas Price</h1>
      <fieldset>
        <label htmlFor="localPrice">Local price (BRL per liter)
          <input type="number" value={localPricePerLiter} onChange={(e) => setLocalPricePerLiter(Number(e.target.value))} name="localPrice" id="localPrice" />
        </label>
        <label htmlFor="homePrice">Home price (USD per gallon)
          <input type="number" value={getPriceInUSDFromPriceInBRL(localPricePerLiter * LITERS_PER_GALLON, BRL_PER_USD)} disabled name="homePrice" id="homePrice" />
        </label>
      </fieldset>
      </div>
    </>
  );
}

export default App;
