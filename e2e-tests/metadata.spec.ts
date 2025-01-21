import { test, expect } from "@playwright/test";

const homepages = ["/", "/es/", "/de/", "/pt/", "/hi/"];

for (const url of homepages) {
  test.describe(`${url} sharing tags`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
    });

    test("include standard meta tags", async ({ page }) => {
      // Title
      const pageTitle = page.locator("html > head > title");
      await expect(pageTitle).toHaveCount(1);

      // Description
      const metaDescription = page.locator("meta[name='description']");
      await expect(metaDescription).toHaveCount(1);

      // Canonical URL
      const metaCanonical = page.locator("link[rel='canonical']");
      await expect(metaCanonical).toHaveCount(1);

      // Alternate URLs
      await expect
        .poll(() => page.locator("link[rel='alternate']").count())
        .toBeGreaterThan(0);
    });

    test("include required OGP tags", async ({ page }) => {
      // REQUIRED:
      // og:title
      const ogTitle = page.locator("meta[property='og:title']");
      await expect(ogTitle).toHaveCount(1);

      // og:type
      const ogType = page.locator("meta[property='og:type']");
      await expect(ogType).toHaveAttribute("content", "website");

      // og:image
      const ogImage = page.locator("meta[property='og:image']");
      await expect(ogImage).toHaveCount(1);

      // og:url
      const ogUrl = page.locator("meta[property='og:url']");
      await expect(ogUrl).toHaveCount(1);
    });
  });

  // OPTIONAL:
  // Description
  // Locale
  // Alternates
}
