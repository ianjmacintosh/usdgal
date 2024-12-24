import { describe, test, expect } from "vitest";
import { getFormattedPrice } from "./numberFormat";

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
