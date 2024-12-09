import { useEffect, useState } from "react";
import "./App.css";
import {
  getPriceInCurrency,
  dollarCost,
  getUnits,
} from "./utils/numberFormat";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";

function App() {
  // const userLocale = "en-US";

  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] =
    useState<keyof typeof dollarCost>("BRL");
  const [topUnit, setTopUnit] = useState<"liter" | "gallon">("liter");
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] =
    useState<keyof typeof dollarCost>("USD");
  const [bottomUnit, setBottomUnit] = useState<"liter" | "gallon">("gallon");
  const [direction, setDirection] = useState<"up" | "down">("down");

  const getGasPrice = (
    sourceNumber: number,
    sourceCurrency: keyof typeof dollarCost,
    sourceUnit: "liter" | "gallon",
    targetCurrency: keyof typeof dollarCost,
    targetUnit: "liter" | "gallon",
  ) => {
    // Convert that number from using source units to target units
    let result = getUnits(sourceNumber, sourceUnit, targetUnit);

    // Convert _that_ number using the exchange rate from source currency to target currency
    result = getPriceInCurrency(result, sourceCurrency, targetCurrency);

    return result;
  };

  useEffect(() => {
    const sourceNumber = direction === "down" ? topNumber : bottomNumber;
    const sourceCurrency = direction === "down" ? topCurrency : bottomCurrency;
    const sourceUnit = direction === "down" ? topUnit : bottomUnit;
    const targetCurrency = direction === "down" ? bottomCurrency : topCurrency;
    const targetUnit = direction === "down" ? bottomUnit : topUnit;

    const newResult = getGasPrice(sourceNumber, sourceCurrency, sourceUnit, targetCurrency, targetUnit)

    if (direction === "up") {
      setTopNumber(newResult)
    } else {
      setBottomNumber(newResult)
    }
  }, [direction, topNumber, topCurrency, topUnit, bottomCurrency, bottomUnit, bottomNumber])

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <GasPrice
          id="localPrice"
          label="Top"
          number={topNumber}
          currency={topCurrency}
          unit={topUnit}
          onNumberChange={(newNumber: number) => {
            setDirection("down")
            setTopNumber(newNumber);
          }}
          onUnitChange={(newUnit: "liter" | "gallon") => {
            setTopUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: keyof typeof dollarCost) => {
            setTopCurrency(newCurrency);
          }}
        />
        <ConversionTable
          sourceUnit={topUnit}
          targetUnit={bottomUnit}
          sourceCurrency={topCurrency}
          targetCurrency={bottomCurrency}
        />
        <GasPrice
          id="homePrice"
          label="Bottom"
          number={bottomNumber}
          currency={bottomCurrency}
          onNumberChange={(newValue: number) => {
            setDirection("up")
            setBottomNumber(newValue);
          }}
          unit={bottomUnit}
          onUnitChange={(newUnit: "liter" | "gallon") => {
            setBottomUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: keyof typeof dollarCost) => {
            setBottomCurrency(newCurrency);
          }}
        ></GasPrice>
        Direction: {direction}
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
