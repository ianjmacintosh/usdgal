import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./conversion-table.tsx";
import exchangeRateData from "../../utils/exchange-rate-data.ts";
import userEvent from "@testing-library/user-event";
import TestI18nProvider from "@/context/i18n.test.tsx";

describe("<ConversionTable />", () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
  });

  const TestComponent = ({
    siteLanguage = "en",
    ...props
  }: {
    siteLanguage?: string;
    messages?: Record<string, string>;
    [key: string]: unknown;
  }) => {
    return (
      <TestI18nProvider siteLanguage={siteLanguage}>
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
      </TestI18nProvider>
    );
  };

  test("hides the conversion table, but allows the user to open and close it", async () => {
    render(<TestComponent />);
    expect(screen.getByLabelText("Conversion Details")).not.toHaveClass(
      "visible",
    );

    await user.click(screen.getByRole("button"));
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

    // Expect "Currency conversion rate" to map to something that starts with "1 USD ="
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
    render(<TestComponent siteLanguage="es" />);

    expect(
      screen.getByLabelText("Detalles de conversión").textContent,
    ).not.toContain("gallon");

    expect(
      screen.getByLabelText("Detalles de conversión").textContent,
    ).toContain("galón");
  });
});
