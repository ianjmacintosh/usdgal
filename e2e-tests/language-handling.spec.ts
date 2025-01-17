import { test, expect } from "@playwright/test";

test.use({
  locale: "en-US",
});

test.describe("An en-US user", () => {
  test.describe("visiting the default (English) homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
      console.log(
        `Local storage is: ${await page.evaluate(() => JSON.stringify(localStorage))}`,
      );
    });

    test("sees an English heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Gas Cost", exact: true }),
      ).toBeVisible();
    });

    test("can use the language select to see the site in German", async ({
      page,
    }) => {
      await page.getByRole("combobox", { name: "Language" }).click();
      await page.getByRole("option", { name: "Deutsch" }).click();

      await expect(
        page.getByRole("heading", { name: "Gaskosten", exact: true }),
      ).toBeVisible();

      await expect(page.getByRole("combobox", { name: "Sprache" })).toHaveText(
        "Deutsch",
      );
    });
  });

  test.describe("visiting the /de/ (German) homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/de/");
    });

    test("does not see an English heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Gas Cost", exact: true }),
      ).not.toBeVisible();
    });

    test("sees a language alert", async ({ page }) => {
      await expect(page.getByRole("alert")).toBeVisible();
    });

    test("can dismiss the language alert and won't be pestered by it again", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByRole("alert")).not.toBeVisible();

      await page.reload();
      await expect(page.getByRole("alert")).not.toBeVisible();
    });
  });
});
