import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, getByText, render, screen } from "@testing-library/react";
import Currency from "./currency";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { selectItemFromFancySelect } from "../../utils/test-utils";
import { IntlProvider } from "react-intl";
import en from "../../languages/en";

describe("<Currency />", () => {
  const user = userEvent.setup();
  const TestComponent = ({ ...props }) => {
    const [currency, setCurrency] = useState<string>("BRL");

    return (
      <IntlProvider locale="en-US" messages={en}>
        <Currency
          currency={currency}
          onCurrencyChange={(newValue) => {
            setCurrency(newValue);
          }}
          {...props}
        />
      </IntlProvider>
    );
  };

  beforeEach(() => {
    cleanup();
    render(<TestComponent />);
  });

  test("doesn't leave the popover in the DOM when it's not in use", async () => {
    const currencyButton = screen.getByLabelText("Currency");
    expect(document.querySelector(".currency-popover")).not.toBeInTheDocument();
    await user.click(currencyButton);
    expect(document.querySelector(".currency-popover")).toBeVisible();
    await user.click(currencyButton);
    expect(document.querySelector(".currency-popover")).not.toBeInTheDocument();
  });

  test("supports searching currency based on verbose name (i.e., Bitcoin) instead of ISO code (i.e., BTC)", async () => {
    const currencyButton = screen.getByLabelText("Currency");
    await user.click(currencyButton);
    await user.click(screen.getByPlaceholderText("Search for a currency..."));
    await user.keyboard("bit");
    expect(screen.getByText("Bitcoin", { exact: false })).toBeVisible();
  });

  test("lets a user select a currency by focusing on the select and typing its code (no popover needed)", async () => {
    const currencyButton = screen.getByLabelText("Currency");
    await user.click(currencyButton);
    expect(document.querySelector(".popover")).toBeVisible();
    await user.click(currencyButton);
    expect(document.querySelector(".popover")).not.toBeInTheDocument();
    await user.keyboard("USD");
    expect(currencyButton.textContent).toBe("USD");
  });

  test("doesn't \"unselect\" a currency when it's clicked once, then clicked again", async () => {
    const currencyButton = screen.getByLabelText("Currency");
    await user.click(currencyButton);
    const popover = document.querySelector(".popover") as HTMLElement;
    await user.click(getByText(popover, "BRL", { exact: false }));

    expect(currencyButton.textContent).toBe("BRL");

    await user.click(currencyButton);
    await user.click(getByText(popover, "BRL", { exact: false }));
    expect(currencyButton.textContent).toBe("BRL");
  });

  test("shows a checkmark and a highlight for the selected currency", async () => {
    const currencyButton = screen.getByLabelText("Currency");
    await selectItemFromFancySelect(currencyButton, "MXN");
    expect(currencyButton.textContent).toBe("MXN");

    await user.click(currencyButton);
    expect(document.querySelector("#item-mxn")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(document.querySelector("#item-mxn")).toHaveTextContent("✓");
  });

  test("shows a checkmark and a highlight for the selected currency when updated via parent prop", async () => {
    cleanup();

    // Render the component with no currency
    const { rerender } = render(<TestComponent currency="" />);

    const currencyButton = screen.getByLabelText("Currency");
    expect(currencyButton.textContent).toBe("");

    await user.click(currencyButton);
    expect(document.querySelector("#item-mxn")).not.toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(document.querySelector("#item-mxn")).not.toHaveTextContent("✓");

    // Re-render the component with a new currency
    rerender(<TestComponent currency="MXN" />);

    expect(document.querySelector("#item-mxn")).toHaveTextContent("✓");
    expect(document.querySelector("#item-mxn")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("translates currency names", async () => {
    cleanup();
    render(<TestComponent userLanguage="pt-BR" />);

    const currencyButton = screen.getByRole("combobox");
    await user.click(currencyButton);

    expect(screen.getByText("Real brasileiro", { exact: false })).toBeVisible();
  });
});
