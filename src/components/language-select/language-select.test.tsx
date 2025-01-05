import { describe, test, expect, beforeEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "../../languages/en";

import LanguageSelect from "./language-select";
import userEvent from "@testing-library/user-event";

const mockLanguageChangeHandler = vi.fn();

const TestComponent = ({
  messages = en,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="en" messages={messages} {...props}>
      <LanguageSelect
        userLanguage="pt"
        onLanguageChange={mockLanguageChangeHandler}
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

    const portuguesOption = document.querySelector("#pt");

    expect(portuguesOption).toHaveAttribute("aria-selected", "true");
    expect(portuguesOption).toHaveTextContent("✓");
  });

  test("asks to update the language when the user changes its value", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton.textContent).toBe("Português");

    await user.click(selectButton);

    const germanOption = document.querySelector("#de") as HTMLElement;

    await user.click(germanOption);

    expect(mockLanguageChangeHandler).toHaveBeenCalledWith("de");
  });
});
