import { I18nProvider } from "@/context/i18n";
import { getByText, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

type IntlTestWrapperProps = {
  children: React.ReactNode;
  siteLanguage?: string;
};

const selectItemFromFancySelect = async (
  selectElement: Element,
  option: string,
) => {
  const user = userEvent.setup();
  await user.click(selectElement);
  const popover = document.querySelector(".popover") as HTMLElement;
  await user.click(getByText(popover, option, { exact: false }));

  await waitFor(() => {
    expect(selectElement.textContent).toBe(option);
  });
};

const TestI18nContextWrapper = ({
  children,
  ...props
}: IntlTestWrapperProps) => {
  return (
    <I18nProvider siteLanguage="en" {...props}>
      {children}
    </I18nProvider>
  );
};

export { TestI18nContextWrapper, selectItemFromFancySelect };
