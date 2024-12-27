import { useEffect, useState } from "react";
import GithubLogo from "./assets/github.svg?react";
import "./App.css";
import getGasPrice from "./utils/getGasPrice";

import GasPrice from "./GasPrice";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData";
import { getCurrencyByCountry, getUnitsByCountry } from "./utils/localeData";
import { fetchCountryCode } from "./utils/api";
import { IntlProvider, FormattedMessage } from "react-intl";
import en from "./languages/en";
import es from "./languages/es";

type SupportedUnits = "liter" | "gallon";

function App({ userLanguage: userLanguageProp }: { userLanguage?: string }) {
  const userLanguage = userLanguageProp || navigator.language || "en-US";
  const userLanguageWithoutRegion = userLanguage.split("-")[0];
  const userHomeCountry = userLanguage.split("-")[1] || "US";

  const getMessages = (language: string) => {
    switch (language) {
      case "en":
        return en;
      case "es":
        return es;
      default:
        return en;
    }
  };

  const [i18nMessages] = useState(getMessages(userLanguageWithoutRegion));

  // Gas price values (price, currency, units)
  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] = useState<string>("");
  const [topUnit, setTopUnit] = useState<SupportedUnits | "">("");

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
      let countryCode = await fetchCountryCode();
      if (!ignore) {
        // If the user is in their home country, let's guess where they want to go
        if (countryCode === userHomeCountry) {
          countryCode = userHomeCountry === "US" ? "MX" : "US";
        }
        const currency = getCurrencyByCountry(countryCode);
        const units = getUnitsByCountry(countryCode);
        setTopCurrency(currency);
        setTopUnit(units as SupportedUnits);
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
      <IntlProvider locale={userLanguage} messages={i18nMessages}>
        <div className="container">
          <h2 className="text-3xl font-bold my-4">
            <FormattedMessage id="gasCost" />
          </h2>
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
              {Intl.DateTimeFormat(userLanguage, {
                dateStyle: "medium",
              }).format(exchangeRateData.timestamp * 1000) ?? "Unknown"}
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
      </IntlProvider>
    </>
  );
}

export default App;
