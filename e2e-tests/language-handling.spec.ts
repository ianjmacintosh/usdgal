import { test, expect } from "@playwright/test";

test.use({
  locale: "en-US",
});

test.describe("An en-US user", () => {
  test.describe("visiting the default (English) homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
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

    test.only("preserves values when changing languages", async ({ page }) => {
      await page.locator("input").first().fill("1234");
      await page.getByRole("combobox", { name: "Language" }).click();
      await page.getByRole("option", { name: "Deutsch" }).click();

      await expect(
        page.getByRole("heading", { name: "Gaskosten", exact: true }),
      ).toBeVisible();

      await expect(page.locator("input").first()).toHaveValue("1234.00");
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

    test("can dismiss the language alert on the German site to tell the site they prefer speaking German", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByRole("alert")).not.toBeVisible();

      await page.reload();
      await expect(page.getByRole("alert")).not.toBeVisible();

      await page.getByRole("combobox", { name: "Sprache" }).click();
      await page.getByRole("option", { name: "English" }).click();

      await expect(page.getByRole("alert")).toHaveText(
        "Gehen Sie zur deutschen Version dieser Website",
      );
      await expect(
        page.getByRole("link", {
          name: "Gehen Sie zur deutschen Version dieser Website",
        }),
      ).toHaveAttribute("href", "/de/");
    });
  });
});
