export default {
  // Meta Data
  meta_title: "Conversor de preço de combustível",
  meta_description:
    "Converta preços de combustível listados em litros ou galões, vendidos em dólares, euros, e outras moedas estrangeiras",
  meta_canonical_url: "https://gasco.st/pt/",
  meta_og_image_url: "https://gasco.st/banner-pt.png",

  // App.tsx
  gasCost: "Preço da Gasolina",
  convertedGasCost: "Preço da Gasolina Convertida",
  exchangeRatesLastUpdated: "Última atualização das taxas de câmbio:",
  sourceCode: "Código-fonte",
  language: "Idioma",

  // currency-select.tsx
  searchForCurrency: "Pesquisar uma moeda...",

  // ConversionTable.tsx
  showDetails: "Mostrar detalhes",
  hideDetails: "Ocultar detalhes",
  conversionDetails: "Detalhes da conversão",
  cost: "Custo",
  currencyConversionRate: "Taxa de conversão de moeda",
  volumeConversionRate: "Taxa de conversão de volume",
  convertedCost: "Custo convertido",
  liter: `{quantity, plural,
  one {litro}
  other {litros}
}`,
  gallon: `{quantity, plural,
  one {galão}
  other {galões}
}`,

  gasPriceFormula: `{number} {currency} por {unit, select,
liter {litro}
gallon {galão}
other {{unit}}
}`,

  // language-alert.tsx
  languageAlertText: "Acesse a versão em português deste site",

  // GasPrice.tsx
  tinyNumber:
    "Este valor é exibido como {displayNumber} {currency}, mas o valor real é menor ({number} {currency})",
  amountPaidPerUnit: "Quantidade de {currency} paga por {unit} de gás",

  // Unit.tsx
  perLiter: "por litro",
  perGallon: "por galão",
  unitOfSale: "Unidade de venda (litros ou galões)",
};
