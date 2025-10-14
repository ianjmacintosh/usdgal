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
        page.locator("legend", { hasText: /^Gas Cost$/ }),
      ).toBeVisible();
    });

    test("can use the language select to see the site in German", async ({
      page,
    }) => {
      await page.getByRole("combobox", { name: "Language" }).click();
      await page.getByRole("option", { name: "Deutsch" }).click();

      await expect(
        page.locator("legend", { hasText: /^Gaskosten$/ }),
      ).toBeVisible();

      await expect(page.getByRole("combobox", { name: "Sprache" })).toHaveText(
        "Deutsch",
      );
    });

    test("preserves values when changing languages", async ({ page }) => {
      await page.locator("input").first().fill("1234");
      await page.getByRole("combobox", { name: "Language" }).click();
      await page.getByRole("option", { name: "Deutsch" }).click();

      await expect(
        page.locator("legend", { hasText: /^Gaskosten$/ }),
      ).toBeVisible();

      await expect(page.locator("input").first()).toHaveValue("1,234.00");
    });
  });

  test.describe("visiting the /de/ (German) homepage", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/de/");
    });

    test('sees the page load in German (<html lang="de">)', async ({
      page,
    }) => {
      await expect(page.locator("html").getAttribute("lang")).resolves.toBe(
        "de",
      );
    });

    test("does not see an English heading", async ({ page }) => {
      await expect(
        page.locator("legend", { hasText: /^Gas Cost$/ }),
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
      // Wait for alert to animate out and be removed from DOM
      await page.locator('[role="alert"]').waitFor({ state: "detached" });

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

    // TODO: Flaky test! Skip this test for now, resolve in the future
    test.skip("can dismiss the language alert using a keyboard", async ({
      page,
    }) => {
      await page.keyboard.press("Escape");
      await expect(page.getByRole("alert")).not.toBeVisible();
      // Wait for alert to animate out and be removed from DOM
      await page.locator('[role="alert"]').waitFor({ state: "detached" });

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
