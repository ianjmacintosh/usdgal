import { describe, expect, test } from "vitest";
import { gasPricesReducer, getInitialGasPrices } from "./gas-price-context";
import { GasPrices, GasPricesAction } from "./gas-price-context";

const LITERS_IN_A_GALLON = 3.78541;

describe("gasPricesReducer", () => {
  const fakeExchangeRates = {
    rates: {
      USD: 1,
      EUR: 1,
      BRL: 6,
    },
  };

  const startingGasPrices = (): GasPrices => {
    return {
      top: { number: 1, currency: "USD", unit: "liter" },
      bottom: { number: 1, currency: "USD", unit: "liter" },
      driver: "top",
    };
  };

  test("updates bottom gas number when bottom unit changes and top is driving", () => {
    const action = {
      type: "update",
      id: "bottom",
      payload: { key: "unit", value: "gallon" },
    } as GasPricesAction;

    const updatedGasPrices = gasPricesReducer(startingGasPrices(), action, {
      exchangeRates: fakeExchangeRates,
    });

    const expectedGasPrices = {
      top: { number: 1, currency: "USD", unit: "liter" },
      bottom: {
        number: 1 * LITERS_IN_A_GALLON,
        currency: "USD",
        unit: "gallon",
      },
      driver: "top",
    };

    expect(updatedGasPrices).toEqual(expectedGasPrices);
  });

  test("updates bottom gas number when bottom currency changes and top is driving", () => {
    const action = {
      type: "update",
      id: "bottom",
      payload: { key: "currency", value: "BRL" },
    } as GasPricesAction;

    const updatedGasPrices = gasPricesReducer(startingGasPrices(), action, {
      exchangeRates: fakeExchangeRates,
    });

    const expectedGasPrices = {
      top: { number: 1, currency: "USD", unit: "liter" },
      bottom: {
        number: 6,
        currency: "BRL",
        unit: "liter",
      },
      driver: "top",
    } as GasPrices;

    expect(updatedGasPrices).toEqual(expectedGasPrices);
  });

  test("updates top gas number when bottom number changes and top was driving", () => {
    const action = {
      type: "update",
      id: "bottom",
      payload: { key: "number", value: 3 },
    } as GasPricesAction;

    const updatedGasPrices = gasPricesReducer(startingGasPrices(), action, {
      exchangeRates: fakeExchangeRates,
    });

    const expectedGasPrices = {
      top: { number: 3, currency: "USD", unit: "liter" },
      bottom: { number: 3, currency: "USD", unit: "liter" },
      driver: "bottom",
    };

    expect(updatedGasPrices).toEqual(expectedGasPrices);
  });
});

describe("getInitialGasPrices", () => {
  test("converts from BRL to USD for Brazilians in Brazil", () => {
    const expectedGasPrices = {
      top: { number: 0, currency: "BRL", unit: "liter" },
      bottom: { number: 0, currency: "USD", unit: "gallon" },
      driver: "top",
    };

    expect(getInitialGasPrices("BR", "BR")).toEqual(expectedGasPrices);
  });
});
