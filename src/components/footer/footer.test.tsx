import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import Footer from "./footer";
import { IntlProvider } from "react-intl";
import en from "../../languages/en";
import pt from "../../languages/pt";
import { createRoutesStub } from "react-router";
import "@testing-library/jest-dom/vitest";

const EnglishTestComponent = () => {
  return (
    <IntlProvider locale="en-US" messages={en}>
      <Footer siteLanguage="en" />
    </IntlProvider>
  );
};

const PortugueseTestComponent = () => {
  return (
    <IntlProvider locale="pt-BR" messages={pt}>
      <Footer siteLanguage="pt" />
    </IntlProvider>
  );
};

const Stub = createRoutesStub([
  {
    path: "/",
    Component: EnglishTestComponent,
  },
  {
    path: "/pt",
    Component: PortugueseTestComponent,
  },
]);

describe('<Footer> element (loaded in the English site with "en-US" language)', () => {
  beforeEach(() => {
    render(<Stub initialEntries={["/"]} />);
  });

  test("should render the footer", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  test("should render the language dropdown with 'English' as its value", () => {
    const languageDropdown = screen.getByRole("combobox");
    expect(languageDropdown).toBeInTheDocument();
    expect(languageDropdown).toHaveTextContent("English");
  });
});

describe('<Footer> element (loaded in the Portuguese site with "pt-BR" language)', () => {
  beforeEach(() => {
    render(<Stub initialEntries={["/pt"]} />);
  });

  test("should render the footer", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  test("should render the language dropdown with 'Português' as its value", () => {
    const languageDropdown = screen.getByRole("combobox");
    expect(languageDropdown).toBeInTheDocument();
    expect(languageDropdown).toHaveTextContent("Português");
  });
});
