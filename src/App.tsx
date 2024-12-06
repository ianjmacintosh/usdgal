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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setSourceNumber(newValue);
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Source gas price (${sourceCurrency} per ${sourceUnit})`}
            number={sourceNumber}
            onChange={(event) => {
              handlePriceChange(event);
            }}
          />
          <label>
            Source currency
            <select
              id="localCurrency"
              defaultValue={sourceCurrency}
              onChange={(event) =>
                setSourceCurrency(event.target.value as keyof typeof dollarCost)
              }
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="BRL">Brazilian Real (BRL)</option>
            </select>
          </label>
          <label>
            Source unit of measure
            <select
              id="sourceUnit"
              defaultValue={sourceUnit}
              onChange={(event) => setSourceUnit(event.target.value)}
            >
              <option value="gallon">gallons</option>
              <option value="liter">liters</option>
            </select>
          </label>
          <ConversionTable
            sourceUnit={sourceUnit}
            targetUnit={targetUnit}
            sourceCurrency={sourceCurrency}
            targetCurrency={targetCurrency}
          />
          <GasPrice
            id="homePrice"
            label={`Target gas price (${targetCurrency} per ${targetUnit})`}
            number={targetNumber()}
            disabled
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
