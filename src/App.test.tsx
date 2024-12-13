import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import getGasPrice from "./utils/getGasPrice";
import { getFormattedPrice } from "./utils/numberFormat";

describe("<App />", () => {
  const user = userEvent.setup();
  render(<App />);
  const topPriceInput = screen.getAllByLabelText(
    "Amount", { selector: 'input', exact: false },
  )[0] as HTMLInputElement;
  const topCurrencyInput = screen.getAllByLabelText(
    "Currency", { selector: 'select', exact: false },
  )[0] as HTMLSelectElement;
  const topUnitInput = screen.getAllByLabelText(
    "Unit of sale", { selector: 'select', exact: false },
  )[0] as HTMLSelectElement;
  const bottomPriceInput = screen.getAllByLabelText(
    "Amount", { selector: 'input', exact: false },
  )[1] as HTMLInputElement;
  const bottomCurrencyInput = screen.getAllByLabelText(
    "Currency", { selector: 'select', exact: false },
  )[1] as HTMLSelectElement;
  const bottomUnitInput = screen.getAllByLabelText(
    "Unit of sale", { selector: 'select', exact: false },
  )[1] as HTMLSelectElement;

  afterEach(() => {
    user.clear(topPriceInput);
  });

  test("correctly converts BRL per liter to USD per gallon", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    // Expect price to show correctly in USD
    await user.click(topPriceInput);
    await user.keyboard("6.78");
    expect(topPriceInput.value).toBe("6.78");

    // Get output
    // Expect output to be 4.43
    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(6.78, "BRL", "liter", "USD", "gallon"), "en-US", "USD"));
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    // Enter a new price of 6.73
    await user.click(topPriceInput);
    await user.keyboard("6.73");

    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(6.73, "BRL", "liter", "USD", "gallon"), "en-US", "USD"));
  });

  test("doesn't throw NaN errors when the user provides incomplete numbers", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.click(topPriceInput);
    await user.keyboard(".");

    expect(bottomPriceInput.value).not.toBe("NaN");
    expect(bottomPriceInput.value).toBe("0.00");

    await user.keyboard("{backspace}");
  });

  test("converts prices with commas from local to home", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.keyboard("1,000,000");

    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(1000000, "BRL", "liter", "USD", "gallon"), "en-US", "USD"));
  });

  test("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.click(topPriceInput);
    await user.keyboard("1234");
    expect(topPriceInput.value).toBe("1234");

    await user.selectOptions(topCurrencyInput, "USD");
    expect(topCurrencyInput.value).toBe("USD");

    await user.selectOptions(topUnitInput, "per gallon");
    expect(topUnitInput.value).toBe("gallon");

    expect(bottomPriceInput.value).toBe("1,234.00");
  });

  test("updates bottom price (but not top price) when the user updates the target currency or units", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.keyboard("6.78");

    await user.selectOptions(topCurrencyInput, "BRL");
    await user.selectOptions(topUnitInput, "per liter");

    expect(topPriceInput.value).toBe("6.78");
    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(6.78, "BRL", "liter", "USD", "gallon"), "en-US", "USD"));

    await user.selectOptions(bottomCurrencyInput, "BRL");
    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(6.78, "BRL", "liter", "BRL", "gallon"), "en-US", "BRL"));

    await user.selectOptions(bottomUnitInput, "per liter");
    expect(bottomPriceInput.value).toBe(getFormattedPrice(getGasPrice(6.78, "BRL", "liter", "BRL", "liter"), "en-US", "USD"));
  });

  test("updates the top price when the user changes the bottom price", async () => {
    await user.selectOptions(topCurrencyInput, "BRL");
    await user.selectOptions(topUnitInput, "per liter");
    await user.selectOptions(bottomCurrencyInput, "USD");
    await user.selectOptions(bottomUnitInput, "per gallon");

    // Set a home price;
    await user.click(bottomPriceInput);
    await user.clear(bottomPriceInput);
    await user.keyboard("4.43");
    expect(bottomPriceInput.value).toBe("4.43");

    // Expect the local price field to have a value based on the home price
    expect(topPriceInput.value).toBe(getFormattedPrice(getGasPrice(4.43, "USD", "gallon", "BRL", "liter"), "en-US", "USD"));
  });
});
