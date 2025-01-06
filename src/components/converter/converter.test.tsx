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
import Converter from "./converter.tsx";
import userEvent from "@testing-library/user-event";
import getGasPrice from "../../utils/get-gas-price.ts";
import { getFormattedPrice } from "../../utils/number-format.ts";
import { selectItemFromFancySelect } from "../../utils/test-utils.ts";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "../../languages/en.ts";
import es from "../../languages/es.ts";
import pt from "../../languages/pt.ts";
import { createRoutesStub } from "react-router";

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

const englishTestComponent = ({
  messages = en,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="en-US" messages={messages}>
      <Converter userLanguage="en-US" {...props} />
    </IntlProvider>
  );
};

const spanishTestComponent = ({
  messages = es,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="es-MX" messages={messages}>
      <Converter userLanguage="es-MX" {...props} />
    </IntlProvider>
  );
};

const PortugueseTestComponent = ({
  messages = pt,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="pt-BR" messages={messages}>
      <Converter userLanguage="pt-BR" {...props} />
    </IntlProvider>
  );
};

const Stub = createRoutesStub([
  {
    path: "/",
    Component: englishTestComponent,
  },
  {
    path: "/es",
    Component: spanishTestComponent,
  },
  {
    path: "/pt",
    Component: PortugueseTestComponent,
  },
]);

const elements = () => {
  return {
    topPriceInput: screen.getAllByRole("textbox")[0] as HTMLInputElement,
    bottomPriceInput: screen.getAllByRole("textbox")[1] as HTMLInputElement,
    topCurrencyInput: screen.getAllByRole("combobox")[0],
    topUnitInput: screen.getAllByRole("combobox")[1],
    bottomCurrencyInput: screen.getAllByRole("combobox")[2],
    bottomUnitInput: screen.getAllByRole("combobox")[3],
  };
};

describe("<Converter userLanguage='es-MX' />", () => {
  beforeEach(() => {
    render(<Stub initialEntries={["/es"]} />);
  });

  test("headline to be in Spanish", () => {
    expect(screen.getByText("Precio de la Gasolina")).toBeVisible();
  });
});

describe("<Converter userLanguage='en-US' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<Stub initialEntries={["/"]} />);
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

  test.skip("correctly converts BRL per liter to USD per gallon", async () => {});
  test.skip("rounds prices correctly (to 2 decimal places)", async () => {});
  test.skip("doesn't throw NaN errors when the user provides incomplete numbers", async () => {});
  test.skip("converts prices with commas from local to home", async () => {});
  test.skip("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {});
  test.skip("updates bottom price (but not top price) when the user updates the bottom currency or units", async () => {});
  test.skip("has a link for my personal site and my GitHub project", () => {});
});

describe("<Converter userLanguage='pt-BR' />", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // This "defaultUserLocation" thing is kind of a hack -- I'm using it to test when we geolocate the Brazilian user as being in Brazil
    render(<Stub initialEntries={["/pt"]} />);
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
      expect(topUnitInput.textContent).toBe("por galão");
    });
    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("BRL");
      expect(bottomUnitInput.textContent).toBe("por litro");
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

    render(<Stub initialEntries={["/pt"]} />);

    const { topCurrencyInput, topUnitInput } = elements();

    // Act

    // Assert
    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("USD");
    });
    await waitFor(() => {
      expect(topUnitInput.textContent).toBe("por galão");
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
    await selectItemFromFancySelect(topUnitInput, "por litro");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(bottomUnitInput, "por galão");
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

  test.skip("converts units to BRL and liters", () => {});
  test.skip("renders 0 like '0,00' (with a comma, not a period)", () => {});
  test.skip("allows the user to update the number field", async () => {});
});
