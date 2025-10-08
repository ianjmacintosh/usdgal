export default {
  // Meta Data
  meta_title: "Gaspreis-Umrechner",
  meta_description:
    "Sofortige Umrechnung der in ausländischen Einheiten und Währungen angegebenen Benzinpreise",
  meta_canonical_url: "https://gasco.st/de/",
  meta_og_image_url: "https://gasco.st/banner-de.png",

  // App.tsx
  gasCost: "Gaskosten",
  convertedGasCost: "Umgerechnete Gaskosten",
  exchangeRatesLastUpdated: "Zuletzt aktualisierte Wechselkurse:",

  // footer.tsx
  aboutSite: "Über diese Website",
  sourceCode: "Quellcode",
  language: "Sprache",

  // currency-select.tsx
  searchForCurrency: "Suche nach einer Währung...",

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

  // language-alert.tsx
  languageAlertText: "Gehen Sie zur deutschen Version dieser Website",

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
