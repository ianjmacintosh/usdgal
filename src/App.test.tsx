import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from '@testing-library/user-event'

describe("<App />", () => {
  const user = userEvent.setup()
  render(<App />);
  const localPriceInput = screen.getByLabelText("Local price (BRL per liter)") as HTMLInputElement;
  const homePriceOutput = screen.getByLabelText("Home price (USD per gallon)") as HTMLInputElement;

  test("allows the user to clear the input field", async () => {
    // Populate price per liter in BRL
    // Hard-coded conversion from BRL to USD: 1 USD = 5.7955874 BRL
    // pricePerLiterInBRL * 3.78541 / 5.7955874 = pricePerGallonInUSD
    // Example: 6.78 * 3.78541 / 5.7955874 = 4.42838284
    // 4.42838284 rounded to 2 places is 4.43

    // Expect price to show correctly in USD
    await user.click(localPriceInput);
    await user.keyboard('{backspace}{backspace}{backspace}{backspace}');
    expect(localPriceInput.value).toBe("")
  });

  test("correctly converts BRL per liter to USD per gallon", async () => {
    // Populate price per liter in BRL
    // Hard-coded conversion from BRL to USD: 1 USD = 5.7955874 BRL
    // pricePerLiterInBRL * 3.78541 / 5.7955874 = pricePerGallonInUSD
    // Example: 6.78 * 3.78541 / 5.7955874 = 4.42838284
    // 4.42838284 rounded to 2 places is 4.43

    // Expect price to show correctly in USD
    await user.click(localPriceInput);
    await user.keyboard('6.78');
    expect(localPriceInput.value).toBe("6.78")

    // Get output
    // Expect output to be 4.43
    expect(homePriceOutput.value).toBe("4.43");
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {

    // Expect price to show correctly in USD
    await user.click(localPriceInput);
    await user.keyboard('{backspace}{backspace}{backspace}{backspace}6.73');

    // Expect output to be 4.4
    expect(homePriceOutput.value).toBe("4.40");
  });
});
