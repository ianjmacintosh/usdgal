import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GasPrice from "./GasPrice";

describe("<GasPrice />", () => {
  let price = "0.00";
  render(<GasPrice
    id="notRealCurrency"
    label="Simple Test"
    price={price}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { price = e.target.value }} />)

  // 6.73 BRL per liter converts to 4.40 USD per gallon
  // 4.40 gets displayed as as 4.4, and that's a bug
  test("allows changing value programatically", () => {
    // Populate price per liter in BRL
    // Hard-coded conversion from BRL to USD: 1 USD = 5.7955874 BRL
    // pricePerLiterInBRL * 3.78541 / 5.7955874 = pricePerGallonInUSD
    // Example: 6.78 * 3.78541 / 5.7955874 = 4.42838284
    // 4.42838284 rounded to 2 places is 4.43

    // Get output
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1.23" } });
    expect(input.value).toBe("1.23");
  });
});
