const getNumberFormatChar = (char: "groupingSeparatorChar" | "decimalSeparatorChar", locale: string) => {
    const numberFormat = new Intl.NumberFormat(locale);
    const chars = {
        groupingSeparatorChar: numberFormat.format(1111).replace(/\d/g, ""),
        decimalSeparatorChar: numberFormat.format(1.1).replace(/\d/g, ""),
    }

    return chars[char]
};

const getFormattedPrice = (price: number, userLocale = "en-US", currency = "USD") => {
  return Intl.NumberFormat(userLocale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "code",
  })
    .format(price)
    .replace(currency, "")
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
const getPriceInCurrency = (
  price: number,
  currency: "BRL" | "USD",
  targetCurrency: "BRL" | "USD",
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

// This table shows how much a dollar costs
// Updated on 2024-11-17
const dollarCost = {
    BRL: 5.7955874,
    USD: 1,
    }

export { getNumberFormatChar, getFormattedPrice, isLegalPriceValue, getPriceInCurrency, dollarCost };