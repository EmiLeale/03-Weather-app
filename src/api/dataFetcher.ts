// src/api/dataFetcher.ts

import { fetchWeatherData } from './weatherService';
import { fetchSunriseSunsetData } from './sunriseSunsetService';
import { fetchWorldTimeData } from './worldTimeService'; 

import { WeatherApiResponse } from '../types/weather';
import { SunriseSunsetApiResponse } from '../types/sunriseSunset';
import { WorldTimeApiResponse } from '../types/worldTimeApi';

/*
 * Interfaz para los datos combinados.
 */
export interface CombinedWeatherData {
    weatherData: WeatherApiResponse;
    sunriseSunsetData: SunriseSunsetApiResponse;
    worldTimeData?: WorldTimeApiResponse;
    isDaytime: boolean;
}

/**
 * Determina si una hora específica está entre el amanecer y el atardecer.
 * ¡Ahora usa un objeto Date que ya está en la zona horaria correcta!
 *
 * @param currentTimeObj Objeto Date que representa la hora actual en la zona horaria del lugar.
 * @param sunriseString Hora de amanecer en formato de cadena (ej: "5:49:09 AM").
 * @param sunsetString Hora de atardecer en formato de cadena (ej: "7:04:10 PM").
 * @returns True si la hora actual está entre el amanecer y atardecer.
 */
function isCurrentTimeBetween(
    currentTimeObj: Date,
    sunriseString: string,
    sunsetString: string
): boolean {
    try {
        const currentMinutes = currentTimeObj.getHours() * 60 + currentTimeObj.getMinutes();

        const parseTimeStringToMinutes = (timeStr: string): number | null => {
            if (timeStr === "No Data" || !timeStr) return null;
            const parts = timeStr.match(/(\d+):(\d+):(\d+)\s(AM|PM)/);
            if (!parts) return null;

            let hours = parseInt(parts[1], 10);
            const minutes = parseInt(parts[2], 10);
            const ampm = parts[4];

            if (ampm === "PM" && hours !== 12) {
                hours += 12;
            } else if (ampm === "AM" && hours === 12) {
                hours = 0; // Midnight (12 AM) is 0 hours
            }
            return hours * 60 + minutes;
        };

        const sunriseMinutes = parseTimeStringToMinutes(sunriseString);
        const sunsetMinutes = parseTimeStringToMinutes(sunsetString);

        if (sunriseMinutes === null || sunsetMinutes === null) {
            console.warn("Could not parse sunrise/sunset times for day/night calculation.");
            return false;
        }

        if (sunsetMinutes >= sunriseMinutes) {
            return currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes;
        } else {
            return currentMinutes >= sunriseMinutes || currentMinutes <= sunsetMinutes;
        }

    } catch (e) {
        console.error("Error determining day/night status:", e);
        return false;
    }
}

/**
 * Obtiene todos los datos meteorológicos necesarios para una ubicación dada (latitud y longitud).
 * Orquesta las llamadas a múltiples APIs y combina sus resultados. También determina si es de día o de noche
 * usando la hora actual de la ciudad consultada.
 *
 * @param lat Latitud de la ubicación.
 * @param lon Longitud de la ubicación.
 * @param unit Unidad de temperatura para los datos del clima (ej: 'metric').
 * @returns Una promesa que resuelve con un objeto CombinedWeatherData.
 * @throws {Error} Si alguna de las llamadas a la API falla.
 */
export async function getCombinedWeatherDataForLocation(
    lat: number,
    lon: number,
    unit: string = 'metric'
): Promise<CombinedWeatherData> {
    try {
        const [weatherData, sunriseSunsetData] = await Promise.all([
            fetchWeatherData(lon, lat, unit),
            fetchSunriseSunsetData(lat, lon)
        ]);

        let worldTimeData: WorldTimeApiResponse | undefined;
        let isDaytime = false;

        try {
            if (sunriseSunsetData.results.timezone) {
                worldTimeData = await fetchWorldTimeData(sunriseSunsetData.results.timezone);
                const currentCityTime = new Date(worldTimeData.datetime);

                isDaytime = isCurrentTimeBetween(
                    currentCityTime,
                    sunriseSunsetData.results.sunrise,
                    sunriseSunsetData.results.sunset
                );
            } else {
                console.warn("No timezone information available from SunriseSunset API. Cannot determine isDaytime accurately.");
            }
        } catch (timeError) {
            console.error("Failed to fetch world time for accurate day/night calculation:", timeError);
            isDaytime = false;
        }


        return {
            weatherData,
            sunriseSunsetData,
            worldTimeData,
            isDaytime,
        };

    } catch (error) {
        console.error("Error al obtener datos combinados del clima para la ubicación:", error);
        throw error;
    }
}