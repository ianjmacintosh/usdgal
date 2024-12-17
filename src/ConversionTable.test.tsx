import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData.ts";
import userEvent from "@testing-library/user-event";

describe("<ConversionTable />", () => {
    const user = userEvent.setup();

    afterEach(() => {
        cleanup();
    });

    const TestComponent = ({ ...props }) => {
        return (
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
        );
    };

    test("hides the conversion table, but allows the user to open and close it", async () => {
        render(<TestComponent />);
        expect(screen.getByLabelText("Conversion Details")).not.toHaveClass('visible');

        await user.click(screen.getByText("Show full conversion details..."));
        expect(screen.getByLabelText("Conversion Details")).toHaveClass('visible');
    });

    test("shows correct conversion rates for equal units (gallons to gallons, liters to liters)", async () => {
        render(
            <TestComponent
                topUnit="gallon"
                bottomUnit="gallon"
            />,
        );

        expect(
            screen.getByLabelText("Volume conversion rate").textContent,
        ).toContain("1 gallon = 1 gallons");

        cleanup();

        render(
            <TestComponent
                topUnit="liter"
                bottomUnit="liter"
            />,
        );

        expect(
            screen.getByLabelText("Volume conversion rate").textContent,
        ).toContain("1 liter = 1 liters");
    });

    test("shows correct conversion rates for equal currencies (USD to USD)", async () => {
        render(
            <TestComponent
                topCurrency="USD"
                bottomCurrency="USD"
            />,
        );

        expect(screen.getByLabelText("Currency conversion rate").textContent).toContain(
            "1 USD = 1 USD",
        );
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

        expect(screen.getByLabelText("Volume conversion rate").textContent).toContain(
            "gallon = ",
        );

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

        expect(screen.getByLabelText("Volume conversion rate").textContent).toContain(
            "liters = ",
        );
    });

    test("shows exact currency values (input and output)", async () => {
        render(
            <TestComponent
            />,
        );

        expect(screen.getByLabelText("Cost").textContent).toContain(
            "1.23456 BRL",
        );

        expect(screen.getByLabelText("Converted cost").textContent).toContain(
            "5.6789 USD",
        );
    });
});
