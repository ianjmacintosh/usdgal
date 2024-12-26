export async function getCountryCode() {
  try {
    const response = await fetch("/getLocation.test.json");
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error(error);
    return null;
  }
}
