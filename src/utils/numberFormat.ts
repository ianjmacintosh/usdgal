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

const isTinyNumber = (
  number: number,
  userLocale = "en-US",
  currency = "USD",
) => {
  if (number === 0 || number >= 1) {
    return false;
  }

  const formattedNumber = Intl.NumberFormat(userLocale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "code",
  })
    .format(number)
    .replace(currency, "")
    .trim();

  if (Number(formattedNumber) === 0) {
    return true;
  }

  return false;
};

const getFormattedPrice = (
  price: number,
  userLocale = "en-US",
  currency = "USD",
) => {
  let formattedNumber = String(price);

  formattedNumber = Intl.NumberFormat(userLocale, {
    style: "currency",
    currency: currency,
    currencyDisplay: "code",
  })
    .format(price)
    .replace(currency, "")
    .trim();

  // If we're formatting the number to look like 0 but the value isn't 0,
  //  replace the last 0 with a 1
  if (isTinyNumber(price, userLocale, currency)) {
    formattedNumber = formattedNumber.replace(/0$/, "1");
  }

  return formattedNumber;
};

const isLegalPriceValue = (price: string, userLocale: string) => {
  const decimalSeparatorChar = getNumberFormatChar(
    "decimalSeparatorChar",
    userLocale,
  );
  const groupingSeparatorChar = getNumberFormatChar(
    "groupingSeparatorChar",
    userLocale,
  );

  // Empty string is OK!
  if (price === "") return true;

  // Generate a regular expression that confirms a character is legal for systems of writing that use commas and periods
  const isOnlyLegalChars = new RegExp(/^([0-9\\,\\.]*)$/);

  // If the new value is not "" and the new char is not a number, return
  if (isOnlyLegalChars.test(price) === false) return false;

  // Is this something that someone logically type if they were writing a number out one character at a time?
  // Only one decimal separator is allowed
  if (
    price.split(decimalSeparatorChar).length > 2 ||
    // No grouping separators allowed after the decimal separator
    price.split(decimalSeparatorChar)[1]?.split(groupingSeparatorChar).length >
      1
  ) {
    return false;
  }

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

export {
  getUnits,
  getNumberFormatChar,
  getFormattedPrice,
  isLegalPriceValue,
  isTinyNumber,
};
