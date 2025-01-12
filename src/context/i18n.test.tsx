import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { I18nProvider, useI18n } from "./i18n";

const TestComponent = ({ ...props }: { [key: string]: unknown }) => {
  const { state } = useI18n();
  console.log(state);
  return (
    <I18nProvider {...props}>
      <h1>Hello World</h1>
      <p>User Language: {state.userLanguage}.</p>
      <p>Site Language: {state.siteLanguage}.</p>
      <p>User Location: {state.userLocation}.</p>
    </I18nProvider>
  );
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
    expect(
      screen.getByText("User Language: en-US.", { exact: false }),
    ).toBeVisible();
    expect(
      screen.getByText("Site Language: en.", { exact: false }),
    ).toBeVisible();
    expect(screen.getByText("User Location: .")).toBeVisible();
  });
});
