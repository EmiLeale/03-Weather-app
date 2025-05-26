// src/api/worldTimeService.ts
/**
 * Realiza una solicitud GET a World Time API para obtener la hora actual en una zona horaria específica.
 *
 * @param timezoneName El nombre de la zona horaria (ej: "America/Rosario").
 * @returns Una promesa que se resuelve con los datos de la hora mundial tipados.
 * @throws {Error} Si la respuesta de la red no es exitosa.
 */
export async function fetchWorldTimeData(timezoneName) {
    const apiUrl = `http://worldtimeapi.org/api/timezone/${timezoneName}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for timezone: ${timezoneName}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`Error fetching world time data for ${timezoneName}:`, error);
        throw error;
    }
}
