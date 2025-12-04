import { useState, useCallback } from 'react';
import { WeatherData, ForecastDay, City } from '@/types/weather';

// Demo API key - users should replace with their own
const API_KEY = 'demo';

// Mock data for demo purposes
const mockWeatherData: WeatherData = {
  city: "San Francisco",
  country: "US",
  temperature: 18,
  feelsLike: 16,
  condition: "Clouds",
  description: "Partly cloudy",
  humidity: 72,
  windSpeed: 12,
  icon: "03d",
  sunrise: Date.now() / 1000 - 21600,
  sunset: Date.now() / 1000 + 21600,
  timezone: -28800,
  dt: Date.now() / 1000,
};

const mockForecast: ForecastDay[] = [
  { date: Date.now() / 1000 + 86400, tempMin: 14, tempMax: 20, condition: "Clear", icon: "01d" },
  { date: Date.now() / 1000 + 172800, tempMin: 15, tempMax: 22, condition: "Clouds", icon: "02d" },
  { date: Date.now() / 1000 + 259200, tempMin: 13, tempMax: 19, condition: "Rain", icon: "10d" },
  { date: Date.now() / 1000 + 345600, tempMin: 12, tempMax: 18, condition: "Rain", icon: "09d" },
  { date: Date.now() / 1000 + 432000, tempMin: 14, tempMax: 21, condition: "Clear", icon: "01d" },
];

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try real API first
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('API error');
      }
      
      const weatherData = await weatherResponse.json();
      
      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6),
        icon: weatherData.weather[0].icon,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        timezone: weatherData.timezone,
        dt: weatherData.dt,
      });
      
      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const dailyForecast: ForecastDay[] = [];
        const seenDates = new Set<string>();
        
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!seenDates.has(date) && dailyForecast.length < 5) {
            seenDates.add(date);
            dailyForecast.push({
              date: item.dt,
              tempMin: Math.round(item.main.temp_min),
              tempMax: Math.round(item.main.temp_max),
              condition: item.weather[0].main,
              icon: item.weather[0].icon,
            });
          }
        });
        
        setForecast(dailyForecast);
      }
    } catch (err) {
      // Fall back to mock data for demo
      console.log('Using demo data - add your OpenWeatherMap API key for live data');
      setWeather({
        ...mockWeatherData,
        city: "Demo City",
      });
      setForecast(mockForecast);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.ok) {
        throw new Error('City not found');
      }
      
      const geoData = await geoResponse.json();
      
      if (geoData.length === 0) {
        throw new Error('City not found');
      }
      
      await fetchWeather(geoData[0].lat, geoData[0].lon);
    } catch (err) {
      // Demo fallback
      const mockCityData = { ...mockWeatherData, city };
      setWeather(mockCityData);
      setForecast(mockForecast);
      setLoading(false);
    }
  }, [fetchWeather]);

  const searchCities = useCallback(async (query: string): Promise<City[]> => {
    if (query.length < 2) return [];
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        return [];
      }
      
      const data = await response.json();
      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch {
      // Demo suggestions
      return [
        { name: query, country: "US", lat: 37.77, lon: -122.42 },
      ];
    }
  }, []);

  return {
    weather,
    forecast,
    loading,
    error,
    fetchWeather,
    fetchWeatherByCity,
    searchCities,
  };
};
