import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import App from './converter.tsx';
import userEvent from "@testing-library/user-event";
import getGasPrice from '../../utils/get-gas-price.ts';
import { getFormattedPrice } from '../../utils/number-format.ts';
import { selectItemFromFancySelect } from '../../utils/test-utils.ts';
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "../../languages/en.ts";
import es from "../../languages/es.ts";
import { useState } from "react";

export const restHandlers = [
  http.get("/workers/getLocation", () => {
    return HttpResponse.json({ ipData: { country: "US" } });
  }),
];

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

afterEach(() => {
  cleanup();
});

const server = setupServer(...restHandlers);

const TestComponent = ({
  messages = en,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  const [userLanguage, setUserLanguage] = useState(
    navigator.language || "en-US",
  );
  return (
    <IntlProvider locale="en-US" messages={messages}>
      <App
        userLanguage={userLanguage}
        handleLanguageChange={setUserLanguage}
        {...props}
      />
    </IntlProvider>
  );
};

const elements = () => {
  return {
    topPriceInput: screen.getAllByLabelText(/Amount/, {
      selector: "input",
    })[0] as HTMLInputElement,
    bottomPriceInput: screen.getAllByLabelText(/Amount/, {
      selector: "input",
    })[1] as HTMLInputElement,
    topCurrencyInput: screen.getAllByLabelText("Currency")[0],
    topUnitInput: screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[0],
    bottomCurrencyInput: screen.getAllByLabelText("Currency")[1],
    bottomUnitInput: screen.getAllByLabelText("Unit of sale", {
      exact: false,
    })[1],
  };
};

describe("<App userLanguage='es-MX' />", () => {
  beforeAll(() => {
    render(<TestComponent messages={es} userLanguage="es-MX" />);
  });

  test("headline to be in Spanish", () => {
    expect(screen.getByText("Precio de la Gasolina")).toBeVisible();
  });
});

describe("<App userLanguage='en-US' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<TestComponent userLanguage="en-US" />);
  });

  test("loads with the correct starting values", async () => {
    const {
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("MXN");
      expect(topUnitInput.textContent).toBe("per liter");
    });
    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("USD");
      expect(bottomUnitInput.textContent).toBe("per gallon");
    });
  });

  test("can convert a gas price from one currency to another", async () => {
    // Arrange
    const {
      topPriceInput,
      bottomPriceInput,
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    const convertedPrice = getGasPrice(1, "BRL", "liter", "USD", "gallon");
    const formattedPrice = getFormattedPrice(convertedPrice, "en-US", "BRL");

    // Act
    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomUnitInput, "per gallon");
    await user.click(topPriceInput);
    await user.keyboard("1");

    // Assert
    expect(bottomPriceInput.value).toBe(formattedPrice);
  });
});

describe("<App userLanguage='pt-BR' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // This "defaultUserLocation" thing is kind of a hack -- I'm using it to test when we geolocate the Brazilian user as being in Brazil
    render(<TestComponent userLanguage="pt-BR" />);
  });

  test("loads with the correct starting values", async () => {
    const {
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("USD");
      expect(topUnitInput.textContent).toBe("per gallon");
    });
    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("BRL");
      expect(bottomUnitInput.textContent).toBe("per liter");
    });
  });

  test("assumes if the user is at home, they're preparing for a price in USD per gallon", async () => {
    // Arrange
    cleanup();
    const server = setupServer();
    server.use(
      http.get("/workers/getLocation", () => {
        return HttpResponse.json({ ipData: { country: "BR" } });
      }),
    );

    render(<TestComponent userLanguage="pt-BR" />);

    const { topCurrencyInput, topUnitInput } = elements();

    // Act

    // Assert
    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("USD");
    });
    await waitFor(() => {
      expect(topUnitInput.textContent).toBe("per gallon");
    });
  });

  test("can convert a gas price from one currency to another", async () => {
    // Arrange
    const {
      topPriceInput,
      bottomPriceInput,
      topCurrencyInput,
      topUnitInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    const convertedPrice = getGasPrice(1, "BRL", "liter", "USD", "gallon");
    const formattedPrice = getFormattedPrice(convertedPrice, "pt-BR", "BRL");

    // Act
    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomUnitInput, "per gallon");
    await user.click(topPriceInput);
    await user.keyboard("1");

    // Assert
    expect(bottomPriceInput.value).toBe(formattedPrice);
  });

  test.skip("lets users change language with a dropdown", async () => {
    expect(
      screen.getByRole("combobox", { name: /Language/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: /Language/ }));
    await user.click(screen.getByRole("option", { name: /English/ }));

    await waitFor(() => {
      expect(screen.getByText(/Gas Cost/)).toBeVisible();
    });
  });
});
