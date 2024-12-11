import { useEffect, useState } from "react";
import "./App.css";
import {
  getPriceInCurrency,
  dollarCost,
  getUnits,
} from "./utils/numberFormat";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";

type SupportedCurrencies = keyof typeof dollarCost;
type SupportedUnits = "liter" | "gallon";

function App() {
  // const userLocale = "en-US";

  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] =
    useState<SupportedCurrencies>("BRL");
  const [topUnit, setTopUnit] = useState<SupportedUnits>("liter");
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] =
    useState<SupportedCurrencies>("USD");
  const [bottomUnit, setBottomUnit] = useState<SupportedUnits>("gallon");
  const [isUpdatingBottomNumber, setIsUpdatingBottomNumber] = useState(true);

  const getGasPrice = (
    sourceNumber: number,
    sourceCurrency: SupportedCurrencies,
    sourceUnit: SupportedUnits,
    targetCurrency: SupportedCurrencies,
    targetUnit: SupportedUnits,
  ) => {
    // Convert that number from using source units to target units
    let result = getUnits(sourceNumber, sourceUnit, targetUnit);

    // Convert _that_ number using the exchange rate from source currency to target currency
    result = getPriceInCurrency(result, sourceCurrency, targetCurrency);

    return result;
  };

  useEffect(() => {
    if (isUpdatingBottomNumber) {
      const newResult = getGasPrice(topNumber, topCurrency, topUnit, bottomCurrency, bottomUnit);
      setBottomNumber(newResult)
    } else {
      const newResult = getGasPrice(bottomNumber, bottomCurrency, bottomUnit, topCurrency, topUnit);
      setTopNumber(newResult)
    }
  }, [isUpdatingBottomNumber, topNumber, topCurrency, topUnit, bottomCurrency, bottomUnit, bottomNumber])

  return (
    <>
      <div className="container">
        <h1>Convert Foreign Gas Price</h1>
        <GasPrice
          id="localPrice"
          label="From"
          number={topNumber}
          currency={topCurrency}
          unit={topUnit}
          onNumberChange={(newNumber: number) => {
            setIsUpdatingBottomNumber(true)
            setTopNumber(newNumber);
          }}
          onUnitChange={(newUnit: SupportedUnits) => {
            setTopUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: SupportedCurrencies) => {
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
          label="To"
          number={bottomNumber}
          currency={bottomCurrency}
          onNumberChange={(newValue: number) => {
            setIsUpdatingBottomNumber(false)
            setBottomNumber(newValue);
          }}
          unit={bottomUnit}
          onUnitChange={(newUnit: SupportedUnits) => {
            setBottomUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: SupportedCurrencies) => {
            setBottomCurrency(newCurrency);
          }}
        ></GasPrice>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
