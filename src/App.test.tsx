import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("<App />", () => {
  const user = userEvent.setup();
  render(<App />);
  const sourcePriceInput = screen.getByLabelText(
    "Source gas price (BRL per liter)", { selector: 'input' },
  ) as HTMLInputElement;
  const sourceCurrencyInput = screen.getByLabelText(
    "Source currency",
  ) as HTMLSelectElement;
  const sourceUnitInput = screen.getByLabelText(
    "Source unit of measure",
  ) as HTMLSelectElement;
  const targetPriceInput = screen.getByLabelText(
    "Target gas price", { selector: 'input', exact: false },
  ) as HTMLInputElement;
  const targetCurrencyInput = screen.getByLabelText(
    "Target currency",
  ) as HTMLSelectElement;
  const targetUnitInput = screen.getByLabelText(
    "Target unit of measure",
  ) as HTMLSelectElement;

  afterEach(() => {
    user.clear(sourcePriceInput);
  });

  test("correctly converts BRL per liter to USD per gallon", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    // Expect price to show correctly in USD
    await user.click(sourcePriceInput);
    await user.keyboard("6.78");
    expect(sourcePriceInput.value).toBe("6.78");

    // Get output
    // Expect output to be 4.43
    expect(targetPriceInput.value).toBe("4.43");
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    // Enter a new price of 6.73
    await user.click(sourcePriceInput);
    await user.keyboard("6.73");

    // Expect output to be 4.40
    expect(targetPriceInput.value).toBe("4.40");
  });

  test("doesn't throw NaN errors when the user provides incomplete numbers", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    await user.click(sourcePriceInput);
    await user.keyboard(".");

    expect(targetPriceInput.value).not.toBe("NaN");
    expect(targetPriceInput.value).toBe("0.00");

    await user.keyboard("{backspace}");
  });

  test("converts prices with commas from local to home", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    await user.keyboard("1,000,000");

    expect(targetPriceInput.value).toBe("653,153.81");
  });

  test("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    await user.click(sourcePriceInput);
    await user.keyboard("1234");
    expect(sourcePriceInput.value).toBe("1234");

    await user.selectOptions(sourceCurrencyInput, "US Dollar (USD)");
    expect(sourceCurrencyInput.value).toBe("USD");

    await user.selectOptions(sourceUnitInput, "gallons");
    expect(sourceUnitInput.value).toBe("gallon");



    expect(targetPriceInput.value).toBe("1,234.00");
  });

  test("updates target price (but not source price) when the user updates the target currency or units", async () => {
    // Clear the local price input
    await userEvent.clear(sourcePriceInput);
    await user.keyboard("6.78");

    await user.selectOptions(sourceCurrencyInput, "Brazilian Real (BRL)");
    await user.selectOptions(sourceUnitInput, "liters");

    expect(sourcePriceInput.value).toBe("6.78");
    expect(targetPriceInput.value).toBe("4.43");

    await user.selectOptions(targetCurrencyInput, "Brazilian Real (BRL)");
    expect(targetPriceInput.value).toBe("25.67");

    await user.selectOptions(targetUnitInput, "liters");
    expect(targetPriceInput.value).toBe("6.78");
  });

  test("updates the top price when the user changes the bottom price", async () => {
    // Set a home price
    await user.click(targetPriceInput);
    await user.keyboard("4.43");

    // Expect the local price field to have a value based on the home price
    expect(sourcePriceInput.value).toBe("6.78");
  });
});
