// src/api/sunriseSunsetService.ts
/**
 * Realiza una solicitud GET a la API de SunriseSunset.io para obtener datos de amanecer y atardecer.
 *
 * @param lat Latitud de la ubicación.
 * @param lng Longitud de la ubicación.
 * @returns Una promesa que se resuelve con los datos de amanecer y atardecer tipados.
 * @throws {Error} Si la respuesta de la red no es exitosa, si la API devuelve un estado de error,
 * o si hay un problema al parsear los datos.
 */
export async function fetchSunriseSunsetData(lat, lng) {
    const baseUrl = 'https://api.sunrisesunset.io/json';
    const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
    });
    const apiUrl = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status !== 'OK') {
            const errorData = data;
            throw new Error(`API error: ${errorData.status} - ${errorData.error || 'Unknown error'}`);
        }
        return data;
    }
    catch (error) {
        console.error("Error fetching sunrise/sunset data:", error);
        throw error;
    }
}
