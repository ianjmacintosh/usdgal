import { useEffect, useState } from "react";
import GithubLogo from "@/assets/github.svg?react";
import "./converter.css";
import getGasPrice from "@/utils/get-gas-price";

import GasPrice from "@/components/gas-price/gas-price";
import ConversionTable from "@/components/conversion-table/conversion-table";
import exchangeRateData from "@/utils/exchange-rate-data";
import { getCurrencyByCountry, getUnitsByCountry } from "@/utils/locale-data";
import { fetchCountryCode } from "@/utils/api";
import { FormattedMessage } from "react-intl";
import LanguageSelect from "@/components/language-select/language-select";
import Unit, { Units } from "@/components/unit/unit";
import Currency from "@/components/currency/currency";
import Number from "../number/number";

type ConverterProps = {
  userLanguage: string;
};

function Converter({ userLanguage: userLanguageProp }: ConverterProps) {
  const userLanguage = userLanguageProp;
  const userHomeCountry = userLanguage.split("-")[1] || "US";

  // Gas price values (price, currency, units)
  const [topNumber, setTopNumber] = useState(0);
  const [topCurrency, setTopCurrency] = useState<string>("");
  const [topUnit, setTopUnit] = useState<Units>("");

  // Converted gas price values (price, currency, units)
  const [bottomNumber, setBottomNumber] = useState(0);
  const [bottomCurrency, setBottomCurrency] = useState<string>(
    getCurrencyByCountry(userHomeCountry),
  );
  const [bottomUnit, setBottomUnit] = useState<Units>(
    getUnitsByCountry(userHomeCountry) as Units,
  );

  // Whether we're updating the top or bottom number
  const [isUpdatingBottomNumber] = useState(true);

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
        setTopUnit(units as Units);
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
        <h2 className="text-3xl font-bold my-4">
          <FormattedMessage id="gasCost" />
        </h2>
        <GasPrice label="From">
          <Number
            currency={topCurrency}
            label="Amount"
            onChange={setTopNumber}
            unit={topUnit}
            userLanguage={userLanguage}
            number={topNumber}
          />
          <Currency
            currency={topCurrency}
            onChange={(newCurrency: string) => {
              setTopCurrency(newCurrency);
            }}
            userLanguage={userLanguage}
          />
          <Unit
            id="top_unit"
            unit={topUnit}
            onChange={(newUnit: Units) => {
              setTopUnit(newUnit);
            }}
          />
        </GasPrice>

        <h2 className="text-3xl font-bold my-4">
          <FormattedMessage id="convertedGasCost" />
        </h2>
        <GasPrice label="To">
          <Number
            currency={bottomCurrency}
            label="Amount"
            onChange={setBottomNumber}
            unit={bottomUnit}
            userLanguage={userLanguage}
            number={bottomNumber}
          />
          <Currency
            currency={bottomCurrency}
            onChange={(newCurrency: string) => {
              setBottomCurrency(newCurrency);
            }}
            userLanguage={userLanguage}
          />
          <Unit
            id="bottom_unit"
            unit={bottomUnit}
            onChange={(newUnit: Units) => {
              setBottomUnit(newUnit);
            }}
          />
        </GasPrice>
        <p className="my-2 text-sm">
          <em>
            <FormattedMessage id="exchangeRatesLastUpdated" />{" "}
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
        <LanguageSelect userLanguage={userLanguage} />
        <nav>
          <ul>
            <li>
              <a
                href="https://www.github.com/ianjmacintosh/usdgal"
                target="_blank"
              >
                <span>
                  <FormattedMessage id="sourceCode" />
                </span>
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

export default Converter;
