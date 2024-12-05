import { describe, test, expect, afterEach, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GasPrice from "./GasPrice";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

describe("<GasPrice />", () => {
  const user = userEvent.setup();
  const TestComponent = () => {
    const [number, setNumber] = useState("0.00");

    return (
      <GasPrice
        id="notRealCurrency"
        label="Simple Test"
        number={number}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;

          setNumber(newValue);
        }}
      />
    );
  };

  beforeAll(() => {
    render(<TestComponent />);
  });

  afterEach(async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    await userEvent.clear(input);
  })

  test("loads the correct starting value, allows updates via typing", async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    expect(input.value).toBe("0.00");
    await user.click(input);
    await user.keyboard("{backspace}{backspace}{backspace}{backspace}");
    expect(input.value).toBe("");
    await user.keyboard("123");
    expect(input.value).toBe("123");
  });

  test("prevents the user from entering illegal characters", async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    await user.click(input);
    await user.keyboard("not a number");
    expect(input.value).toBe("");
  });

  test("prevents the user from entering legal characters to produce illegal values", async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    await user.click(input);
    await user.keyboard("..");
    expect(input.value).toBe(".");
  });

  test("allows the user to add commas to the local price", async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    await user.click(input);
    await user.keyboard("1,000");

    expect(input.value).toBe("1,000");
  });

  test("allows the user to modify fields with commas", async () => {
    const input = screen.getByLabelText("Simple Test") as HTMLInputElement;

    await user.click(input);
    await user.keyboard("4.43");

    expect(input.value).toBe("4.43");
  });
});
