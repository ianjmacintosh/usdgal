import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import LanguageAlert from "./language-alert";
import TestI18nProvider from "@/context/i18n.test";

type LanguageAlertTestComponentProps = {
  siteLanguage: string;
  userLanguage: string;
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
  const americanEnglishSiteLinkText = "Go to the American English site";
  beforeEach(() => {
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
});
