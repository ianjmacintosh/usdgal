import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import LanguageAlert from "./language-alert";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

type LanguageAlertTestComponentProps = {
  language: string; // Add this - what language to show alert in
  onDismiss?: () => void; // Add this - optional, defaults to no-op
};

const TestComponent = ({
  language,
  onDismiss = () => {}, // Default to no-op function
}: LanguageAlertTestComponentProps) => {
  return <LanguageAlert language={language} onDismiss={onDismiss} />;
};

describe("<LanguageAlert />", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    render(<TestComponent language="en" />);
  });

  describe('when the user\'s browser language is en-US and the site language is "es"', () => {
    beforeAll(() => {
      cleanup();
      localStorage.clear();
      render(<TestComponent language="en" />);
    });
    test("shows the language alert", async () => {
      expect(screen.queryByRole("alert")).toBeVisible();
    });
    test("alerts the user in English", async () => {
      expect(screen.queryByRole("alert")).toHaveAttribute("lang", "en");
    });

    test("keeps the language alert in English when dismissed", async () => {
      const alertTextInEnglish = screen.getByRole("alert").textContent;

      const closeButton = screen.getByRole("button");
      expect(closeButton).toHaveAccessibleName("Close");

      await userEvent.click(closeButton);

      expect(screen.getByRole("alert", { hidden: true }).textContent).toBe(
        alertTextInEnglish,
      );
      expect(screen.getByRole("alert", { hidden: true })).toHaveAttribute(
        "lang",
        "en",
      );
    });
  });

  test("can be dismissed by clicking the 'Close' button", async () => {
    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.queryByRole("alert", { hidden: true })).toBeVisible();
    });

    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveAccessibleName("Close");

    await user.click(closeButton);
    waitFor(() => {
      expect(screen.queryByRole("alert")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  test("can be dismissed by hitting 'Escape' on the keyboard", async () => {
    const user = userEvent.setup();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveAccessibleName("Close");

    await user.click(closeButton);
    waitFor(() => {
      expect(screen.queryByRole("alert")).not.toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  test("shows a link to the English site when a en-US user shows up to the Spanish site", () => {
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/");
  });

  test("shows a link (in Spanish) to the Spanish site when a es-MX user shows up to the English site", () => {
    cleanup();
    localStorage.clear();
    render(<TestComponent language="es" />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Ir a la versión española de este sitio");
    expect(link).toHaveAttribute("href", "/es/");
  });
});
