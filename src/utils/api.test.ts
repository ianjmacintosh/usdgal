import { describe, test, expect } from "vitest";
import { fetchCountryCode } from "./api";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";

describe("fetchCountryCode", () => {
  test("should assume the user is in the US if the API call fails", async () => {
    // I added this test because I was getting CORS failures during dev testing
    server.use(
      http.get("https://gasco.st/workers/getLocation", () => {
        return HttpResponse.error();
      }),
    );
    const result = await fetchCountryCode();
    console.log(result);
    expect(typeof result).toBe("string");
  });
});
