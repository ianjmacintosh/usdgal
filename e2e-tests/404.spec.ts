import { test, expect } from "@playwright/test";

const nonexistentPages = ["/$", "/t"];

for (const url of nonexistentPages) {
  test.describe.skip(`${url} response`, () => {
    test("throws a 404 error", async ({ request }) => {
      const response = await request.get(url);

      expect(response.status()).toBe(404);
    });
  });
}
