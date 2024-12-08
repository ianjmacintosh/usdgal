import { useState } from "react";
import "./App.css";
import {
  getNumberFormatChar,
  getFormattedPrice,
  getPriceInCurrency,
  dollarCost,
  getUnits,
} from "./utils/numberFormat";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";

function App() {
  const userLocale = "en-US";

  const [topNumber, setTopNumber] = useState("");
  const [topCurrency, setTopCurrency] =
    useState<keyof typeof dollarCost>("BRL");
  const [topUnit, setTopUnit] = useState<"liter" | "gallon">("liter");
  const [bottomNumber, setBottomNumber] = useState("0.00");
  const [bottomCurrency, setBottomCurrency] = useState<keyof typeof dollarCost>("USD");
  const [bottomUnit, setBottomUnit] = useState<"liter" | "gallon">("gallon");

  const getGasPriceNumber = (sourceNumber: number, sourceCurrency: keyof typeof dollarCost, sourceUnit: "liter" | "gallon", targetCurrency: keyof typeof dollarCost, targetUnit: "liter" | "gallon") => {
    // Safely convert the number string into a Number()
    let result = Number(
      sourceNumber.replace(
        new RegExp(
          getNumberFormatChar("groupingSeparatorChar", userLocale),
          "g",
        ),
        "",
      ),
    );

    // Convert that number from using source units to target units
    result = getUnits(result, sourceUnit, targetUnit);

    // Convert _that_ number using the exchange rate from source currency to target currency
    result = getPriceInCurrency(result, sourceCurrency, targetCurrency);

    return result;
  }

  const topToBottomResult = getGasPriceNumber(Number(topNumber), topCurrency, topUnit, bottomCurrency, bottomUnit);
  const bottomToTopResult = getGasPriceNumber(Number(bottomNumber), bottomCurrency, bottomUnit, topCurrency, topUnit);

  const handleGasPriceChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.id;
    const newValue = event.target.value;

    // TODO: Fix this insanity; use nested components to define individual change handlers
    switch (type) {
      case "source_number":
        setTopNumber(newValue)
        break;
      case "source_currency":
        setTopCurrency(newValue as keyof typeof dollarCost);
        break;
      case "source_unit":
        setTopUnit(newValue as "liter" | "gallon");
        break;
      case "target_currency":
        setBottomCurrency(newValue as keyof typeof dollarCost);
        break;
      case "target_unit":
        setBottomUnit(newValue as "liter" | "gallon");
        break;
    }

    setBottomNumber(getFormattedPrice(bottomToTopResult(topToBottomResult, userLocale, bottomCurrency)))
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <GasPrice
          id="localPrice"
          label="Source"
          number={topNumber}
          currency={topCurrency}
          unit={topUnit}
          onChange={(event) => {
            handleGasPriceChange(event);
          }}
          onNumberBlur={(newValue: string) => {
            newValue = newValue.replace(getNumberFormatChar("groupingSeparatorChar", userLocale), "");
            setSourceNumber(getFormattedPrice(Number(newValue), userLocale, sourceCurrency));
          }}
        />
        <ConversionTable
          sourceUnit={sourceUnit}
          targetUnit={targetUnit}
          sourceCurrency={sourceCurrency}
          targetCurrency={targetCurrency}
        />
        <GasPrice
          id="homePrice"
          label="Target"
          number={bottomNumber}
          currency={bottomCurrency}
          unit={bottomUnit}
          onChange={(event) => {
            handleGasPriceChange(event);
          }}
          onNumberBlur={(newValue: string) => {
            newValue = newValue.replace(getNumberFormatChar("groupingSeparatorChar", userLocale), "");
            setSourceNumber(getFormattedPrice(Number(newValue), userLocale, sourceCurrency));
          }}
        ></GasPrice>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
