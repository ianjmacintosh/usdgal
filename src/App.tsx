import { useState } from "react";

function App() {
  const LITERS_PER_GALLON = 3.78541

  // Updated on 2024-11-17
  const BRL_PER_USD = 5.7955874

  const [localPricePerLiter, setLocalPricePerLiter] = useState(0);
  const getPriceInUSDFromPriceInBRL = (priceInBrl: number, brlPerUsd: number) => (priceInBrl / brlPerUsd).toFixed(2)
  return (
    <>
      <h1>Convert BRL per liter to USD per gallon</h1>
      R$ <input type="number" value={localPricePerLiter} onChange={(e) => setLocalPricePerLiter(Number(e.target.value))} /> BRL per liter
      is ${getPriceInUSDFromPriceInBRL(localPricePerLiter * LITERS_PER_GALLON, BRL_PER_USD)} USD per gallon
    </>
  );
}

export default App;
