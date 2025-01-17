import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import LanguageAlert from "./language-alert";
import TestI18nProvider from "@/context/i18n.test";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";

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

const Stub = createRoutesStub([
  {
    path: "/",
    Component: () => <TestComponent siteLanguage="en" userLanguage="en-US" />,
  },
  {
    path: "/hi/en/",
    Component: () => <TestComponent siteLanguage="hi" userLanguage="en-US" />,
  },
]);

describe("<LanguageAlert />", () => {
  const americanEnglishSiteLinkText = "Go to the English version of this site";
  beforeEach(() => {
    cleanup();
    render(<TestComponent siteLanguage="es" userLanguage="en-US" />);
  });
  test("shows the language alert if (and only if) the user's browser language and site language are mismatched", () => {
    expect(screen.queryByText(americanEnglishSiteLinkText)).toBeVisible();

    cleanup();
    render(<TestComponent siteLanguage="en" userLanguage="en-US" />);
    expect(
      screen.queryByText(americanEnglishSiteLinkText),
    ).not.toBeInTheDocument();

    cleanup();
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
    render(<TestComponent siteLanguage="es" userLanguage="en-UK" />);
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/");
  });

  test("shows a link (in Spanish) to the Spanish site when a es-MX user shows up to the English site", () => {
    cleanup();
    render(<TestComponent siteLanguage="en" userLanguage="es-MX" />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Ir a la versión española de este sitio");
    expect(link).toHaveAttribute("href", "/es/");
  });

  test("shows a link (in English) to the English site when a zh-Hans user shows up to the Spanish site", () => {
    cleanup();
    render(<TestComponent siteLanguage="es" userLanguage="zh-Hans" />);
    const link = screen.getByRole("link");

    expect(link).toHaveTextContent("Go to the English version of this site");
    expect(link).toHaveAttribute("href", "/");
  });

  // These tests all seem really E2E-like... should be either reworked OR put into an E2E test
  describe.skip("when the user clicks the 'Go to English site' link on the Hindi site", () => {
    beforeEach(() => {
      cleanup();
      render(<Stub initialEntries={["/hi/en/"]} />);
    });
    test("doesn't show a language alert when they get to the English site", async () => {
      const link = screen.getByRole("link");

      await userEvent.click(link);

      await waitFor(() => {
        screen.findByText("Gas Cost");
      });

      expect(
        screen.queryByText(americanEnglishSiteLinkText),
      ).not.toBeInTheDocument();
    });
    test.skip("shows the language alert again if they come back to a non-English site", () => {});
  });

  describe.skip("when the user intentionally clicked the language select dropdown", () => {
    test("doesn't show a language alert when they get to the site they picked -- even if they've never dismissed it", () => {});
    test("shows a language alert when they get to a different site than the one they picked -- even if it matches their system settings", () => {});
  });

  describe.skip("when the user closes the language alert", () => {
    test("doesn't show the language alert again if they visit the same page again", () => {});
    test("displays if they go to a different language version of the site (even if it matches their system settings)", () => {});
  });

  describe.skip("when the user ignores the language alert", () => {
    test("displays again if they refresh", () => {});
    test("does not display if they go to their system settings's preferred language", () => {});
  });
});
