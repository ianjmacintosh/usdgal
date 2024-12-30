import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "./languages/en";

import LanguageSelect from "./LanguageSelect";
import userEvent from "@testing-library/user-event";

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
        userLanguage="pt-BR"
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
  const user = userEvent.setup();
  test("displays a combobox", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton).toBeVisible();
  });

  test("loads with the user's native language selected", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton.textContent).toBe("Português");

    await user.click(selectButton);

    const portuguesOption = document.querySelector("#pt-BR");

    expect(portuguesOption).toHaveAttribute("aria-selected", "true");
    expect(portuguesOption).toHaveTextContent("✓");
  });
});
