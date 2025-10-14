import { test, expect } from "@playwright/test";

interface ManifestJson {
  name?: string;
  short_name?: string;
  icons?: { [sizes: string]: string }[];
  start_url?: string;
  display?: string;
}

const homepage = "/";

test.describe("Web app manifest", () => {
  test("satisfies Google Chrome's criteria", async ({ page, request }) => {
    await page.goto(homepage);

    const manifestLink = page.locator("link[rel='manifest']");
    await expect(manifestLink).toHaveCount(1);

    const manifestUrl = (await manifestLink.getAttribute("href")) || "";
    expect(manifestUrl).not.toBe("");

    const response = await request.get(manifestUrl);
    const manifestJson: ManifestJson = await response.json();

    expect("name" in manifestJson || "short_name" in manifestJson).toBeTruthy();
    expect(manifestJson).toHaveProperty("icons");
    expect(
      manifestJson.icons?.some(({ sizes }) => sizes.includes("192x192")) &&
        manifestJson.icons?.some(({ sizes }) => sizes.includes("512x512")),
    ).toBeTruthy();
    expect(manifestJson).toHaveProperty("start_url");
    expect(manifestJson).toHaveProperty("display");
    expect([
      "standalone",
      "minimal-ui",
      "fullscreen",
      "windows-control-overlay",
    ]).toContain(manifestJson.display);
  });
});
