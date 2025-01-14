const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create absolute URL; the concept of a relative fetch does not make sense in Node.js

  // Default to Production
  let baseUrl = "https://gasco.st";

  // Cloudflare Pages preview deploys use CF_PAGES_URL
  if (typeof process !== "undefined" && process.env.CF_PAGES_URL) {
    baseUrl = process.env.CF_PAGES_URL;

    // Development deploys use localhost:5173
  } else if (import.meta.env.DEV) {
    baseUrl = "http://localhost:5173";
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
