/*

// Don't lint this or anything, it's a starting point for future tests

import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, getByText, render, screen } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";

describe("<Currency />", () => {
  const user = userEvent.setup();
  const TestComponent = ({ ...props }) => {
    const [currency, setCurrency] = useState<string>("BRL");

    return (
      <IntlProvider locale="en-US" messages={en}>
        <Currency
          currency={currency}
          onCurrencyChange={(newValue) => {
            setCurrency(newValue);
          }}
          {...props}
        />
      </IntlProvider>
    );
  };

  beforeEach(() => {
    cleanup();
    render(<TestComponent />);
  });

  test("doesn't leave the popover in the DOM when it's not in use", async () => {
  });
});
*/
