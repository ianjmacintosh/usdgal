import { describe, test, expect, beforeAll, afterEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

const server = setupServer(
  // capture "GET /greeting" requests
  http.get('/currencies.json', () => {
    // respond using a mocked JSON body
    return HttpResponse.json({
      "BRL": 5.7955874,
      "USD": 1
    })
  }),
)

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

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    user.clear(topPriceInput);
    server.resetHandlers();
  });

  afterAll(() => server.close());

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

    await user.selectOptions(topCurrencyInput, "USD");
    expect(topCurrencyInput.value).toBe("USD");

    await user.selectOptions(topUnitInput, "per gallon");
    expect(topUnitInput.value).toBe("gallon");

    expect(bottomPriceInput.value).toBe("1,234.00");
  });

  test("updates target price (but not source price) when the user updates the target currency or units", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.keyboard("6.78");

    await user.selectOptions(topCurrencyInput, "BRL");
    await user.selectOptions(topUnitInput, "per liter");

    expect(topPriceInput.value).toBe("6.78");
    expect(bottomPriceInput.value).toBe("4.43");

    await user.selectOptions(bottomCurrencyInput, "BRL");
    expect(bottomPriceInput.value).toBe("25.67");

    await user.selectOptions(bottomUnitInput, "per liter");
    expect(bottomPriceInput.value).toBe("6.78");
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
    expect(topPriceInput.value).toBe("6.78");
  });
});
