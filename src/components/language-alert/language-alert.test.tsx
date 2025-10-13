import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import LanguageAlert from "./language-alert";
import TestI18nProvider from "@/context/i18n.test";
import userEvent from "@testing-library/user-event";

type LanguageAlertTestComponentProps = {
  siteLanguage: string;
  userLanguage?: string;
};

const TestComponent = ({
  siteLanguage = "en",
  userLanguage = "en-US",
}: LanguageAlertTestComponentProps) => {
  return (
    <TestI18nProvider siteLanguage={siteLanguage} userLanguage={userLanguage}>
      <LanguageAlert />
    </TestI18nProvider>
  );
};

describe("<LanguageAlert />", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="en-US" />);
  });

  describe('when the user\'s browser language is en-US and the site language is "es"', () => {
    beforeAll(() => {
      cleanup();
      localStorage.clear();
      render(<TestComponent siteLanguage="es" userLanguage="en-US" />);
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
      expect(screen.getByRole("alert")).toHaveAttribute("lang", "en");
    });
  });

  test("does NOT show a language alert if the user's browser language is es-EC and the site shows in Spanish (es)", async () => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="es-EC" />);
    await expect(screen.queryByRole("alert", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true",
    );
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

  test("shows a link to the English site when a en-UK user shows up to the Spanish site", () => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="en-UK" />);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/");
  });

  test("shows a link (in Spanish) to the Spanish site when a es-MX user shows up to the English site", () => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="en" userLanguage="es-MX" />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Ir a la versión española de este sitio");
    expect(link).toHaveAttribute("href", "/es/");
  });

  test("shows a link (in English) to the English site when a zh-Hans user shows up to the Spanish site", () => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="zh-Hans" />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Go to the English version of this site");
    expect(link).toHaveAttribute("href", "/");
  });
});
