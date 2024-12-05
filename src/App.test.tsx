import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("<App />", () => {
  const user = userEvent.setup();
  render(<App />);
  const localPriceInput = screen.getByLabelText(
    "Local price (BRL per liter)",
  ) as HTMLInputElement;
  const homePriceInput = screen.getByLabelText(
    "Home price (USD per gallon)",
  ) as HTMLInputElement;
  const localPriceCurrencyInput = screen.getByLabelText(
    "Local currency",
  ) as HTMLSelectElement;
  const localUnitInput = screen.getByLabelText(
    "Local unit of measure",
  ) as HTMLSelectElement;

  test("allows the user to add and backspace chars the local price input", async () => {
    // Populate price per liter in BRL
    // Hard-coded conversion from BRL to USD: 1 USD = 5.7955874 BRL
    // pricePerLiterInBRL * 3.78541 / 5.7955874 = pricePerGallonInUSD
    // Example: 6.78 * 3.78541 / 5.7955874 = 4.42838284
    // 4.42838284 rounded to 2 places is 4.43

    // Expect price to show correctly in USD
    await user.click(localPriceInput);
    await user.keyboard("1234");
    expect(localPriceInput.value).toBe("1234");
    await user.keyboard("{backspace}{backspace}{backspace}{backspace}");
    expect(localPriceInput.value).toBe("");
  });

  test("prevents the user from entering illegal characters", async () => {
    await user.click(localPriceInput);
    await user.keyboard("not a number");
    expect(localPriceInput.value).toBe("");
  });

  test("prevents the user from entering legal characters to produce illegal values", async () => {
    await user.click(localPriceInput);
    await user.keyboard("..");
    expect(localPriceInput.value).toBe(".");
  });

  test("correctly converts BRL per liter to USD per gallon", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);
    // Expect price to show correctly in USD
    await user.click(localPriceInput);
    await user.keyboard("6.78");
    expect(localPriceInput.value).toBe("6.78");

    // Get output
    // Expect output to be 4.43
    expect(homePriceInput.value).toBe("4.43");
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);
    // Enter a new price of 6.73
    await user.click(localPriceInput);
    await user.keyboard("6.73");

    // Expect output to be 4.40
    expect(homePriceInput.value).toBe("4.40");
  });

  test("allows the user to add and backspace chars the local price input", async () => {
    await userEvent.clear(homePriceInput);
    await user.click(homePriceInput);
    await user.keyboard("1234");
    expect(homePriceInput.value).toBe("1234");
    await user.keyboard("{backspace}{backspace}{backspace}{backspace}");
    expect(homePriceInput.value).toBe("");
  });

  test("updates the local price", async () => {
    // Set a home price
    await user.click(homePriceInput);
    await user.keyboard("4.43");

    // Expect the local price field to have a value based on the home price
    expect(localPriceInput.value).toBe("6.78");
  });

  test("allows the user to add commas to the local price", async () => {
    // Clear the home price input
    await userEvent.clear(localPriceInput);
    await user.click(localPriceInput);
    await user.keyboard("1,000");

    expect(localPriceInput.value).toBe("1,000");
  });

  test("allows the user to modify fields with commas", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);
    await user.click(localPriceInput);
    await user.keyboard("4.43");

    expect(localPriceInput.value).toBe("4.43");
  });

  test("doesn't throw NaN errors when the user provides incomplete numbers", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);
    await user.click(localPriceInput);
    await user.keyboard(".");

    expect(homePriceInput.value).not.toBe("NaN");
    expect(homePriceInput.value).toBe("0.00");

    await user.keyboard("{backspace}");
  });

  test("converts prices with commas from local to home", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);
    await user.keyboard("1,000,000");

    expect(homePriceInput.value).toBe("653,153.81");
  });

  test("converts prices with commas from home to local", async () => {
    // Clear the home price input
    await userEvent.clear(homePriceInput);
    await user.click(homePriceInput);
    await user.keyboard("653,153.81");

    expect(localPriceInput.value).toBe("1,000,000.00");
  });

  test("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {
    // Clear the local price input
    await userEvent.clear(localPriceInput);

    await user.selectOptions(localPriceCurrencyInput, "US Dollar (USD)");
    expect(localPriceCurrencyInput.value).toBe("USD");

    await user.selectOptions(localUnitInput, "per gallon");
    expect(localUnitInput.value).toBe("gallons");

    await user.click(localPriceInput);
    await user.keyboard("1234");

    expect(localPriceInput.value).toBe("1234");

    expect(homePriceInput.value).toBe("1,234.00");
  });
});
