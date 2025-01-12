import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { I18nProvider } from "./i18n";

const TestComponent = ({ ...props }: { [key: string]: unknown }) => {
  return (
    <I18nProvider {...props}>
      <h1>Hello World</h1>
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
});
