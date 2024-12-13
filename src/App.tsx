import { useEffect, useState } from "react";
import "./App.css";
import { getUnits } from "./utils/numberFormat";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData";

type SupportedUnits = "liter" | "gallon";

function App() {
  // const userLocale = "en-US";
  const exchangeRates = exchangeRateData.rates as Record<string, number>
  const currencies = Object.keys(exchangeRateData.rates)

  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] = useState<string>("BRL");
  const [topUnit, setTopUnit] = useState<SupportedUnits>("liter");
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] =
    useState<string>("USD");
  const [bottomUnit, setBottomUnit] = useState<SupportedUnits>("gallon");
  const [isUpdatingBottomNumber, setIsUpdatingBottomNumber] = useState(true);

  useEffect(() => {
    const getGasPrice = (
      sourceNumber: number,
      sourceCurrency: string,
      sourceUnit: SupportedUnits,
      targetCurrency: string,
      targetUnit: SupportedUnits,
    ) => {
      const getPriceInCurrency = (
        price: number,
        currency: string,
        targetCurrency: string,
      ) => {
        const sourceCurrencyExchangeRate = exchangeRates[currency] ?? 1;
        const targetCurrencyExchangeRate = exchangeRates[targetCurrency] ?? 1;
        let newValue = 0;
        // Get the price in USD, then convert from USD to target currency
        newValue = Number(price / sourceCurrencyExchangeRate) * targetCurrencyExchangeRate;

        if (Number.isNaN(newValue)) {
          newValue = 0;
        }

        return newValue;
      };

      // Convert that number from using source units to target units
      let result = getUnits(sourceNumber, sourceUnit, targetUnit);

      // Convert _that_ number using the exchange rate from source currency to target currency
      result = getPriceInCurrency(result, sourceCurrency, targetCurrency);

      return result;
    };

    if (isUpdatingBottomNumber) {
      const newResult = getGasPrice(
        topNumber,
        topCurrency,
        topUnit,
        bottomCurrency,
        bottomUnit,
      );
      setBottomNumber(newResult);
    } else {
      const newResult = getGasPrice(
        bottomNumber,
        bottomCurrency,
        bottomUnit,
        topCurrency,
        topUnit,
      );
      setTopNumber(newResult);
    }
  }, [
    isUpdatingBottomNumber,
    topNumber,
    topCurrency,
    topUnit,
    bottomCurrency,
    bottomUnit,
    bottomNumber
  ]);

  return (
    <>
      <div className="container">
        <h1>Convert Foreign Gas Price</h1>
        <GasPrice
          label="From"
          number={topNumber}
          currency={topCurrency}
          unit={topUnit}
          onNumberChange={(newNumber: number) => {
            setIsUpdatingBottomNumber(true);
            setTopNumber(newNumber);
          }}
          onUnitChange={(newUnit: SupportedUnits) => {
            setTopUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: string) => {
            setTopCurrency(newCurrency);
          }}
          currencies={currencies}
        />
        <ConversionTable
          sourceUnit={topUnit}
          targetUnit={bottomUnit}
          sourceCurrency={topCurrency}
          targetCurrency={bottomCurrency}
          exchangeRateData={exchangeRateData}
        />
        <GasPrice
          label="To"
          number={bottomNumber}
          currency={bottomCurrency}
          onNumberChange={(newValue: number) => {
            setIsUpdatingBottomNumber(false);
            setBottomNumber(newValue);
          }}
          unit={bottomUnit}
          onUnitChange={(newUnit: SupportedUnits) => {
            setBottomUnit(newUnit);
          }}
          onCurrencyChange={(newCurrency: string) => {
            setBottomCurrency(newCurrency);
          }}
          currencies={currencies}
        ></GasPrice>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
