import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import getGasPrice from "./utils/getGasPrice";
import { getFormattedPrice } from "./utils/numberFormat";
import { selectItemFromFancySelect } from "./utils/testUtils";

const TestComponent = ({ ...props }) => {
  return <App {...props} />;
};

describe("<App />", () => {
  const user = userEvent.setup();
  beforeEach(() => {
    render(<TestComponent />);
  });
  afterEach(() => {
    cleanup();
  });
  test("can convert a gas price from one currency to another", async () => {
    // Arrange
    const topPriceInput = screen.getAllByLabelText(
      /Amount/,
    )[0] as HTMLInputElement;

    const bottomPriceInput = screen.getAllByLabelText(
      /Amount/,
    )[1] as HTMLInputElement;

    const topCurrencyInput = screen.getAllByLabelText(
      "Currency",
    )[0] as HTMLButtonElement;
    const topUnitInput = screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[0] as HTMLButtonElement;
    const bottomCurrencyInput = screen.getAllByLabelText(
      "Currency",
    )[1] as HTMLButtonElement;
    const bottomunitInput = screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[1] as HTMLButtonElement;

    const convertedPrice = getGasPrice(1, "BRL", "liter", "USD", "gallon");
    const formattedPrice = getFormattedPrice(convertedPrice, "en-US", "BRL");

    // Act
    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomunitInput, "per gallon");
    await user.click(topPriceInput);
    await user.keyboard("1");

    // Assert
    expect(bottomPriceInput.value).toBe(formattedPrice);
  });
});
