import { describe, test, expect, afterEach } from "vitest";
import {
  getByPlaceholderText,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import getGasPrice from "./utils/getGasPrice";
import { getFormattedPrice } from "./utils/numberFormat";
import "@testing-library/jest-dom/vitest";
import { selectItemFromFancySelect } from "./utils/testUtils";

describe("<App />", () => {
  const user = userEvent.setup();
  render(<App />);
  const topPriceInput = screen.getAllByLabelText("Amount", {
    selector: "input",
    exact: false,
  })[0] as HTMLInputElement;
  const topCurrencyButton = screen.getAllByLabelText("Currency", {
    selector: "button",
    exact: false,
  })[0] as HTMLSelectElement;
  const topUnitButton = screen.getAllByLabelText("Unit of sale", {
    exact: false,
  })[0] as HTMLButtonElement;
  const bottomPriceInput = screen.getAllByLabelText("Amount", {
    selector: "input",
    exact: false,
  })[1] as HTMLInputElement;
  const bottomCurrencyButton = screen.getAllByLabelText("Currency", {
    selector: "button",
    exact: false,
  })[1] as HTMLButtonElement;
  const bottomUnitButton = screen.getAllByLabelText("Unit of sale", {
    exact: false,
  })[1] as HTMLButtonElement;

  afterEach(() => {
    user.clear(topPriceInput);
  });

  const selectItemFromCombobox = async (
    selectElement: Element,
    option: string,
  ) => {
    await user.click(selectElement);
    const popover = document.querySelector(".popover") as HTMLElement;
    await user.click(getByPlaceholderText(popover, "Search for a currency..."));
    await user.keyboard(option);
    await user.click(getByText(popover, option, { exact: false }));

    waitFor(() => {
      expect(selectElement.textContent).toBe(option);
    });
  };

  test("correctly converts BRL per liter to USD per gallon", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    // Expect price to show correctly in USD
    await user.click(topPriceInput);
    await user.keyboard("6.78");
    expect(topPriceInput.value).toBe("6.78");

    // Get output
    // Expect output to be 4.43
    expect(bottomPriceInput.value).toBe(
      getFormattedPrice(
        getGasPrice(6.78, "BRL", "liter", "USD", "gallon"),
        "en-US",
        "USD",
      ),
    );
  });

  // 6.73 BRL per liter converts to 4.40 USD per gallon (at an exchange rate of 1 USD = 5.7955874 BRL)
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("rounds prices correctly (to 2 decimal places)", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    // Enter a new price of 6.73
    await user.click(topPriceInput);
    await user.keyboard("6.73");

    expect(bottomPriceInput.value).toBe(
      getFormattedPrice(
        getGasPrice(6.73, "BRL", "liter", "USD", "gallon"),
        "en-US",
        "USD",
      ),
    );
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

    expect(bottomPriceInput.value).toBe(
      getFormattedPrice(
        getGasPrice(1000000, "BRL", "liter", "USD", "gallon"),
        "en-US",
        "USD",
      ),
    );
  });

  test("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {
    // Clear the local price input
    await userEvent.clear(topPriceInput);
    await user.click(topPriceInput);
    await user.keyboard("1234");
    expect(topPriceInput.value).toBe("1234");

    await selectItemFromCombobox(topCurrencyButton, "USD");
    expect(topCurrencyButton.textContent).toBe("USD");

    await selectItemFromFancySelect(topUnitButton, "per gallon");
    expect(topUnitButton.textContent).toBe("per gallon");

    expect(bottomPriceInput.value).toBe("1,234.00");
  });

  test("updates bottom price (but not top price) when the user updates the bottom currency or units", async () => {
    // Perform the top setup; 6.78, BRL, liters
    await user.click(topPriceInput);
    await user.keyboard("6.78");
    await selectItemFromCombobox(topCurrencyButton, "BRL");
    await selectItemFromFancySelect(topUnitButton, "per liter");

    // Expect all the top values are as expected
    expect(topPriceInput.value).toBe("6.78");
    expect(topCurrencyButton.textContent).toBe("BRL");
    expect(topUnitButton.textContent).toBe("per liter");

    // Expect the bottom value got converted right
    expect(bottomPriceInput.value).toBe(
      getFormattedPrice(
        getGasPrice(6.78, "BRL", "liter", "USD", "gallon"),
        "en-US",
        "USD",
      ),
    );

    // Expect the top input to stay the same while updating the bottom currency
    // Perform the bottom setup; BRL, per gallon
    await selectItemFromCombobox(bottomCurrencyButton, "BRL");
    await selectItemFromFancySelect(bottomUnitButton, "per gallon");

    // Expect all the bottom and top values are as expected
    waitFor(() => {
      expect(bottomCurrencyButton.textContent).toBe("BRL");
      expect(bottomUnitButton.textContent).toBe("per gallon");
      expect(topPriceInput.value).toBe("6.78");
      expect(bottomPriceInput.value).toBe(
        getFormattedPrice(
          getGasPrice(6.78, "BRL", "liter", "BRL", "gallon"),
          "en-US",
          "BRL",
        ),
      );
    });

    // Expect the top input to stay the same while updating the bottom volume measure
    await selectItemFromFancySelect(bottomUnitButton, "per liter");
    waitFor(() => {
      expect(bottomPriceInput.value).toBe(
        getFormattedPrice(
          getGasPrice(6.78, "BRL", "liter", "BRL", "liter"),
          "en-US",
          "BRL",
        ),
      );
    });

    // Expect the top price to change when changing the bottom price
    await user.click(bottomPriceInput);
    await user.clear(bottomPriceInput);
    await user.keyboard("4.43");
    expect(bottomPriceInput.value).toBe("4.43");

    waitFor(() => {
      expect(topPriceInput.value).toBe(
        getFormattedPrice(
          getGasPrice(4.43, "BRL", "liter", "BRL", "liter"),
          "en-US",
          "BRL",
        ),
      );
    });

    // Expect the top price to change when updating the bottom currency
    await selectItemFromCombobox(bottomCurrencyButton, "USD");
    await selectItemFromFancySelect(bottomUnitButton, "per gallon");
    waitFor(() => {
      expect(topPriceInput.value).toBe(
        getFormattedPrice(
          getGasPrice(4.43, "USD", "gallon", "BRL", "liter"),
          "en-US",
          "BRL",
        ),
      );
    });
  });

  describe("Footer", () => {
    test("has a link for my personal site and my GitHub project", () => {
      const PERSONAL_SITE_URL = "https://www.ianjmacintosh.com/";
      const PROJECT_REPO_URL = "https://www.github.com/ianjmacintosh/usdgal";

      expect(
        screen.getByRole("link", { name: "Ian J. MacIntosh" }),
      ).toHaveAttribute("href", PERSONAL_SITE_URL);
      expect(screen.getByRole("link", { name: /Source code/ })).toHaveAttribute(
        "href",
        PROJECT_REPO_URL,
      );
    });
  });
});
