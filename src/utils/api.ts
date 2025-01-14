const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create absolute URL; the concept of a relative fetch does not make sense in Node.js

  // Default to Production
  let baseUrl;

  switch (import.meta.env.MODE) {
    case "production":
      if (typeof import.meta.env.CF_PAGES_URL === "undefined") {
        throw new Error(
          "While building for Production, could not find Cloudflare Pages URL",
        );
      }

      baseUrl =
        import.meta.env.CF_PAGES_BRANCH === "main"
          ? "https://gasco.st"
          : import.meta.env.CF_PAGES_URL;
      break;
    case "development":
      baseUrl = "http://localhost:5173";
      break;
  }
  const geolocationApiUrl = new URL(API_GETLOCATION_PATH, baseUrl);

  try {
    const response = await fetch(geolocationApiUrl);
    const data = await response.json();
    return data.ipData.country;
  } catch (error) {
    console.error(error);
    return null;
  }
}
