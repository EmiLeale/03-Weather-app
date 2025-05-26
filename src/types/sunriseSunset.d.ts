// src/types/sunrisesunset.d.ts

/*
 * Representa los datos de un único resultado de amanecer y atardecer.
 */
export interface SunriseSunsetResult {
    sunrise: string;            // Hora de salida del sol (ej: "5:49:09 AM")
    sunset: string;             // Hora de puesta del sol (ej: "7:04:10 PM")
    first_light: string;        // Inicio del crepúsculo civil de la mañana (ej: "5:20:13 AM")
    last_light: string;         // Fin del crepúsculo civil de la tarde (ej: "7:33:06 PM")
    dawn: string;               // Inicio del crepúsculo náutico de la mañana (ej: "5:20:13 AM")
    dusk: string;               // Fin del crepúsculo náutico de la tarde (ej: "7:33:06 PM")
    solar_noon: string;         // Mediodía solar (ej: "12:26:39 PM")
    golden_hour: string;        // Inicio de la hora dorada (ej: "6:24:00 PM")
    timezone: string;           // Zona horaria de la ubicación (ej: "America/Rosario")
    day_length: string;         // Duración del día (ej: "13:15:01")
}

/*
 * Representa la estructura de la respuesta exitosa de la API de SunriseSunset.
 */
export interface SunriseSunsetApiResponse {
    results: SunriseSunsetResult; // Objeto que contiene los datos de amanecer y atardecer.
    status: string;               // Estado de la respuesta (ej: "OK").
}

/*
 * Representa la estructura de la respuesta de error de la API de SunriseSunset (si aplica).
 * Aunque la documentación no muestra un formato de error explícito, es una buena práctica considerarlo.
 */
export interface SunriseSunsetErrorResponse {
    status: string; // Estado de la respuesta (ej: "INVALID_REQUEST", "ZERO_RESULTS").
    error?: string; // Mensaje de error, si lo hay.
}

