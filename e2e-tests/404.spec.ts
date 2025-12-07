import { test, expect } from "@playwright/test";

const nonexistentPages = [
  "/$", // Wacky symbol
  "/t", // I've got production requests this
  "/foo", // Not a language code at all
  "/foo/", // Not a language code... and this time it's a directory!
  "/test/", // For some reason, 4-char strings launch a different error than 3-char strings
  "/xx/", // Not a language code but could be because it's 2 chars
  "/it/", // A language code that's not supported
  "/de/foo/", // A language code that's supported, but we're looking for a resource that doesn't exist
];

for (const url of nonexistentPages) {
  test.describe.skip(`${url} response`, () => {
    test("throws a 404 error", async ({ request }) => {
      const response = await request.get(url);

      expect(response.status()).toBe(404);
    });
  });
}
