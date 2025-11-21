const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create absolute URL; the concept of a relative fetch does not make sense in Node.js

  // Default to Production -- yields CORS errors in non-prod environments!
  let baseUrl = "https://gasco.st";

  // Cloudflare Pages exposes the HTTP server's host as "CF_PAGES_URL"
  if (import.meta.env.CF_PAGES_URL) {
    // In Production, my build settings set CF_PAGES_URL=https://gasco.st
    // In Preview environments, Cloudflare dynamically sets CF_PAGES_URL
    // In Development, ".env.development" sets CF_PAGES_URL=http://localhost:5173
    baseUrl = import.meta.env.CF_PAGES_URL;
  }

  const geolocationApiUrl = new URL(API_GETLOCATION_PATH, baseUrl);

  try {
    const response = await fetch(geolocationApiUrl);
    const data = await response.json();
    return data.ipData.country;
  } catch (error) {
    console.error(
      `Error fetching country code from ${geolocationApiUrl}`,
      error,
    );
    return "US"; // Default to US
  }
}
