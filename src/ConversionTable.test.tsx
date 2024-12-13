import { describe, test, expect, afterEach, beforeAll, afterAll, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable";

describe("<ConversionTable />", () => {
    const dollarCost = {
        "BRL": 5.7955874,
        "USD": 1
    }

    afterEach(() => {
        cleanup();
    });

    test("displays the conversion table", async () => {
        render(
            <ConversionTable
                sourceUnit="liter"
                targetUnit="gallon"
                sourceCurrency="BRL"
                targetCurrency="USD"
                dollarCost={dollarCost}
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
                dollarCost={dollarCost}
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
                dollarCost={dollarCost}
            />,
        );

        expect(
            screen.getByLabelText("Currency conversion").textContent,
        ).toContain('× 1 USD per USD');
    });

    test("changes operations to keep numbers positive", async () => {
        render(
            <ConversionTable
                sourceUnit="gallon"
                targetUnit="liter"
                sourceCurrency="USD"
                targetCurrency="BRL"
                dollarCost={dollarCost}
            />,
        );

        expect(
            screen.getByLabelText("Unit of measure conversion").textContent,
        ).toContain('÷ 3.78541 gallons per liter');

        expect(
            screen.getByLabelText("Currency conversion").textContent,
        ).toContain('× 5.7955874 USD per BRL');
    });
});