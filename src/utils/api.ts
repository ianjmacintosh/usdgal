const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create absolute URL; the concept of a relative fetch does not make sense in Node.js

  // Default to Production
  let baseUrl;

  switch (import.meta.env.MODE) {
    // Production should connect to https://gasco.st/
    case "production":
      baseUrl = "https://gasco.st";
      break;

    // Preview builds should connect to their Cloudflare Pages URL (exposed via vite.config.ts "envPrefix" setting)
    case "preview":
      baseUrl = import.meta.env.CF_PAGES_URL;
      break;

    // Everything else should connect to non-HTTPS localhost: http://localhost:5173
    case "testing":
    case "development":
    default:
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
