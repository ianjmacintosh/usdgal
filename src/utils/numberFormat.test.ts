import { describe, test, expect } from "vitest";
import { getFormattedPrice, isTinyNumber } from "./numberFormat";

describe("getFormattedPrice method", () => {
  test("formats tiny non-0 prices as the smallest practical value possible for the currency", () => {
    const tinyValue = 0.00001
    let result = ""
    
    // JPY just uses integers
    result = getFormattedPrice(
      tinyValue,
      "en-US",
      "JPY",
    );
    expect(result).toBe("1");

    // USD uses 2 decimal places
    result = getFormattedPrice(
        tinyValue,
        "en-US",
        "USD",
      );
  
      expect(result).toBe("0.01");

    // TND uses 3 decimal places
    result = getFormattedPrice(
        tinyValue,
        "en-US",
        "TND",
      );
  
      expect(result).toBe("0.001");
  });
});

describe("isTinyNumber method", () => {
    let tinyValue = 0.00001
    const userLocale = "en-US"
    let userCurrency = "USD"

  test("returns true for 0.00001 USD in en-US", () => {
    expect(isTinyNumber(tinyValue, userLocale, userCurrency)).toBe(true)
  })

  test("returns false for 0", () => {
    tinyValue = 0
    expect(isTinyNumber(tinyValue, userLocale, userCurrency)).toBe(false)
  })

  test("returns false for numbers that can be expressed with the currency's decimal places", () => {
    tinyValue = 0.001
    userCurrency = "TND"
    expect(isTinyNumber(tinyValue, userLocale, userCurrency)).toBe(false)
})
})
