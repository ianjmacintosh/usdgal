import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import NumberInput from "./number-input";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useState } from "react";
import { I18nProvider } from "@/context/i18n";

describe("<Number />", () => {
  const user = userEvent.setup();
  const TestComponent = ({ ...props }) => {
    const [number, setNumber] = useState(0);
    return (
      <I18nProvider siteLanguage="en">
        <NumberInput
          currency="USD"
          label="Amount"
          onChange={setNumber}
          unit="liter"
          number={number}
          {...props}
        />
      </I18nProvider>
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
    const input = () => {
      return screen.getByLabelText("Amount", {
        exact: false,
      }) as HTMLInputElement;
    };

    // Supports 2 decimal places
    let currentInput = input();
    expect(currentInput.value).toBe("0.00");
    await user.click(currentInput);
    expect(currentInput.value).toBe("");
    await user.tab();

    // Supports 3 decimal places
    cleanup();
    render(<TestComponent currency="TND" number={0} />);
    currentInput = input();
    expect(currentInput.value).toBe("0.000");
    await user.click(currentInput);
    expect(currentInput.value).toBe("");
    await user.tab();

    // Supports 0 decimal places
    cleanup();
    render(<TestComponent currency="JPY" number={0} />);
    currentInput = input();
    expect(currentInput.value).toBe("0");
    await user.click(currentInput);
    expect(currentInput.value).toBe("");
    await user.tab();
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

  test("can handle missing currency prop", async () => {
    cleanup();
    render(<TestComponent currency="" />);

    expect(
      screen.getByLabelText("Amount of currency paid per liter of gas")
        .textContent,
    ).toBe("");

    cleanup();
    render(
      <I18nProvider siteLanguage="es">
        <NumberInput
          currency=""
          label="Amount"
          onChange={() => {
            console.log("Test");
          }}
          unit="liter"
          number={0}
        />
      </I18nProvider>,
    );

    expect(
      // TODO: Come up with a more elegant translation here
      screen.getByLabelText(
        "Importe de amountPaidPerUnitGenericCurrency pagado por liter de gasolina",
      ).textContent,
    ).toBe("");
  });

  test("matches formatting to the browser's language, not the site language", async () => {
    cleanup();
    render(
      <I18nProvider siteLanguage="pt" userLanguage="en-US">
        <NumberInput
          currency="USD"
          label="Amount"
          onChange={() => {
            console.log("Test");
          }}
          unit="liter"
          number={0}
        />
      </I18nProvider>,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("0.00");
  });
});
