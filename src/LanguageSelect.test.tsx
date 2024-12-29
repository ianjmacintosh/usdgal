import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "./languages/en";

import LanguageSelect from "./LanguageSelect";

const TestComponent = ({
  messages = en,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="en-US" messages={messages} {...props}>
      <LanguageSelect
        userLanguage="en-US"
        onLanguageChange={(newLang) => {
          console.log(`Language changed to ${newLang}`);
        }}
      />
    </IntlProvider>
  );
};

beforeEach(() => {
  cleanup();
  render(<TestComponent />);
});

describe("<LanguageSelect />", () => {
  test("displays a combobox", async () => {
    expect(screen.getByRole("combobox")).toBeVisible();
  });
});
