import exchangeRateData from "../exchangeRateData";
import { getUnits } from "./numberFormat";
type SupportedUnits = "liter" | "gallon";

const getPriceInCurrency = (
  price: number,
  currency: string,
  targetCurrency: string,
  exchangeRates: { [key: string]: number } = exchangeRateData.rates,
) => {
  const sourceCurrencyExchangeRate = exchangeRates[currency] ?? 1;
  const targetCurrencyExchangeRate = exchangeRates[targetCurrency] ?? 1;
  let newValue = 0;
  // Get the price in the base currency, then convert from the base currency to target currency
  newValue = (price / sourceCurrencyExchangeRate) * targetCurrencyExchangeRate;

  if (Number.isNaN(newValue)) {
    newValue = 0;
  }

  return newValue;
};

const getGasPrice = (
  sourceNumber: number | null,
  sourceCurrency: string | null,
  sourceUnit: SupportedUnits | null,
  targetCurrency: string | null,
  targetUnit: SupportedUnits | null,
  exchangeRates?: { [key: string]: number },
) => {
  // Return 0 if we're missing info
  if (
    sourceCurrency === null ||
    sourceNumber === null ||
    sourceUnit === null ||
    targetCurrency === null ||
    targetUnit === null
  ) {
    return 0;
  }
  // Convert that number from using source units to target units
  let result = getUnits(sourceNumber, sourceUnit, targetUnit);

  // Convert _that_ number using the exchange rate from source currency to target currency
  result = getPriceInCurrency(
    result,
    sourceCurrency,
    targetCurrency,
    exchangeRates,
  );

  return result;
};

export default getGasPrice;
