import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe('<App userLocale="pt-BR" />', () => {
  render(<App userHomeCountry="pt-BR" />);

  const topPriceInput = screen.getAllByLabelText("Amount", {
    selector: "input",
    exact: false,
  })[0] as HTMLInputElement;
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

  test("converts units to BRL and liters", () => {
    expect(bottomCurrencyButton.textContent).toBe("BRL");
    expect(bottomUnitButton.textContent).toBe("per liter");
  });

  test("renders 0 like '0,00' (with a comma, not a period)", () => {
    expect(topPriceInput.value).toBe("0,00");
    expect(bottomPriceInput.value).toBe("0,00");
  });

  test("allows the user to update the number field", async () => {
    // Expect the user to be able to update the field
    await userEvent.click(topPriceInput);
    await userEvent.keyboard("2");
    expect(topPriceInput.value).toBe("2");

    // Expect the field to get updated and formatted on blur
    await userEvent.tab();
    expect(topPriceInput.value).toBe("2,00");
  });
});
