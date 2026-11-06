// Get HTML elements

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const weatherDate = document.getElementById("weatherDate");
const weatherIcon = document.getElementById("weatherIcon");

const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");

const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const windSpeed = document.getElementById("windSpeed");


// Store the API key from config.js

const API_KEY = window.OPENWEATHER_API_KEY;


// Display messages

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message " + type;
}


// Fetch weather details

async function getWeather(city) {

    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" ||
        API_KEY === "PASTE_YOUR_API_KEY_HERE") {

        showMessage("Please add your OpenWeatherMap API key in config.js.", "error");
        return;
    }

    const baseURL = "https://api.openweathermap.org/data/2.5/weather";

    const parameters = new URLSearchParams({
        q: city,
        appid: API_KEY,
        units: "metric"
    });

    const API_URL = `${baseURL}?${parameters.toString()}`;

    try {

        // Show loading message

        searchButton.disabled = true;
        searchButton.textContent = "Searching...";
        showMessage("Fetching weather information...", "");
        weatherCard.hidden = true;

        // Fetch data from the API

        const response = await fetch(API_URL);

        // Convert response into JSON

        const data = await response.json();

        // Check for API errors

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("City not found. Please check the city name.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your config.js file.");
            }

            throw new Error(data.message || "Unable to fetch weather data.");
        }

        // Display the weather details

        displayWeather(data);

        showMessage("Weather information loaded successfully.", "success");

    } catch (error) {

        showMessage(error.message, "error");
        weatherCard.hidden = true;

    } finally {

        // Restore the button

        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
}


// Display API response on the webpage

function displayWeather(data) {

    // Location details

    cityName.textContent = `${data.name}, ${data.sys.country}`;

    weatherDate.textContent =
        "Updated: " + new Date(data.dt * 1000).toLocaleString();

    // Temperature

    temperature.textContent = `${Math.round(data.main.temp)}°C`;

    // Weather condition

    weatherCondition.textContent = data.weather[0].description;

    // Weather icon

    const iconCode = data.weather[0].icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherIcon.alt = data.weather[0].description;

    // Additional weather information

    humidity.textContent = `${data.main.humidity}%`;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    windSpeed.textContent = `${data.wind.speed} m/s`;

    // Show the weather card

    weatherCard.hidden = false;
}


// Handle search form submission

weatherForm.addEventListener("submit", function (event) {

    // Prevent page refresh

    event.preventDefault();

    // Get city name

    const city = cityInput.value.trim();

    if (city === "") {
        showMessage("Please enter a city name.", "error");
        weatherCard.hidden = true;
        return;
    }

    // Call weather function

    getWeather(city);
});