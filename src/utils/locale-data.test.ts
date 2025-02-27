import { describe, test, expect } from "vitest";
import { getCurrencyByCountry, getUnitsByCountry } from "./locale-data";

describe("getCurrencyByCountry method", () => {
  test("returns the currency for a given country", () => {
    let result = "USD";

    result = getCurrencyByCountry("US");
    expect(result).toBe("USD");

    result = getCurrencyByCountry("BR");
    expect(result).toBe("BRL");
  });
});

describe("getUnitsByCountry method", () => {
  test("returns the units for a given country", () => {
    let result = "liter";

    result = getUnitsByCountry("US");
    expect(result).toBe("gallon");

    result = getUnitsByCountry("BR");
    expect(result).toBe("liter");
  });
});
