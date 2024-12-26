const API_GETLOCATION_URL = "/workers/getLocation";

export async function fetchCountryCode() {
  try {
    const response = await fetch(API_GETLOCATION_URL);
    const data = await response.json();
    return data.ipData.country;
  } catch (error) {
    console.error(error);
    return null;
  }
}
