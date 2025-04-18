// script.js
const API_KEY = 'b8f39f3f22df6aa62bdef2c1e902e798 '; // Replace with your actual OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');

// DOM Elements
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

async function getWeatherData(city) {
    try {
        searchBtn.disabled = true;
        const response = await fetch(
            `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            if (response.status === 404) throw new Error('City not found');
            if (response.status === 401) throw new Error('Invalid API key');
            throw new Error('Something went wrong');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        showError(error.message);
        return null;
    } finally {
        searchBtn.disabled = false;
    }
}

function formatTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateWeatherUI(data) {
    try {
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description.charAt(0).toUpperCase() + 
            data.weather[0].description.slice(1);
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
        feelsLike.textContent = Math.round(data.main.feels_like);
        pressure.textContent = data.main.pressure;
        visibility.textContent = (data.visibility / 1000).toFixed(1);
        sunrise.textContent = formatTime(data.sys.sunrise);
        sunset.textContent = formatTime(data.sys.sunset);
        
        const iconClass = `wi wi-owm-${data.weather[0].id}`;
        weatherIcon.className = iconClass;
        
        weatherCard.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        cityInput.value = '';
        
        // Track successful search
        gtag('event', 'weather_search_success', {
            'event_category': 'Weather',
            'event_label': data.name
        });
    } catch (error) {
        showError('Error displaying weather data');
    }
}

function showError(message) {
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
}

function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Track search button click
    gtag('event', 'search_button_click', {
        'event_category': 'Weather',
        'event_label': city
    });
    
    getWeatherData(city).then(weatherData => {
        if (weatherData) updateWeatherUI(weatherData);
    });
}

searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

cityInput.addEventListener('input', () => {
    errorMessage.classList.add('hidden');
});