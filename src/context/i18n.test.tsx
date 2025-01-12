import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { I18nProvider, useI18n } from "./i18n";
import userEvent from "@testing-library/user-event";

const TestComponent = ({ ...props }: { [key: string]: unknown }) => {
  const { state, dispatch } = useI18n();
  return (
    <I18nProvider {...props}>
      <h1>Hello World</h1>
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
    </I18nProvider>
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
    <I18nProvider>
      <TestComponent />
    </I18nProvider>,
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
});
