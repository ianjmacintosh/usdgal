import { useEffect, useState } from "react";
import GithubLogo from "./assets/github.svg?react";
import "./App.css";
import getGasPrice from "./utils/getGasPrice";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData";

type SupportedUnits = "liter" | "gallon";

function App() {
  const userLocale = "en-US";
  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] = useState<string>("BRL");
  const [topUnit, setTopUnit] = useState<SupportedUnits>("liter");
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] = useState<string>("USD");
  const [bottomUnit, setBottomUnit] = useState<SupportedUnits>("gallon");
  const [isUpdatingBottomNumber, setIsUpdatingBottomNumber] = useState(true);

  useEffect(() => {
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
    bottomNumber,
  ]);

  return (
    <>
      <div className="container">
        <h1 className="text-xl font-bold my-2">Gas Cost</h1>
        <p className="mt-2 mb-4 text-lg">
          Instantly convert gasoline prices listed in foreign units and
          currencies.
        </p>
        <h2 className="text-lg font-bold mt-2">Cost</h2>
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
        />

        <h2 className="text-lg font-bold mt-2">Converted Cost</h2>
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
        />
        <ConversionTable
          topNumber={topNumber}
          bottomNumber={bottomNumber}
          topUnit={topUnit}
          bottomUnit={bottomUnit}
          topCurrency={topCurrency}
          bottomCurrency={bottomCurrency}
          exchangeRateData={exchangeRateData}
          userLocale={userLocale}
        />
        <p className="my-2 text-sm">
          <em>
            Exchange rates last updated:{" "}
            {Intl.DateTimeFormat(userLocale, { dateStyle: "medium" }).format(
              exchangeRateData.timestamp * 1000,
            ) ?? "Unknown"}
          </em>
        </p>
      </div>
      <footer>
        <nav>
          <ul>
            <li>
              <a
                href="https://www.github.com/ianjmacintosh/usdgal"
                target="_blank"
              >
                <span>Source code</span>
                <GithubLogo height={18} width={18} />
              </a>
            </li>
          </ul>
        </nav>
        &copy; 2024{" "}
        <a href="https://www.ianjmacintosh.com/" target="_blank">
          Ian J. MacIntosh
        </a>
      </footer>
    </>
  );
}

export default App;
