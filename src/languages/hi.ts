export default {
  // App.tsx
  gasCost: "गैस लागत",
  convertedGasCost: "रूपांतरित गैस लागत",
  exchangeRatesLastUpdated: "विनिमय दरें अंतिम बार अपडेट की गईं:",
  sourceCode: "स्रोत कोड",
  language: "भाषा:",

  // ConversionTable.tsx
  showDetails: "विवरण दिखाएँ",
  hideDetails: "विवरण छिपाएँ",
  conversionDetails: "रूपांतरण विवरण",
  cost: "लागत",
  currencyConversionRate: "मुद्रा रूपांतरण दर",
  volumeConversionRate: "मात्रा रूपांतरण दर",
  convertedCost: "रूपांतरित लागत",
  liter: `{quantity, plural,
  one {litro}
  other {litros}
}`,
  gallon: `{quantity, plural,
  one {galón}
  other {galones}
}`,
  gasPriceFormula: `{number} {currency} por {unit, select,
liter {litro}
gallon {galão}
other {{unit}}
}`,

  // GasPrice.tsx
  tinyNumber:
    "यह राशि इस प्रकार प्रदर्शित होती है {displayNumber} {currency}, लेकिन वास्तविक राशि कम है ({number} {currency})",
  amountPaidPerUnit: "गैस की प्रति {currency} भुगतान की गई {unit} की राशि",

  // Unit.tsx
  perLiter: "प्रति लीटर",
  perGallon: "प्रति गैलन",
  unitOfSale: "बिक्री की इकाई (लीटर या गैलन)",
};
