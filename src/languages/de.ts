export default {
  // App.tsx
  gasCost: "Gaskosten",
  convertedGasCost: "Umgerechnete Gaskosten",
  exchangeRatesLastUpdated: "Zuletzt aktualisierte Wechselkurse:",
  sourceCode: "Quellcode",
  language: "Sprache:",

  // ConversionTable.tsx
  showDetails: "Details anzeigen",
  hideDetails: "Details ausblenden",
  conversionDetails: "Umrechnungsdetails",
  cost: "Kosten",
  currencyConversionRate: "Währungsumrechnungskurs",
  volumeConversionRate: "Volumenumrechnungskurs",
  convertedCost: "Umgerechnete Kosten",
  liter: `{quantity, plural,
  one {Liter}
  other {Litern}
}`,
  gallon: `{quantity, plural,
  one {Gallone}
  other {Gallonen}
}`,
  gasPriceFormula: `{number} {currency} pro {unit, select,
liter {Liter}
gallon {Gallone}
other {{unit}}
}`,

  // GasPrice.tsx
  tinyNumber:
    "Dieser Betrag wird als {displayNumber} {currency} angezeigt, aber der tatsächliche Betrag ist geringer ({number} {currency})",
  amountPaidPerUnit:
    "Betrag von {currency}, der pro {unit} Benzin gezahlt wird",

  // Unit.tsx
  perLiter: "pro Liter",
  perGallon: "pro Gallone",
  unitOfSale: "Verkaufseinheit (Liter oder Gallonen)",
};
