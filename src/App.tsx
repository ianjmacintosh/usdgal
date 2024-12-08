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

  const [sourceNumber, setSourceNumber] = useState("");
  const [sourceCurrency, setSourceCurrency] =
    useState<keyof typeof dollarCost>("BRL");
  const [sourceUnit, setSourceUnit] = useState<"liter" | "gallon">("liter");
  const targetNumber = () => {
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

    // Finally, format that number as a string
    return getFormattedPrice(result, userLocale, targetCurrency);
  };

  const [targetCurrency, setTargetCurrency] = useState<keyof typeof dollarCost>("USD");
  const [targetUnit, setTargetUnit] = useState<"liter" | "gallon">("gallon");
  const [direction, setDirection] = useState<"up" | "down">("down");

  const topNumber = direction === "up" ? targetNumber() : sourceNumber,
    topCurrency = direction === "up" ? targetCurrency : sourceCurrency,
    topUnit = direction === "up" ? targetUnit : sourceUnit,
    bottomNumber = direction === "up" ? sourceNumber : targetNumber(),
    bottomCurrency = direction === "up" ? sourceCurrency : targetCurrency,
    bottomUnit = direction === "up" ? sourceUnit : targetUnit;

  const handleGasPriceChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.id;
    const newValue = event.target.value;

    // TODO: Fix this insanity; use nested components to define individual change handlers
    switch (type) {
      case "source_number":
        setDirection("down")
        setSourceNumber(newValue);
        break;
      case "source_currency":
        setSourceCurrency(newValue as keyof typeof dollarCost);
        break;
      case "source_unit":
        setSourceUnit(newValue as "liter" | "gallon");
        break;
      case "target_currency":
        setTargetCurrency(newValue as keyof typeof dollarCost);
        break;
      case "target_unit":
        setTargetUnit(newValue as "liter" | "gallon");
        break;
      case "target_number":
        setDirection("up")
        setSourceNumber(newValue);
        break;
      default:
        break;
    }
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
