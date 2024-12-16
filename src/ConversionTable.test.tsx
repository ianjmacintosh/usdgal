import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable";
import exchangeRateData from "./exchangeRateData.ts";

describe("<ConversionTable />", () => {
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

    test("displays the conversion table", async () => {
        render(<TestComponent />);
        expect(screen.getByText("liters per gallon", { exact: false })).toBeInTheDocument();
        expect(screen.getByText("BRL per USD", { exact: false })).toBeInTheDocument();
    });

    test("shows correct conversion rates for equal units", async () => {
        render(
            <TestComponent
                topUnit="gallon"
            />,
        );

        expect(
            screen.getByLabelText("Unit of measure conversion").textContent,
        ).toContain("gallons per gallon");
    });

    test("shows correct conversion rates for equal currencies", async () => {
        render(
            <TestComponent
                topUnit="gallon"
                bottomUnit="gallon"
                topCurrency="USD"
                bottomCurrency="USD"
            />,
        );

        expect(screen.getByLabelText("Currency conversion").textContent).toContain(
            "USD per USD",
        );
    });

    test("changes operations to keep numbers positive", async () => {
        render(
            <TestComponent
                topUnit="gallon"
                bottomUnit="liter"
                topCurrency="USD"
                bottomCurrency="BRL"
            />,
        );

        expect(
            screen.getByLabelText("Unit of measure conversion").textContent,
        ).toContain("liters per gallon");

        expect(screen.getByLabelText("Currency conversion").textContent).toContain(
            "BRL per USD",
        );
    });

    test("shows exact currency values (input and output)", async () => {
        render(
            <TestComponent
            />,
        );

        expect(screen.getByLabelText("Initial cost").textContent).toContain(
            "1.23456 BRL",
        );

        expect(screen.getByLabelText("Converted cost").textContent).toContain(
            "= 5.6789 USD",
        );
    });
});
