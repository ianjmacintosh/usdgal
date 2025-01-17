import { test, expect } from "@playwright/test";

test.describe("Default (English) homepage", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
  });

  test("loads a title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Gas Cost", exact: true }),
    ).toBeVisible();
  });
});
