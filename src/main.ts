import "./style.css";

const formEl = document.querySelector("form");

function searchCityWeather(event: Event) {
  event.preventDefault();
  const city = getCity(event);
  const sanititedCity = sanitizeCity(city);
  const isValidCity = isCityValid(sanititedCity);
  displayCityValidationStatus(isValidCity);
}

formEl?.addEventListener("submit", searchCityWeather);

/**
 * Updates the text content and styling of a span element to indicate the validation status of a city.
 *
 * @param isValidCity - A boolean indicating whether the city is valid (true) or invalid (false).
 */
function displayCityValidationStatus(isValidCity: boolean) {
  const spanEl = document.querySelector("span");
  if (!isValidCity) {
    spanEl!.textContent = "Invalid";
    spanEl!.classList.add("text-red-500");
  } else {
    spanEl!.textContent = "Valid";
    spanEl!.classList.add("text-green-500");
  }

  spanEl!.classList.remove("hidden");
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


async function getWeatherData(){
  const apiKey = "use your key"; 
  const lat = "52.520008";
  const lon = "13.404954";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  try {
    const response = await fetch(url);
    console.log(":rocket: ~ getWeatherByCity ~ response:", response)
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    console.log(data); 
    return data;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
}

getWeatherData();