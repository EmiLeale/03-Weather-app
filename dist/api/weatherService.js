// src/api/weatherService.ts
/**
 * Realiza una solicitud GET a la API de 7timer para obtener datos meteorológicos.
 *
 * @param lon Longitud de la ubicación (ej: -60)
 * @param lat Latitud de la ubicación (ej: -32.92945)
 * @param unit Unidad de temperatura (ej: "metric" para Celsius). Por defecto es 'metric'.
 * @returns Una promesa que se resuelve con los datos meteorológicos tipados.
 * @throws {Error} Si la respuesta de la red no es exitosa o si hay un problema al parsear los datos.
 */
export async function fetchWeatherData(lon, lat, unit = 'metric') {
    const baseUrl = 'https://www.7timer.info/bin/civil.php';
    const params = new URLSearchParams({
        lon: lon.toString(),
        lat: lat.toString(),
        unit: unit,
        product: 'civil',
        output: 'json'
    });
    const apiUrl = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}
