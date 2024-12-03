import { useMemo, useState } from "react";
import "./App.css";
import getNumberFormatChar from "./utils/numberFormat";

import GasPrice from "./GasPrice";

function App() {
  const LITERS_PER_GALLON = 3.78541;
  const userLocale = "en-US";

  const [localCurrency] = useState("BRL");
  const [homeCurrency] = useState("USD");
  const [localPrice, setLocalPrice] = useState("");
  const [homePrice, setHomePrice] = useState("0.00");
  // This table shows how much a dollar costs
  // Updated on 2024-11-17
  const dollarCost = useMemo(
    (): { [key: string]: number } => ({
      BRL: 5.7955874,
      USD: 1,
    }),
    [],
  );
  const getPriceInCurrency = (
    price: number,
    currency: string,
    targetCurrency: string,
  ) => {
    // Get the price in USD, then convert from USD to target currency
    let newValue = Number(
      (price / dollarCost[currency]) * dollarCost[targetCurrency],
    );

    if (Number.isNaN(newValue)) {
      newValue = 0;
    }

    return newValue;
  };

  const getFormattedPrice = (price: number, userLocale = "en-US") => {
    return Intl.NumberFormat(userLocale, {
      style: "currency",
      currency: localCurrency,
      currencyDisplay: "code",
    })
      .format(price)
      .replace(localCurrency, "")
      .trim();
  };

  const isLegalPriceValue = (price: string) => {
    // Generate a regular expression that confirms a character is legal for en-US formatting
    const isLegalPriceChar = new RegExp(/[0-9\\.\\,]/);

    // Is this something that someone logically type if they were writing a number out one character at a time?
    // RegExp should allow values:
    // - Any number of digits (including after the decimal point)
    // - Any number of commas
    // - Could start or end with a decimal point
    // - Optionally, one decimal point
    // - No commas allowed after the decimal point
    const isLegalPrice = new RegExp(/^(\d{0,}(,\d{0,})*|\d*)?(\.\d*)?$/);

    const newChar = price?.slice(-1);
    // If the new value is not "" and the new char is not a number, return
    if (price && isLegalPriceChar.test(newChar) === false) return false;

    // If the new value is not a number, return
    if (isLegalPrice.test(price) === false) return false;

    return true;
  };

  const handleLocalPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    if (isLegalPriceValue(newValue) === false) return;

    setLocalPrice(newValue);

    const newValueAsNumber = Number(
      newValue.replaceAll(getNumberFormatChar("groupingSeparatorChar", userLocale), ""),
    );

    const newHomePrice = getPriceInCurrency(
      newValueAsNumber * LITERS_PER_GALLON,
      localCurrency,
      homeCurrency,
    );
    const newFormattedHomePrice = getFormattedPrice(newHomePrice, userLocale);

    setHomePrice(newFormattedHomePrice);
  };

  const handleHomePriceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;

    if (isLegalPriceValue(newValue) === false) return;

    setHomePrice(newValue);

    const newValueAsNumber = Number(
      newValue.replaceAll(getNumberFormatChar("groupingSeparatorChar", userLocale), ""),
    );

    const newLocalPrice = getPriceInCurrency(
      newValueAsNumber / LITERS_PER_GALLON,
      homeCurrency,
      localCurrency,
    );
    const newFormattedLocalPrice = getFormattedPrice(newLocalPrice, userLocale);

    setLocalPrice(newFormattedLocalPrice);
  };

  return (
    <>
      <div className="container">
        <h1>Convert Gas Price</h1>
        <fieldset>
          <GasPrice
            id="localPrice"
            label={`Local price (${localCurrency} per liter)`}
            price={localPrice}
            onChange={handleLocalPriceChange}
          />
          <table className="operations">
            <tbody>
              <tr>
                <td className="operation">× {LITERS_PER_GALLON}</td>
                <td className="operation-description">liters per gallon</td>
              </tr>
              <tr>
                <td className="operation">÷ {dollarCost[localCurrency]}</td>
                <td className="operation-description">
                  {localCurrency} per USD
                  <br />
                  <em>(updated 2024-11-17)</em>
                </td>
              </tr>
            </tbody>
          </table>
          <GasPrice
            id="homePrice"
            label={`Home price (${homeCurrency} per gallon)`}
            price={homePrice}
            onChange={handleHomePriceChange}
          ></GasPrice>
        </fieldset>
      </div>
      <footer>&copy; 2024 Ian J. MacIntosh</footer>
    </>
  );
}

export default App;
