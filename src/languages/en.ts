export default {
  // App.tsx
  gasCost: "Gas Cost",
  convertedGasCost: "Converted Gas Cost",
  exchangeRatesLastUpdated: "Exchange rates last updated:",
  sourceCode: "Source code",

  // ConversionTable.tsx
  showDetails: "Show Details",
  hideDetails: "Hide Details",
  conversionDetails: "Conversion Details",
  cost: "Cost",
  currencyConversionRate: "Currency conversion rate",
  volumeConversionRate: "Volume conversion rate",
  convertedCost: "Converted cost",

  liter: `{quantity, plural,
  one {liter}
  other {liters}
}`,
  gallon: `{quantity, plural,
  one {gallon}
  other {gallons}
}`,
  gasPriceFormula: "{number} {currency} per {unit}",

  // GasPrice.tsx
  tinyNumber:
    "This amount is displayed as {displayNumber} {currency}, but the actual amount is less ({number} {currency})",
  amountPaidPerUnit: "Amount of {currency} paid per {unit} of gas",

  // LanguageSelect.tsx
  language: "Language:",

  // Unit.tsx
  perLiter: "per liter",
  perGallon: "per gallon",
  unitOfSale: "Unit of sale (liters or gallons)",
};
