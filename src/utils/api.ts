const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create absolute URL; the concept of a relative fetch does not make sense in Node.js

  // Default to Production
  let baseUrl = "https://gasco.st";

  if (import.meta.env.VITE_SERVER_URL) {
    baseUrl = import.meta.env.VITE_SERVER_URL;
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
