import { describe, test, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("<App />", () => {
  const user = userEvent.setup();
  render(<App />);
  const topPriceInput = screen.getByLabelText(
    "Top gas price", { selector: 'input', exact: false },
  ) as HTMLInputElement;
  const topCurrencyInput = screen.getByLabelText(
    "Top currency",
  ) as HTMLSelectElement;
  const topUnitInput = screen.getByLabelText(
    "Top unit of measure",
  ) as HTMLSelectElement;
  const bottomPriceInput = screen.getByLabelText(
    "Bottom gas price", { selector: 'input', exact: false },
  ) as HTMLInputElement;
  const bottomCurrencyInput = screen.getByLabelText(
    "Bottom currency",
  ) as HTMLSelectElement;
  const bottomUnitInput = screen.getByLabelText(
    "Bottom unit of measure",
  ) as HTMLSelectElement;

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
    expect(bottomPriceInput.value).toBe("4.43");
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    // Enter a new price of 6.73
    await user.click(topPriceInput);
    await user.keyboard("6.73");

    // Expect output to be 4.40
    expect(bottomPriceInput.value).toBe("4.40");
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

    expect(bottomPriceInput.value).toBe("653,153.81");
  });

  test("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.click(topPriceInput);
    await user.keyboard("1234");
    expect(topPriceInput.value).toBe("1234");

    await user.selectOptions(topCurrencyInput, "US Dollar (USD)");
    expect(topCurrencyInput.value).toBe("USD");

    await user.selectOptions(topUnitInput, "gallons");
    expect(topUnitInput.value).toBe("gallon");

    expect(bottomPriceInput.value).toBe("1,234.00");
  });

  test("updates target price (but not source price) when the user updates the target currency or units", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.keyboard("6.78");

    await user.selectOptions(topCurrencyInput, "Brazilian Real (BRL)");
    await user.selectOptions(topUnitInput, "liters");

    expect(topPriceInput.value).toBe("6.78");
    expect(bottomPriceInput.value).toBe("4.43");

    await user.selectOptions(bottomCurrencyInput, "Brazilian Real (BRL)");
    expect(bottomPriceInput.value).toBe("25.67");

    await user.selectOptions(bottomUnitInput, "liters");
    expect(bottomPriceInput.value).toBe("6.78");
  });

  test("updates the top price when the user changes the bottom price", async () => {
    await user.selectOptions(topCurrencyInput, "Brazilian Real (BRL)");
    await user.selectOptions(topUnitInput, "liters");
    await user.selectOptions(bottomCurrencyInput, "US Dollar (USD)");
    await user.selectOptions(bottomUnitInput, "gallons");

    // Set a home price;
    await user.click(bottomPriceInput);
    await user.clear(bottomPriceInput);
    await user.keyboard("4.43");
    expect(bottomPriceInput.value).toBe("4.43");

    // Expect the local price field to have a value based on the home price
    expect(topPriceInput.value).toBe("6.78");
  });
});
