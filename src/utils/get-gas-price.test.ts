import { describe, test, expect } from "vitest";
import getGasPrice from "./get-gas-price";

describe("getGasPrice method", () => {
  const fakeExchangeRates = {
    BRL: 5,
    EUR: 1,
    USD: 1,
  };

  test("can handle a 1:5 exchange rate", () => {
    const result = getGasPrice(
      100,
      "USD",
      "gallon",
      "BRL",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(500);
  });

  test("can handle a 5:1 exchange rate", () => {
    const result = getGasPrice(
      500,
      "BRL",
      "gallon",
      "USD",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(100);
  });

  test("can handle a 1:1 exchange rate", () => {
    const result = getGasPrice(
      100,
      "USD",
      "gallon",
      "USD",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(100);
  });

  test("can handle a 5:5 exchange rate", () => {
    const result = getGasPrice(
      100,
      "BRL",
      "gallon",
      "BRL",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(100);
  });

  test("can convert a price in liters to a price in gallons", () => {
    const result = getGasPrice(
      1,
      "BRL",
      "liter",
      "BRL",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(3.78541);
  });

  test("can do no-op conversions", () => {
    const result = getGasPrice(
      1,
      "BRL",
      "gallon",
      "BRL",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(1);
  });

  test("can convert a price in gallons to a price in liters", () => {
    const result = getGasPrice(
      3.78541,
      "BRL",
      "gallon",
      "BRL",
      "liter",
      fakeExchangeRates,
    );

    expect(result).toBe(1);
  });

  test("can convert currencies and volumes simultaneously", () => {
    const result = getGasPrice(
      3.78541,
      "USD",
      "gallon",
      "BRL",
      "liter",
      fakeExchangeRates,
    );

    expect(result).toBe(5);
  });

  test("can do a no-op currency conversion and normal volume conversion", () => {
    const result = getGasPrice(
      3.78541,
      "USD",
      "gallon",
      "EUR",
      "liter",
      fakeExchangeRates,
    );

    expect(result).toBe(1);
  });

  test("can handle a missing source currency", () => {
    const result = getGasPrice(
      100,
      "",
      "gallon",
      "BRL",
      "gallon",
      fakeExchangeRates,
    );

    expect(result).toBe(0);
  });
});
