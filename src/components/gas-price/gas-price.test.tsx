import { describe, test, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import GasPrice from "./gas-price";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import {
  GasPricesContext,
  GasPricesDispatchContext,
  gasPricesReducer,
  getInitialGasPrices,
} from "@/contexts/gas-price-context";
import en from "@/languages/en";
import { IntlProvider } from "react-intl";
import { useReducer } from "react";

describe("<GasPrice />", () => {
  const user = userEvent.setup();
  const TestComponent = ({ ...props }) => {
    const [gasPrices, dispatch] = useReducer(
      gasPricesReducer,
      getInitialGasPrices("US", "HN"),
    );

    return (
      <IntlProvider locale="en-US" messages={en}>
        <GasPricesContext.Provider value={gasPrices}>
          <GasPricesDispatchContext.Provider value={dispatch}>
            <GasPrice
              label="test"
              siteLanguage="en-US"
              gasPricesKey="top"
              {...props}
            />
          </GasPricesDispatchContext.Provider>
        </GasPricesContext.Provider>
      </IntlProvider>
    );
  };

  test("warns when a display value is 0 but the actual value is not", async () => {
    cleanup();
    render(<TestComponent />);

    const input = screen.getByLabelText("Amount", {
      exact: false,
    }) as HTMLInputElement;

    await user.click(input);
    await user.clear(input);
    expect(input.value).toBe("");
    await user.keyboard("0.0001");
    expect(input.value).toBe("0.0001");
    await user.tab();
    expect(input.value).toBe("0.01");

    const warning = screen.getByText("This amount is displayed as 0.01", {
      exact: false,
    });
    expect(warning).toBeVisible();
  });
});
