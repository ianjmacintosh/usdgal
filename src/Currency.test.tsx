import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, getAllByRole, getByText, render, screen, waitFor } from "@testing-library/react";
import Currency from "./Currency";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import exchangeRateData from "./exchangeRateData";
import '@testing-library/jest-dom/vitest';

describe("<Currency />", () => {
    const currencies = Object.keys(exchangeRateData.rates)
    const user = userEvent.setup();
    const TestComponent = ({ ...props }) => {
        const [currency, setCurrency] = useState<string>("BRL");

        return (
            <Currency
                currency={currency}
                onCurrencyChange={(newValue) => {
                    setCurrency(newValue);
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

    test("dynamically renders currencies based on props", async () => {
        cleanup();
        render(<TestComponent currencies={["BRL", "MXN"]} />);

        const currencyButton = screen.getByLabelText("Currency")
        await user.click(currencyButton)
        const popover = document.querySelector(".popover") as HTMLElement
        const currencyOptions = getAllByRole(popover, 'option');
        expect(currencyOptions.length).toBe(2);
    });

    test("doesn't leave the popover in the DOM when it's not in use", () => {
        cleanup();
        render(<TestComponent currencies={["BRL", "MXN"]} />);

        const currencyButton = screen.getByLabelText("Currency")
        waitFor(() => expect(document.querySelector(".popover")).toBeVisible());
        user.click(currencyButton)
        waitFor(() => expect(document.querySelector(".popover")).not.toBeInTheDocument());
    })

    test("supports searching currency based on verbose name (i.e., Bitcoin) instead of ISO code (i.e., BTC)", async () => {
        cleanup();
        render(<TestComponent currencies={["BTC", "USD", "MXN"]} />);

        const currencyButton = screen.getByLabelText("Currency")
        await user.click(currencyButton)
        await user.click(screen.getByPlaceholderText('Search for a currency...'))
        await user.keyboard("bit")
        expect(screen.getByText("Bitcoin", { exact: false })).toBeVisible();
    });

    test("doesn't \"unselect\" a currency when it's clicked once, then clicked again", async () => {
        cleanup();
        render(<TestComponent currencies={["BRL", "USD", "MXN"]} />);

        const currencyButton = screen.getByLabelText("Currency")
        await user.click(currencyButton)
        const popover = document.querySelector(".popover") as HTMLElement
        await user.click(getByText(popover, "BRL", { exact: false }))

        expect(currencyButton.textContent).toBe("BRL");

        await user.click(currencyButton)
        await user.click(getByText(popover, "BRL", { exact: false }))
        expect(currencyButton.textContent).toBe("BRL");
    });
})