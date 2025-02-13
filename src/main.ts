import "./style.css";

const formEl = document.querySelector("form");
const spanEl = document.querySelector("span");
const API_KEY = "71ef9b2bf0064a20c46c5ee2f838b154";

function searchCityWeather(event: Event) {
  event.preventDefault();
  const city = getCity(event);
  const sanititedCity = sanitizeCity(city);
  const isValidCity = isCityValid(sanititedCity);
  if (isValidCity) {
    // check if the city already exists in localStorage
    const cityData = localStorage.getItem(sanititedCity);
    if (cityData) {
      console.log("Data exists in local storage");
      return;
    }
    getCityWeatherData(sanititedCity);
    spanEl!.classList.add("hidden");
  } else {
    displayInvalidCityMessage(isValidCity);
  }
}

formEl?.addEventListener("submit", searchCityWeather);

/**
 * Updates the text content and styling of a span element to indicate the validation status of a city.
 *
 * @param isValidCity - A boolean indicating whether the city is valid (true) or invalid (false).
 */
function displayInvalidCityMessage(isValidCity: boolean) {
  if (!isValidCity) {
    spanEl!.textContent = "Invalid";
    spanEl!.classList.add("text-red-500");
    spanEl!.classList.remove("hidden");
  }
}

/**
 * Extracts the city value from a form submission event.
 *
 * @param {Event} event - The form submission event.
 * @returns {string} - The value of the city input field.
 */
function getCity(event: Event): string {
  const formData = new FormData(event.target as HTMLFormElement);
  const formInputs = Object.fromEntries(formData.entries());
  const cityValue = formInputs.city as string;
  return cityValue;
}

/**
 * Sanitizes the input city name by trimming whitespace and converting it to lowercase.
 *
 * @param cityValue - The name of the city to sanitize.
 * @returns The sanitized city name.
 */
function sanitizeCity(cityValue: string): string {
  const cityValueSanitized = cityValue.trim().toLowerCase();
  return cityValueSanitized;
}

/**
 * Checks if the given city name is valid based on its length.
 *
 * @param cityValueSanitized - The sanitized city name to validate.
 * @returns `true` if the city name length is between 2 and 100 characters, inclusive; otherwise, `false`.
 */
function isCityValid(cityValueSanitized: string): boolean {
  const isCityValid =
    cityValueSanitized.length >= 2 && cityValueSanitized.length <= 100
      ? true
      : false;
  return isCityValid;
}

async function getCityWeatherData(city: string): Promise<void> {
  console.log("🚀 ~ getCityWeatherData ~ city:", city);
  try {
    const cityCoords = await getCityLatandLon(city);
    if (!cityCoords) {
      throw new Error("Coords not found!");
    }
    const { lat, lon } = cityCoords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    console.log(":rocket: ~ getWeatherByCity ~ response:", response);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    // save data in localStorage
    localStorage.setItem(city, JSON.stringify(data));
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error.message);
  } finally {
    console.log("Finally block");
  }
}

async function getCityLatandLon(
  city: string
): Promise<{ lat: number; lon: number } | null> {
  const geoResponse = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
  );
  const geoData = await geoResponse.json();
  console.log(":rocket: ~ getWeatherData ~ geoData:", geoData);
  if (geoData.length === 0) {
    console.error("City not found!!");
    return null;
  }
  const { lat, lon } = geoData[0];
  return { lat, lon };
}
