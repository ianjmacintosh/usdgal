import { getByText, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

const selectItemFromFancySelect = async (
    selectElement: Element,
    option: string,
  ) => {
    const user = userEvent.setup();
    await user.click(selectElement);
    const popover = document.querySelector(".popover") as HTMLElement;
    await user.click(getByText(popover, option, { exact: false }));

    waitFor(() => {
      expect(selectElement.textContent).toBe(option);
    });
  };

  export { selectItemFromFancySelect }