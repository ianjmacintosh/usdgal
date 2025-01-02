export default {
  // Meta Data
  meta_title: "Conversor de preço de gás",
  meta_description:
    "Converta instantaneamente os preços da gasolina listados em unidades e moedas estrangeiras",

  // App.tsx
  gasCost: "Preço da Gasolina",
  convertedGasCost: "Preço da Gasolina Convertida",
  exchangeRatesLastUpdated: "Última atualização das taxas de câmbio:",
  sourceCode: "Código-fonte",
  language: "Idioma:",

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

  // GasPrice.tsx
  tinyNumber:
    "Este valor é exibido como {displayNumber} {currency}, mas o valor real é menor ({number} {currency})",
  amountPaidPerUnit: "Quantidade de {currency} paga por {unit} de gás",

  // Unit.tsx
  perLiter: "por litro",
  perGallon: "por galão",
  unitOfSale: "Unidade de venda (litros ou galões)",
};
