// src/app.ts
import { getCombinedWeatherDataForLocation } from './api/dataFetcher.js';
// 1. Definir las coordenadas de Rosario como una constante
const ROSARIO_COORDINATES = {
    latitude: -32.94682,
    longitude: -60.63932,
    name: "Rosario",
    timezone: "America/Argentina/Buenos_Aires"
};
// --- FUNCIÓN MOCK DE GEOCODIFICACIÓN ---
// En un proyecto real, esto sería una llamada a una API de geocodificación (ej. OpenStreetMap Nominatim, Google Geocoding API).
// Por ahora, simula que "Rosario" es la única ciudad que encuentra.
async function mockGeocodingApi(cityName) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula demora de red
    const lowerCaseCityName = cityName.toLowerCase();
    if (lowerCaseCityName.includes("rosario")) {
        return ROSARIO_COORDINATES;
    }
    else if (lowerCaseCityName.includes("buenos aires") || lowerCaseCityName.includes("baires")) {
        return { latitude: -34.6037, longitude: -58.3816, name: "Buenos Aires, Argentina", timezone: "America/Argentina/Buenos_Aires" };
    }
    // Si en el futuro agregas más ciudades, asegúrate de que también tengan una zona horaria válida.
    return null; // Si no encuentra la ciudad
}
// --- FIN FUNCIÓN MOCK ---
/**
 * Busca una ciudad por su nombre y muestra los datos del clima,
 * usando Rosario como fallback si la búsqueda falla o está vacía.
 *
 * @param cityName El nombre de la ciudad a buscar. Si es nulo o vacío, usará Rosario.
 */
async function searchCityAndDisplayWeather(cityName) {
    let lat;
    let lon;
    let displayedCityName;
    try {
        let cityFound = false;
        if (cityName && cityName.trim() !== '') {
            // Intenta buscar la ciudad ingresada por el usuario
            const geoResult = await mockGeocodingApi(cityName.trim()); // Usamos el mock por ahora
            if (geoResult) {
                lat = geoResult.latitude;
                lon = geoResult.longitude;
                displayedCityName = geoResult.name;
                cityFound = true;
            }
            else {
                console.warn(`Ciudad "${cityName}" no encontrada. Usando Rosario como predeterminada.`);
            }
        }
        // Si la ciudad no se encontró (o si cityName estaba vacío/nulo), usa Rosario
        if (!cityFound) {
            lat = ROSARIO_COORDINATES.latitude;
            lon = ROSARIO_COORDINATES.longitude;
            displayedCityName = ROSARIO_COORDINATES.name;
        }
        // Obtener los datos del clima para la ubicación determinada
        const combinedData = await getCombinedWeatherDataForLocation(lat, lon);
        console.log(`Datos combinados del clima para ${displayedCityName}:`, combinedData);
        // --- Actualizar la UI con los nuevos datos ---
        const weatherDisplay = document.getElementById('weather-display');
        if (weatherDisplay) {
            weatherDisplay.innerHTML = `
                <h2>Clima en ${displayedCityName}</h2>
                <p>Temperatura: ${combinedData.weatherData.dataseries[0].temp2m}°C</p>
                <p>Condición: ${combinedData.weatherData.dataseries[0].weather}</p>
                <p>Amanecer: ${combinedData.sunriseSunsetData.results.sunrise}</p>
                <p>Atardecer: ${combinedData.sunriseSunsetData.results.sunset}</p>
                <p>Es de día: ${combinedData.isDaytime ? 'Sí' : 'No'}</p>
            `;
        }
        // Lógica para aplicar el tema basada en isDaytime y la condición del clima
        let themeClass = '';
        const weatherCondition = combinedData.weatherData.dataseries[0].weather; // Ej: 'clear', 'cloudy', 'rain'
        const isDaytime = combinedData.isDaytime; // Ya calculado con la hora del lugar
        if (isDaytime) {
            // Lógica de temas para el día
            if (weatherCondition === 'clear') {
                themeClass = 'theme-day-clear';
            }
            else if (weatherCondition.includes('cloud') || weatherCondition === 'fog') {
                themeClass = 'theme-day-cloudy';
            }
            else if (weatherCondition.includes('rain') || weatherCondition.includes('snow') || weatherCondition.includes('storm')) {
                themeClass = 'theme-day-rainy';
            }
            else {
                // Fallback para cualquier otra condición diurna si no coincide explícitamente
                themeClass = 'theme-day-clear';
            }
        }
        else { // Es de noche
            // Lógica de temas para la noche
            if (weatherCondition === 'clear') {
                themeClass = 'theme-night-clear';
            }
            else {
                // Todas las demás condiciones nocturnas (nublado, lluvia, nieve, etc.)
                themeClass = 'theme-night-cloudy-rainy';
            }
        }

        // Opcional: Considerar Atardecer/Amanecer como un tema separado si el momento es cercano
        // Puedes añadir una lógica aquí para un tema de 'transición' si lo necesitas.
        // Esto es más complejo y requeriría comparar la hora actual con sunrise/sunset de forma más granular.
        // Por ejemplo:
        // if (isTimeCloseToSunriseOrSunset(currentCityTime, combinedData.sunriseSunsetData)) {
        //     themeClass = 'theme-sunset-sunrise';
        // }
        // Elimina clases de tema anteriores y añade la nueva al body
        document.body.className = ''; // Limpia todas las clases existentes
        document.body.classList.add(themeClass);
    }
    catch (error) {
        console.error("Error al buscar ciudad o cargar datos:", error);
        alert(`No se pudo encontrar la ciudad o cargar los datos: ${error instanceof Error ? error.message : "Error desconocido."}`);
    }
}
// Llama a la función de búsqueda al inicio con null para que active el fallback a Rosario
document.addEventListener('DOMContentLoaded', () => {
    searchCityAndDisplayWeather(null); // Esto cargará Rosario por defecto
});
// --- Lógica para el buscador de ciudades (interacción del usuario) ---
// Asume que tienes un input con id="city-input" y un botón con id="search-button" en tu index.html
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    if (searchButton && cityInput) {
        searchButton.addEventListener('click', () => {
            searchCityAndDisplayWeather(cityInput.value);
        });
        // Opcional: También permite buscar presionando Enter en el input
        cityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchCityAndDisplayWeather(cityInput.value);
            }
        });
    }
});
