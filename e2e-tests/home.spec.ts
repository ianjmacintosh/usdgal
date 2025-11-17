import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeAll(async ({ page }) => {
    await page.goto("/");
  });

  test("page content isn't taller than the window", async ({ page }) => {
    const windowHeight = await page.evaluate(() => window.innerHeight);
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    expect(pageHeight).toBeLessThanOrEqual(windowHeight);
  });
});
