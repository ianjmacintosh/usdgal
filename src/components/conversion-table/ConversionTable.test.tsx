import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable.tsx";
import exchangeRateData from "../../exchangeRateData.ts";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import en from "../../languages/en.ts";
import es from "../../languages/es.ts";

describe("<ConversionTable />", () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
  });

  const TestComponent = ({
    messages,
    ...props
  }: {
    messages?: Record<string, string>;
    [key: string]: unknown;
  }) => {
    return (
      <IntlProvider locale="en-US" messages={messages || en}>
        <ConversionTable
          topNumber={1.23456}
          bottomNumber={5.6789}
          topUnit="liter"
          bottomUnit="gallon"
          topCurrency="BRL"
          bottomCurrency="USD"
          exchangeRateData={exchangeRateData}
          {...props}
        />
      </IntlProvider>
    );
  };

  test("hides the conversion table, but allows the user to open and close it", async () => {
    render(<TestComponent />);
    expect(screen.getByLabelText("Conversion Details")).not.toHaveClass(
      "visible",
    );

    await user.click(screen.getByText(/details/i));
    expect(screen.getByLabelText("Conversion Details")).toHaveClass("visible");
  });

  test("shows top converted value first", async () => {
    render(
      <TestComponent
        topUnit="gallon"
        bottomUnit="liter"
        topCurrency="USD"
        bottomCurrency="BRL"
      />,
    );

    expect(
      screen.getByLabelText("Currency conversion rate").textContent,
    ).toContain("USD = ");

    expect(
      screen.getByLabelText("Volume conversion rate").textContent,
    ).toContain("gallon = ");

    cleanup();

    render(
      <TestComponent
        topUnit="liter"
        bottomUnit="gallon"
        topCurrency="BRL"
        bottomCurrency="USD"
      />,
    );

    expect(
      screen.getByLabelText("Currency conversion rate").textContent,
    ).toContain("BRL = ");

    expect(
      screen.getByLabelText("Volume conversion rate").textContent,
    ).toContain("liters = ");
  });

  test("shows exact currency values (input and output)", async () => {
    render(<TestComponent />);

    expect(screen.getByLabelText("Cost").textContent).toContain("1.23456 BRL");

    expect(screen.getByLabelText("Converted cost").textContent).toContain(
      "5.6789 USD",
    );
  });

  test("doesn't show conversion rates when units and currencies are equal", async () => {
    render(
      <TestComponent
        topCurrency="BRL"
        topUnit="liters"
        bottomCurrency="BRL"
        bottomUnit="liters"
      />,
    );

    expect(screen.queryByLabelText("Currency conversion rate")).toBeNull();
    expect(screen.queryByLabelText("Volume conversion rate")).toBeNull();
  });

  test("translates liters and gallons", async () => {
    render(<TestComponent messages={es} />);

    expect(
      screen.getByLabelText("Detalles de conversión").textContent,
    ).not.toContain("gallon");

    expect(
      screen.getByLabelText("Detalles de conversión").textContent,
    ).toContain("galón");
  });
});
