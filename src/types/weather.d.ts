// src/types/weather.d.ts

/*
 * Representa la dirección cardinal del viento.
*/
export type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

/*
 * Representa la velocidad del viento en una escala de 1 a 8:
 * 1: Calm (Below 0.3m/s)
 * 2: Light (0.3-3.4m/s)
 * 3: Moderate (3.4-8.0m/s)
 * 4: Fresh (8.0-10.8m/s)
 * 5: Strong (10.8-17.2m/s)
 * 6: Gale (17.2-24.5m/s)
 * 7: Storm (24.5-32.6m/s)
 * 8: Hurricane (Over 32.6m/s)
 */
export type WindSpeedValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/*
 * Representa la cobertura de nubes en una escala de 1 a 9:
 * 1: 0%-6%
 * 2: 6%-19%
 * 3: 19%-31%
 * 4: 31%-44%
 * 5: 44%-56%
 * 6: 56%-69%
 * 7: 69%-81%
 * 8: 81%-94%
 * 9: 94%-100%
 */
export type CloudCoverValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/*
 * Representa el índice de elevación (estabilidad atmosférica):
 * -10: Below -7
 * -6: -7 to -5
 * -4: -5 to -3
 * -1: -3 to 0
 * 2: 0 to 4
 * 6: 4 to 8
 * 10: 8 to 11
 * 15: Over 11
 */
export type LiftedIndexValue = -10 | -6 | -4 | -1 | 2 | 6 | 10 | 15;

/*
 * Tipo de precipitación:
 * - `snow`: Nieve
 * - `rain`: Lluvia
 * - `frzr`: Lluvia helada (freezing rain)
 * - `icep`: Granizo (ice pellets)
 * - `none`: Ninguno
 */
export type PrecipitationType = 'snow' | 'rain' | 'frzr' | 'icep' | 'none';

/*
 * Cantidad de precipitación por hora en una escala de 0 a 9:
 * 0: None
 * 1: 0-0.25mm/hr
 * 2: 0.25-1mm/hr
 * 3: 1-4mm/hr
 * 4: 4-10mm/hr
 * 5: 10-16mm/hr
 * 6: 16-30mm/hr
 * 7: 30-50mm/hr
 * 8: 50-75mm/hr
 * 9: Over 75mm/hr
 */
export type PrecipitationAmountValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/*
 * Humedad relativa a 2 metros, representada como un string con el símbolo de porcentaje.
 * @example "84%"
 */
export type RelativeHumidity = string;

/*
 * Tipo de condición meteorológica, idéntico a la tabla de definición de iconos:
 * - `clearday`, `clearnight`: Total cloud cover less than 20%
 * - `pcloudyday`, `pcloudynight`: Total cloud cover between 20%-60%
 * - `mcloudyday`, `mcloudynight`: Total cloud cover between 60%-80%
 * - `cloudyday`, `cloudynight`: Total cloud cover over over 80%
 * - `humidday`, `humidnight`: Relative humidity over 90% with total cloud cover less than 60%
 * - `lightrainday`, `lightrainnight`: Precipitation rate less than 4mm/hr with total cloud cover more than 80%
 * - `oshowerday`, `oshowernight`: Precipitation rate less than 4mm/hr with total cloud cover between 60%-80%
 * - `ishowerday`, `ishowernight`: Precipitation rate less than 4mm/hr with total cloud cover less than 60%
 * - `lightsnowday`, `lightsnownight`: Precipitation rate less than 4mm/hr
 * - `rainday`, `rainnight`: Precipitation rate over 4mm/hr
 * - `snowday`, `snownight`: Precipitation rate over 4mm/hr
 * - `rainsnowday`, `rainsnownight`: Precipitation type to be ice pellets or freezing rain
 * - `tsday`, `tsnight`: Lifted Index less than -5 with precipitation rate below 4mm/hr
 * - `tsrainday`, `tsrainnight`: Lifted Index less than -5 with precipitation rate over 4mm/hr
 */
export type WeatherType =
    'clearday' | 'clearnight' |
    'pcloudyday' | 'pcloudynight' |
    'mcloudyday' | 'mcloudynight' |
    'cloudyday' | 'cloudynight' |
    'humidday' | 'humidnight' |
    'lightrainday' | 'lightrainnight' |
    'oshowerday' | 'oshowernight' |
    'ishowerday' | 'ishowernight' |
    'lightsnowday' | 'lightsnownight' |
    'rainday' | 'rainnight' |
    'snowday' | 'snownight' |
    'rainsnowday' | 'rainsnownight' |
    'tsday' | 'tsnight' |
    'tsrainday' | 'tsrainnight';


/*
 * Representa la dirección y velocidad del viento a 10 metros.
 */
export interface Wind10m {
    /* Dirección cardinal del viento. */
    direction: WindDirection;
    /* Velocidad del viento según la escala. */
    speed: WindSpeedValue;
}

/*
 * Representa los datos meteorológicos para un punto de tiempo específico.
 */
export interface Dataseries {
    /* Punto en el tiempo (en horas desde 'init'). */
    timepoint: number;
    /* Cobertura de nubes en una escala de 1 a 9. */
    cloudcover: CloudCoverValue;
    /* Índice de elevación (estabilidad atmosférica).*/
    lifted_index: LiftedIndexValue;
    /* Tipo de precipitación. */
    prec_type: PrecipitationType;
    /* Cantidad de precipitación por hora.  */
    prec_amount: PrecipitationAmountValue;
    /* Temperatura a 2 metros en grados Celsius. */
    temp2m: number;
    /* Humedad relativa a 2 metros, como un string con el símbolo de porcentaje.  */
    rh2m: RelativeHumidity;
    /* Objeto que contiene dirección y velocidad del viento a 10m.  */
    wind10m: Wind10m;
    /* Descripción del clima, idéntico a la tabla de definición de iconos.  */
    weather: WeatherType;
}

/**
 * Representa la estructura completa de la respuesta de la API de 7timer.
 */
export interface WeatherApiResponse {
    /* Tipo de producto, usualmente "civil". */
    product: string;
    /* Fecha y hora de inicialización del modelo en formato YYYYMMDDHH. */
    init: string;
    /* Array de objetos Dataseries, uno por cada punto de tiempo. */
    dataseries: Dataseries[];
}