import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import getGasPrice from "./utils/getGasPrice";
import { getFormattedPrice } from "./utils/numberFormat";
import { selectItemFromFancySelect } from "./utils/testUtils";

const TestComponent = ({ ...props }) => {
  return <App {...props} />;
};

const elements = () => {
  return {
    topPriceInput: screen.getAllByLabelText(/Amount/, {
      selector: "input",
    })[0] as HTMLInputElement,
    bottomPriceInput: screen.getAllByLabelText(/Amount/, {
      selector: "input",
    })[1] as HTMLInputElement,
    topCurrencyInput: screen.getAllByLabelText("Currency")[0],
    topUnitInput: screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[0],
    bottomCurrencyInput: screen.getAllByLabelText("Currency")[1],
    bottomUnitInput: screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[1],
  };
};

describe("<App userLanguage='en-US' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<TestComponent userLanguage="en-US" />);
  });
  afterEach(() => {
    cleanup();
  });

  test("loads with the correct starting values", async () => {
    const {
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("CAD");
      expect(topUnitInput.textContent).toBe("per liter");
    });
    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("USD");
      expect(bottomUnitInput.textContent).toBe("per gallon");
    });
  });

  test("can convert a gas price from one currency to another", async () => {
    // Arrange
    const {
      topPriceInput,
      bottomPriceInput,
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    const convertedPrice = getGasPrice(1, "BRL", "liter", "USD", "gallon");
    const formattedPrice = getFormattedPrice(convertedPrice, "en-US", "BRL");

    // Act
    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomUnitInput, "per gallon");
    await user.click(topPriceInput);
    await user.keyboard("1");

    // Assert
    expect(bottomPriceInput.value).toBe(formattedPrice);
  });
});

describe("<App userLanguage='pt-BR' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<TestComponent userLanguage="pt-BR" />);
  });
  afterEach(() => {
    cleanup();
  });

  test("loads with the correct starting values", async () => {
    const { topCurrencyInput, bottomCurrencyInput, bottomUnitInput } =
      elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("CAD");
      expect(bottomUnitInput.textContent).toBe("per liter");
    });
    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("BRL");
      expect(bottomUnitInput.textContent).toBe("per liter");
    });
  });

  test("can convert a gas price from one currency to another", async () => {
    // Arrange
    const {
      topPriceInput,
      bottomPriceInput,
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    const convertedPrice = getGasPrice(1, "BRL", "liter", "USD", "gallon");
    const formattedPrice = getFormattedPrice(convertedPrice, "pt-BR", "BRL");

    // Act
    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomUnitInput, "per gallon");
    await user.click(topPriceInput);
    await user.keyboard("1");

    // Assert
    expect(bottomPriceInput.value).toBe(formattedPrice);
  });
});
