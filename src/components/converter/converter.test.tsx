import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import Converter from "./converter.tsx";
import userEvent from "@testing-library/user-event";
import getGasPrice from "../../utils/get-gas-price.ts";
import { getFormattedPrice } from "../../utils/number-format.ts";
import { selectItemFromFancySelect } from "../../utils/test-utils.ts";
import "@testing-library/jest-dom/vitest";
import { createRoutesStub } from "react-router";
import { fakeExchangeRateData as exchangeRateData } from "@/utils/exchange-rate-data.server.ts";
import TestI18nProvider from "@/context/i18n.test.tsx";
import { server } from "@/mocks/server.ts";
import { getGeolocationHandlers } from "@/mocks/handlers.ts";

afterEach(() => {
  cleanup();
});

const englishTestComponent = ({ ...props }: { [key: string]: unknown }) => {
  return (
    <TestI18nProvider siteLanguage="en" userLanguage="en-US">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const mixedUpEnglishTestComponent = ({
  ...props
}: {
  [key: string]: unknown;
}) => {
  return (
    <TestI18nProvider siteLanguage="en" userLanguage="pt-BR">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const spanishTestComponent = ({ ...props }: { [key: string]: unknown }) => {
  return (
    <TestI18nProvider siteLanguage="es" userLanguage="es-MX">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const PortugueseTestComponent = ({ ...props }: { [key: string]: unknown }) => {
  return (
    <TestI18nProvider siteLanguage="pt" userLanguage="pt-BR">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const BritishOnSpanishSiteTestComponent = ({
  ...props
}: {
  [key: string]: unknown;
}) => {
  return (
    <TestI18nProvider siteLanguage="es" userLanguage="en-UK">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const ChineseOnSpanishSiteTestComponent = ({
  ...props
}: {
  [key: string]: unknown;
}) => {
  return (
    <TestI18nProvider siteLanguage="es" userLanguage="zh-Hans">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const EcuadorianOnSpanishSiteTestComponent = ({
  ...props
}: {
  [key: string]: unknown;
}) => {
  return (
    <TestI18nProvider siteLanguage="es" userLanguage="es-EC">
      <Converter exchangeRateData={exchangeRateData} {...props} />
    </TestI18nProvider>
  );
};

const Stub = createRoutesStub([
  {
    path: "/",
    Component: englishTestComponent,
  },
  {
    path: "/en/in/",
    Component: mixedUpEnglishTestComponent,
  },
  {
    path: "/es/",
    Component: spanishTestComponent,
  },
  {
    path: "/pt/",
    Component: PortugueseTestComponent,
  },
  {
    path: "/es/british/",
    Component: BritishOnSpanishSiteTestComponent,
  },
  {
    path: "/es/chinese/",
    Component: ChineseOnSpanishSiteTestComponent,
  },
  {
    path: "/es/ecuadorian/",
    Component: EcuadorianOnSpanishSiteTestComponent,
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

describe('<Converter siteLanguage="en-US" userLanguage="es-MX" />', () => {
  beforeEach(() => {
    cleanup();
    server.use(...getGeolocationHandlers("US"));

    render(<Stub initialEntries={["/es/"]} />);
  });

  test("headline to be in Spanish", async () => {
    await waitFor(() => {
      expect(screen.getAllByText("Precio de la Gasolina")[0]).toBeVisible();
    });
  });
});

describe('<Converter siteLanguage="en-US" userLanguage="en-US" />', () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    cleanup();
    server.use(...getGeolocationHandlers("US"));

    render(<Stub initialEntries={["/"]} />);
    await waitFor(() => {
      expect(screen.getAllByText("Gas Cost")[0]).toBeVisible();
    });
  });

  test("assumes Americans are going to Mexico", async () => {
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
      expect(bottomCurrencyInput.textContent).toBe("MXN");
      expect(bottomUnitInput.textContent).toBe("per liter");
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

    const convertedPrice = getGasPrice(
      1,
      "BRL",
      "liter",
      "USD",
      "gallon",
      exchangeRateData.rates,
    );
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

  test("updates top price when the user changes the bottom price", async () => {
    const { topPriceInput, bottomPriceInput } = elements();

    await user.click(bottomPriceInput);
    await user.keyboard("1");
    expect(topPriceInput.value).not.toBe("0.00");
  });

  test("correctly converts BRL per liter to USD per gallon", async () => {
    const {
      topPriceInput,
      topCurrencyInput,
      topUnitInput,
      bottomPriceInput,
      bottomCurrencyInput,
      bottomUnitInput,
    } = elements();

    // Store the correct conversion of 1.00 BRL per liter to USD per gallon in a variable named "expectedPrice"
    const expectedPrice = getGasPrice(
      1,
      "BRL",
      "liter",
      "USD",
      "gallon",
      exchangeRateData.rates,
    );

    await user.click(topPriceInput);
    await user.keyboard("{backspace}{backspace}{backspace}{backspace}");
    await user.keyboard("1");

    await selectItemFromFancySelect(topCurrencyInput, "BRL");
    await selectItemFromFancySelect(bottomCurrencyInput, "USD");
    await selectItemFromFancySelect(topUnitInput, "per liter");
    await selectItemFromFancySelect(bottomUnitInput, "per gallon");
    expect(bottomPriceInput.value).not.toBe("0.00");
    expect(bottomPriceInput.value).toBe(expectedPrice.toFixed(2));
  });

  test.skip("rounds prices correctly (to 2 decimal places)", async () => {});
  test.skip("doesn't throw NaN errors when the user provides incomplete numbers", async () => {});
  test.skip("converts prices with commas from local to home", async () => {});
  test.skip("does a normal 1:1 conversion when currencies and units of measure are set to be equal", async () => {});
  test.skip("updates bottom price (but not top price) when the user updates the bottom currency or units", async () => {});
  test.skip("has a link for my personal site and my GitHub project", () => {});
});

describe("<Converter /> displayed in English for a pt-BR user located in India", () => {
  beforeEach(async () => {
    cleanup();
    server.use(...getGeolocationHandlers("IN"));

    render(<Stub initialEntries={["/en/in/"]} />);
    await waitFor(() => {
      expect(screen.getAllByText("Gas Cost")[0]).toBeVisible();
    });
  });

  test('loads top gas price (local gas price -- "converting from" price) based on user location', async () => {
    const { topCurrencyInput, topUnitInput } = elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("INR");
      expect(topUnitInput.textContent).toBe("per liter");
    });
  });

  test('loads the bottom gas price (converted as price -- "converting to" price) based on user location and browser settings', async () => {
    const { bottomCurrencyInput, bottomUnitInput } = elements();

    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("BRL");
      expect(bottomUnitInput.textContent).toBe("per liter");
    });
  });

  test('displays the "last updated" date in the site language (English)', () => {
    expect(
      screen.getByText(
        Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(exchangeRateData.timestamp * 1000),
        { exact: false },
      ),
    ).toBeInTheDocument();
  });
});

describe('<Converter siteLanguage="pt-BR" userLanguage="pt-BR" />', () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    cleanup();
    server.use(...getGeolocationHandlers("BR"));

    render(<Stub initialEntries={["/pt/"]} />);
    await waitFor(() => {
      // Wait for geolookup to finish
      expect(screen.getAllByText("Preço da Gasolina")[0]).toBeVisible();
    });
  });

  test('loads top gas price (local gas price -- "converting from" price) based on user location', async () => {
    const { topCurrencyInput, topUnitInput } = elements();

    await waitFor(() => {
      expect(topCurrencyInput.textContent).toBe("BRL");
      expect(topUnitInput.textContent).toBe("por litro");
    });
  });

  test('loads the bottom gas price (converted as price -- "converting to" price) based on user location and browser settings', async () => {
    const { bottomCurrencyInput, bottomUnitInput } = elements();

    await waitFor(() => {
      expect(bottomCurrencyInput.textContent).toBe("USD");
      expect(bottomUnitInput.textContent).toBe("por galão");
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

    const convertedPrice = getGasPrice(
      1,
      "BRL",
      "liter",
      "USD",
      "gallon",
      exchangeRateData.rates,
    );
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

describe("<Converter /> - Language Alert Behavior", () => {
  test("shows language alert in English for Chinese user on Spanish site", async () => {
    cleanup();
    localStorage.clear();
    server.use(...getGeolocationHandlers("US"));

    render(<Stub initialEntries={["/es/chinese/"]} />);

    await waitFor(() => {
      const alert = screen.queryByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("lang", "en");
      expect(alert).toHaveTextContent("Go to the English version of this site");
    });
  });

  test("shows language alert in English for British user on Spanish site", async () => {
    cleanup();
    localStorage.clear();
    server.use(...getGeolocationHandlers("US"));

    render(<Stub initialEntries={["/es/british/"]} />);

    await waitFor(() => {
      const alert = screen.queryByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute("lang", "en");
    });
  });

  test("does NOT show language alert for Ecuadorian Spanish user on Spanish site", async () => {
    cleanup();
    localStorage.clear();
    server.use(...getGeolocationHandlers("US"));

    render(<Stub initialEntries={["/es/ecuadorian/"]} />);
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
