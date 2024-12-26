export async function fetchCountryCode() {
  try {
    const response = await fetch("/getLocation.test.json");
    const data = await response.json();
    return data.ipData.country;
  } catch (error) {
    console.error(error);
    return null;
  }
}
