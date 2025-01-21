import { describe, test, expect } from "vitest";
import { defaultLinks, getMetaTags } from "./remix-page-attribute-helpers";

describe("getMetaTags", () => {
  test("returns an array", () => {
    const result = getMetaTags("en");

    expect(result).toBeInstanceOf(Array);
  });
});

describe("defaultLinks", () => {
  test("is an array", () => {
    const result = defaultLinks();

    expect(result).toBeInstanceOf(Array);
  });
});
