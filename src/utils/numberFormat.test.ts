import { describe, test, expect } from "vitest";
import {
  getFormattedPrice,
  getParsedNumber,
  isLegalPriceValue,
  isTinyNumber,
} from "./numberFormat";

describe("getParsedNumber method", () => {
  test("parses '1,000.00' in en-US as 1000", () => {
    const displayNumber = "1,000.00";
    const result = getParsedNumber(displayNumber, "en-US");
    expect(result).toBe(1000);
  });

  test("parses '1.000,00' in pt-BR as 1000", () => {
    const displayNumber = "1.000,00";
    const result = getParsedNumber(displayNumber, "pt-BR");
    expect(result).toBe(1000);
  });
});

describe("getFormattedPrice method", () => {
  test("formats tiny non-0 prices as the smallest practical value possible for the currency", () => {
    const tinyValue = 0.00001;
    let result = "";

    // JPY just uses integers
    result = getFormattedPrice(tinyValue, "en-US", "JPY");
    expect(result).toBe("1");

    // USD uses 2 decimal places
    result = getFormattedPrice(tinyValue, "en-US", "USD");

    expect(result).toBe("0.01");

    // TND uses 3 decimal places
    result = getFormattedPrice(tinyValue, "en-US", "TND");

    expect(result).toBe("0.001");
  });
});

describe("isTinyNumber method", () => {
  let tinyValue = 0.00001;
  const userLanguage = "en-US";
  let userCurrency = "USD";

  test("returns true for 0.00001 USD in en-US", () => {
    expect(isTinyNumber(tinyValue, userLanguage, userCurrency)).toBe(true);
  });

  test("returns false for 0", () => {
    tinyValue = 0;
    expect(isTinyNumber(tinyValue, userLanguage, userCurrency)).toBe(false);
  });

  test("returns false for numbers that can be expressed with the currency's decimal places", () => {
    tinyValue = 0.001;
    userCurrency = "TND";
    expect(isTinyNumber(tinyValue, userLanguage, userCurrency)).toBe(false);
  });
});

describe("isLegalPriceValue method", () => {
  const letters = "1234a58";
  const multiple_commas = "1,000,000";
  const multiple_periods = "1.000.000";
  const period_right_of_comma = "1,000.00";
  const period_left_of_comma = "1.000,00";
  const starts_with_period = ".123";
  const starts_with_comma = ",123";

  test("supports obvious tests for 123,456.89 type systems (en-US)", () => {
    const locale = "en-US";

    expect(isLegalPriceValue(letters, locale)).toBe(false);
    expect(isLegalPriceValue(multiple_commas, locale)).toBe(true);
    expect(isLegalPriceValue(multiple_periods, locale)).toBe(false);
    expect(isLegalPriceValue(period_right_of_comma, locale)).toBe(true);
    expect(isLegalPriceValue(period_left_of_comma, locale)).toBe(false);
    expect(isLegalPriceValue(starts_with_period, locale)).toBe(true);
    expect(isLegalPriceValue(starts_with_comma, locale)).toBe(true);
  });

  test("supports obvious tests for 123.456,89 type systems (pt-BR)", () => {
    const locale = "pt-BR";

    expect(isLegalPriceValue(letters, locale)).toBe(false);
    expect(isLegalPriceValue(multiple_commas, locale)).toBe(false);
    expect(isLegalPriceValue(multiple_periods, locale)).toBe(true);
    expect(isLegalPriceValue(period_right_of_comma, locale)).toBe(false);
    expect(isLegalPriceValue(period_left_of_comma, locale)).toBe(true);
    expect(isLegalPriceValue(starts_with_period, locale)).toBe(true);
    expect(isLegalPriceValue(starts_with_comma, locale)).toBe(true);
  });
});
