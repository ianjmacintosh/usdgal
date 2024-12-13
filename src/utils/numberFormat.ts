type SupportedUnits = "liter" | "gallon";

const getNumberFormatChar = (
  char: "decimalSeparatorChar" | "groupingSeparatorChar",
  locale: string,
) => {
  const numberFormat = new Intl.NumberFormat(locale);
  const chars = {
    groupingSeparatorChar: numberFormat.format(1111).replace(/\d/g, ""),
    decimalSeparatorChar: numberFormat.format(1.1).replace(/\d/g, ""),
  };

  return chars[char];
};

const getFormattedPrice = (
  price: number,
  userLocale = "en-US",
  currency = "USD",
) => {
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

/**
 * Convert the new price from the source currency to the target currency
 * Multiply by LITERS_PER_GALLON if the source currency is the local currency, divide by LITERS_PER_GALLON if it is the home currency
 */
const getUnits = (
  price: number,
  fromUnit: SupportedUnits,
  toUnit: SupportedUnits,
) => {
  const LITERS_PER_GALLON = 3.78541;
  if (fromUnit === "liter" && toUnit === "gallon") {
    return price * LITERS_PER_GALLON;
  }
  if (fromUnit === "gallon" && toUnit === "liter") {
    return price / LITERS_PER_GALLON;
  }
  return price;
};

export { getUnits, getNumberFormatChar, getFormattedPrice, isLegalPriceValue };
