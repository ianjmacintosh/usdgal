export default {
  // Meta Data
  meta_title: "Convertidor de precios del gas",
  meta_description:
    "Convierte instantáneamente los precios de la gasolina en unidades y divisas extranjeras",
  meta_canonical_url: "https://gasco.st/es/",
  meta_og_image_url: "https://gasco.st/banner-es.png",

  // App.tsx
  gasCost: "Precio de la Gasolina",
  convertedGasCost: "Precio Convertido de la Gasolina",
  exchangeRatesLastUpdated: "Última actualización de los tipos de cambio:",

  // footer.tsx
  aboutSite: "Acerca de este sitio",
  sourceCode: "Código fuente",
  language: "Idioma",

  // currency-select.tsx
  searchForCurrency: "Buscar una moneda...",

  // ConversionTable.tsx
  showDetails: "Mostrar detalles",
  hideDetails: "Ocultar detalles",
  conversionDetails: "Detalles de conversión",
  cost: "Costo",
  currencyConversionRate: "Tasa de conversión de moneda",
  volumeConversionRate: "Tasa de conversión de volumen",
  convertedCost: "Costo convertido",
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
    gallon {galón}
    other {{unit}}
    }`,

  // language-alert.tsx
  languageAlertText: "Ir a la versión española de este sitio",

  // GasPrice.tsx
  tinyNumber:
    "Este importe se muestra como {displayNumber} {currency}, pero el importe real es menor ({number} {currency})",
  amountPaidPerUnit: "Importe de {currency} pagado por {unit} de gasolina",

  // Unit.tsx
  perLiter: "por litro",
  perGallon: "por galón",
  unitOfSale: "Unidad de venta (litros o galones)",
};
