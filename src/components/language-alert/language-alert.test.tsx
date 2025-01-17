import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
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
  const americanEnglishSiteLinkText = "Go to the English version of this site";
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="en-US" />);
  });

  test("shows the language alert if (and only if) the user's browser language and site language are mismatched", () => {
    expect(screen.queryByText(americanEnglishSiteLinkText)).toBeVisible();

    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="en" userLanguage="en-US" />);
    expect(
      screen.queryByText(americanEnglishSiteLinkText),
    ).not.toBeInTheDocument();

    cleanup();
    localStorage.clear();
    render(<TestComponent siteLanguage="es" userLanguage="es-EC" />);
    expect(
      screen.queryByText(americanEnglishSiteLinkText),
    ).not.toBeInTheDocument();
  });

  test("has a close button", async () => {
    const user = userEvent.setup();
    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveAccessibleName("Close");

    await user.click(closeButton);
    await waitFor(() => {
      expect(
        screen.queryByText(americanEnglishSiteLinkText),
      ).not.toBeInTheDocument();
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
