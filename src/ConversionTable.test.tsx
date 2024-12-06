import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ConversionTable from "./ConversionTable";

describe("<ConversionTable />", () => {
    render(
        <ConversionTable
            exchangeRate={5.7955874}
            sourceCurrency="BRL"
            targetCurrency="USD"
        />,
    );

    test("displays the conversion table", async () => {
        expect(screen.getByText("liters per gallon")).toBeVisible();
        expect(screen.getByText("BRL per USD")).toBeInTheDocument();
    });
});