import { describe, test, expect, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { IntlProvider } from "react-intl";
import en from "../../languages/en";

import LanguageSelect from "./language-select";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";

const TestComponent = ({
  messages = en,
  ...props
}: {
  messages?: Record<string, string>;
  [key: string]: unknown;
}) => {
  return (
    <IntlProvider locale="en" messages={messages} {...props}>
      <LanguageSelect siteLanguage="pt" />
    </IntlProvider>
  );
};

beforeEach(() => {
  cleanup();
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: TestComponent,
    },
    {
      path: "/de",
      Component: TestComponent,
    },
  ]);
  render(<Stub initialEntries={["/"]} />);
});

describe("<LanguageSelect />", () => {
  const user = userEvent.setup();
  test("displays a combobox", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton).toBeVisible();
  });

  test("gives the combobox an accessible name", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton).toHaveAccessibleName("Language");
  });

  test("loads with the user's native language selected", async () => {
    const selectButton = screen.getByRole("combobox");
    expect(selectButton.textContent).toBe("Português");

    await user.click(selectButton);

    const portuguesOption = document.querySelector("#pt");

    expect(portuguesOption).toHaveAttribute("aria-selected", "true");
    expect(portuguesOption).toHaveTextContent("✓");
  });
});
