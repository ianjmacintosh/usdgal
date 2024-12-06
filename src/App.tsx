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
  const [sourceUnit, setSourceUnit] = useState("liter");
  const targetUnit = "gallon";
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
  const targetCurrency = "USD";

  const handleGasPriceChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.target.id;
    const newValue = event.target.value;

    if (key === "number") {
      setSourceNumber(newValue);
    } else if (key === "currency") {
      setSourceCurrency(newValue as keyof typeof dollarCost);
    } else if (key === "unit") {
      setSourceUnit(newValue);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            label="Source"
            number={sourceNumber}
            currency={sourceCurrency}
            unit={sourceUnit}
            onChange={(event) => {
              handleGasPriceChange(event);
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
            number={targetNumber()}
            currency={targetCurrency}
            unit={targetUnit}
            disabled
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
