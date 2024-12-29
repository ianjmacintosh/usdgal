export default {
  // App.tsx
  gasCost: "Precio de la Gasolina",
  convertedGasCost: "Precio Convertido de la Gasolina",
  exchangeRatesLastUpdated: "Última actualización de los tipos de cambio:",
  sourceCode: "Código fuente",
  language: "Idioma:",

  // ConversionTable.tsx
  showDetails: "Mostrar detalles",
  hideDetails: "Ocultar detalles",
  conversionDetails: "Detalles de conversión",
  cost: "Costo",
  currencyConversionRate: "Tasa de conversión de moneda",
  volumeConversionRate: "Tasa de conversión de volumen",
  convertedCost: "Costo convertido",
  volumeFormulaPerBottomUnit: `{topUnitCount} {topUnit, select,
    liter {litros}
    gallon {galones}
    other {{topUnit}}
 } = 1
  {bottomUnit, select,
  liter {litro}
  gallon {galón}
  other {{bottomUnit}}
  }`,
  volumeFormulaPerTopUnit: `1 {topUnit, select,
    liter {litro}
    gallon {galón}
    other {{topUnit}}
 } = {bottomUnitCount}
  {bottomUnit, select,
  liter {litros}
  gallon {galones}
  other {{bottomUnit}}
  }`,
  gasPriceFormula: `{number} {currency} por {unit, select,
    liter {litro}
    gallon {galón}
    other {{unit}}
    }`,

  // GasPrice.tsx
  tinyNumber:
    "Este importe se muestra como {displayNumber} {currency}, pero el importe real es menor ({number} {currency})",
  amountPaidPerUnit: "Importe de {currency} pagado por {unit} de gasolina",

  // Unit.tsx
  perLiter: "por litro",
  perGallon: "por galón",
  unitOfSale: "Unidad de venta (litros o galones)",
};
