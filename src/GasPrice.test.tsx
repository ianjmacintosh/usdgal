import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import GasPrice from "./GasPrice";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import exchangeRateData from "./exchangeRateData";
import "@testing-library/jest-dom/vitest";

describe("<GasPrice />", () => {
  const currencies = Object.keys(exchangeRateData.rates);
  const user = userEvent.setup();
  const TestComponent = ({ ...props }) => {
    const [number, setNumber] = useState(0);
    const [currency, setCurrency] = useState<string>("BRL");
    const [unit, setUnit] = useState("liter");

    return (
      <GasPrice
        label="SimpleTest"
        number={number}
        currency={currency}
        unit={unit}
        onNumberChange={(newValue) => {
          setNumber(newValue);
        }}
        onCurrencyChange={(newValue) => {
          setCurrency(newValue);
        }}
        onUnitChange={(newValue) => {
          setUnit(newValue);
        }}
        currencies={currencies}
        {...props}
      />
    );
  };

  beforeEach(() => {
    cleanup();
    render(<TestComponent />);
  });

  test("loads the correct starting value, allows updates via typing", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    expect(input.value).toBe("0.00");
    await user.click(input);
    await user.keyboard("{backspace}{backspace}{backspace}{backspace}");
    expect(input.value).toBe("");
    await user.keyboard("123");
    expect(input.value).toBe("123");
  });

  test("clears the number input when the starting value is 0", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    expect(input.value).toBe("0.00");
    await user.click(input);
    expect(input.value).toBe("");
  });

  test("prevents the user from entering illegal characters", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("not a number");
    expect(input.value).toBe("");
  });

  test("prevents the user from entering legal characters to produce illegal values", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("..");
    expect(input.value).toBe(".");
  });

  test("allows the user to add commas to the local price", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("1,000");

    expect(input.value).toBe("1,000");
  });

  test("allows the user to modify fields with commas", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("4.43");

    expect(input.value).toBe("4.43");
  });

  test("disables dropdowns when the component is disabled", async () => {
    // Move over pig, I'm gonna make my OWN component!!
    cleanup();
    render(<TestComponent disabled />);

    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.click(input);
    await user.keyboard("4.43");

    expect(input.value).toBe("0.00");
  });

  test("formats with commas and decimal places when the user exits a field", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard(".8");
    await user.tab();

    expect(input.value).toBe("0.80");

    await user.clear(input);
    await user.click(input);
    await user.keyboard("10000.000");
    await user.tab();

    expect(input.value).toBe("10,000.00");
  });

  test("doesn't throw NaN when receiving a malformed string", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("11,11.00");
    await user.tab();

    expect(input.value).toBe("1,111.00");
  });

  test("doesn't get value and state out of sync", async () => {
    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.clear(input);
    await user.click(input);
    await user.keyboard("1,");
    await user.tab();

    expect(input.value).toBe("1.00");

    await user.click(input);
    await user.keyboard(",");

    expect(input.value).toBe("1.00");
  });

  test("warns when a display value is 0 but the actual value is not", async () => {
    cleanup();
    render(<TestComponent />);

    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.click(input);
    await user.keyboard("0.0001");
    await user.tab();
    expect(input.value).toBe("0.01");

    const warning = screen.getByText("This amount is displayed as 0.01", {
      exact: false,
    });
    expect(warning).toBeVisible();
  });
});
