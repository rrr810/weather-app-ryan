export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
}

export interface ForecastDay {
  date: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
