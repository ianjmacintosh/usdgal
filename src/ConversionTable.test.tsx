import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable";

describe("<ConversionTable />", () => {
    afterEach(cleanup)

    test("displays the conversion table", async () => {
        render(
            <ConversionTable
                sourceUnit="liter"
                targetUnit="gallon"
                sourceCurrency="BRL"
                targetCurrency="USD"
            />,
        );

        expect(screen.getByText("liters per gallon")).toBeInTheDocument();
        expect(screen.getByText("BRL per USD")).toBeInTheDocument();
    });

    test("shows correct conversion rates for equal units", async () => {
        render(
            <ConversionTable
                sourceUnit="gallon"
                targetUnit="gallon"
                sourceCurrency="BRL"
                targetCurrency="USD"
            />,
        );

        expect(
            screen.getByLabelText("Unit of measure conversion").textContent,
        ).toContain('× 1 gallons per gallon');
    });

    test("shows correct conversion rates for equal currencies", async () => {
        render(
            <ConversionTable
                sourceUnit="gallon"
                targetUnit="gallon"
                sourceCurrency="USD"
                targetCurrency="USD"
            />,
        );

        expect(
            screen.getByLabelText("Currency conversion").textContent,
        ).toContain('÷ 1 USD per USD');
    });
});