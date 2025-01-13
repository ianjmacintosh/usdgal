import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { I18nProvider, useI18n } from "./i18n";
import { FormattedMessage } from "react-intl";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

type TestI18nProviderProps = {
  children: React.ReactNode;
  siteLanguage?: string;
  userLanguage?: string;
  userLocation?: string;
};

const TestI18nProvider = ({
  children,
  siteLanguage = "en",
  userLocation = "FR",
  ...props
}: TestI18nProviderProps) => {
  const server = setupServer(
    http.get("/workers/getLocation", () => {
      return HttpResponse.json({ ipData: { country: userLocation } });
    }),
  );

  server.listen();

  return (
    <I18nProvider siteLanguage={siteLanguage} {...props}>
      {children}
    </I18nProvider>
  );
};

const TestComponent = () => {
  const { state, dispatch } = useI18n();
  return (
    <>
      <h1>Hello World</h1>
      <h2>
        <FormattedMessage id="meta_title" />
      </h2>
      <p>Site Language: {state.siteLanguage}.</p>
      <p>User Language: {state.userLanguage}.</p>
      <p>User Location: {state.userLocation}.</p>
      <button
        onClick={() => dispatch({ type: "setSiteLanguage", payload: "pt" })}
      >
        Update Site Language to "pt"
      </button>
      <button
        onClick={() => dispatch({ type: "setUserLanguage", payload: "in-HI" })}
      >
        Update User Language to "in-HI"
      </button>
      <button
        onClick={() => dispatch({ type: "setUserLocation", payload: "GT" })}
      >
        Update User Location to "GT"
      </button>
    </>
  );
};

const elements = () => {
  return {
    siteLanguageText: screen.getByText("Site Language:", { exact: false }),
    userLanguageText: screen.getByText("User Language:", { exact: false }),
    userLocationText: screen.getByText("User Location:", { exact: false }),
    siteLanguageButton: screen.getByRole("button", {
      name: 'Update Site Language to "pt"',
    }),
    userLanguageButton: screen.getByRole("button", {
      name: 'Update User Language to "in-HI"',
    }),
    userLocationButton: screen.getByRole("button", {
      name: 'Update User Location to "GT"',
    }),
  };
};

beforeEach(() => {
  cleanup();
  render(
    <TestI18nProvider>
      <TestComponent />
    </TestI18nProvider>,
  );
});

describe("<I18nProvider />", () => {
  test("renders child elements", async () => {
    expect(screen.getByText("Hello World")).toBeVisible();
  });

  test("provides expected default values for userLanguage, siteLanguage, and userLocation", async () => {
    expect(elements().siteLanguageText).toHaveTextContent("en.");
    expect(elements().userLanguageText).toHaveTextContent("en-US.");
    expect(elements().userLocationText).toHaveTextContent(": .");
  });

  test("supports updates via reducer", async () => {
    const user = userEvent.setup();

    await user.click(elements().siteLanguageButton);
    expect(elements().siteLanguageText).toHaveTextContent("pt.");

    await user.click(elements().userLanguageButton);
    expect(elements().userLanguageText).toHaveTextContent("in-HI.");

    await user.click(elements().userLocationButton);
    expect(elements().userLocationText).toHaveTextContent("GT.");
  });

  test("updates userLocation using geolocation endpoint", async () => {
    // See msw implementation at https://github.com/ianjmacintosh/usdgal/blob/91011d506032326067c13e942e744f1f2608e36d/src/App.test.tsx
    await waitFor(() => {
      expect(elements().userLocationText).toHaveTextContent("FR.");
    });
  });

  test("provides necessary context to support <FormattedMessage />", async () => {
    expect(screen.getByText("Gas Price Converter")).toBeVisible();
  });
});

export default TestI18nProvider;
