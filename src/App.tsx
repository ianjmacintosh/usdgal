import { useEffect, useState } from "react";
import GithubLogo from "./assets/github.svg?react";
import "./App.css";
import getGasPrice from "./utils/getGasPrice";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData";
import { getCurrencyByCountry, getUnitsByCountry } from "./utils/localeData";
import { fetchCountryCode } from "./utils/api";

type SupportedUnits = "liter" | "gallon";

function App({
  userLanguage: userLanguageProp,
  defaultUserLocation: defaultUserLocationProp,
}: {
  userLanguage?: string;
  defaultUserLocation?: string;
}) {
  const userLanguage = userLanguageProp || navigator.language || "en-US";
  const userHomeCountry = userLanguage.split("-")[1] || "US";

  // If we can't geolocate the user, we can guess what they're trying to do based on their language
  // If their language is US-based, maybe they're planning a trip to Mexico and want to convert Mexican gas prices
  // If their language isn't US-based, maybe they're in the US (or planning a trip to the US) and want to convert US gas prices
  const defaultUserLocation =
    defaultUserLocationProp || userHomeCountry === "US" ? "MX" : "US";

  // Gas price values (price, currency, units)
  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] = useState(() => {
    return getCurrencyByCountry(defaultUserLocation);
  });
  const [topUnit, setTopUnit] = useState<SupportedUnits>(
    getUnitsByCountry(defaultUserLocation) as SupportedUnits,
  );

  // Converted gas price values (price, currency, units)
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] = useState<string>(
    getCurrencyByCountry(userHomeCountry),
  );
  const [bottomUnit, setBottomUnit] = useState<SupportedUnits>(
    getUnitsByCountry(userHomeCountry) as SupportedUnits,
  );

  // Whether we're updating the top or bottom number
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

  useEffect(() => {
    async function startFetching() {
      const countryCode = await fetchCountryCode();
      if (!ignore) {
        const currency = getCurrencyByCountry(countryCode);
        setTopCurrency(currency);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="text-3xl font-bold my-4">Gas Cost</h2>
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
          userLanguage={userLanguage}
        />

        <h2 className="text-3xl font-bold my-4">Converted Gas Cost</h2>
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
          userLanguage={userLanguage}
        />
        <p className="my-2 text-sm">
          <em>
            Exchange rates last updated:{" "}
            {Intl.DateTimeFormat(userLanguage, { dateStyle: "medium" }).format(
              exchangeRateData.timestamp * 1000,
            ) ?? "Unknown"}
          </em>
        </p>
        <ConversionTable
          topNumber={topNumber}
          bottomNumber={bottomNumber}
          topUnit={topUnit}
          bottomUnit={bottomUnit}
          topCurrency={topCurrency}
          bottomCurrency={bottomCurrency}
          exchangeRateData={exchangeRateData}
        />
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
