const API_GETLOCATION_PATH = "/workers/getLocation";

export async function fetchCountryCode() {
  // Create URL based on environment variables; worst case, go to prod
  const serverUrl =
    import.meta.env.MODE === "development"
      ? "http://localhost:5173"
      : "https://gasco.st";
  const geolocationApiUrl = new URL(API_GETLOCATION_PATH, serverUrl);
  try {
    const response = await fetch(geolocationApiUrl);
    const data = await response.json();
    return data.ipData.country;
  } catch (error) {
    console.error(error);
    return null;
  }
}
