import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/hooks/useTheme';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { Forecast } from '@/components/weather/Forecast';
import { SunTimes } from '@/components/weather/SunTimes';
import { Favorites } from '@/components/weather/Favorites';
import { ThemeToggle } from '@/components/weather/ThemeToggle';
import { LoadingSpinner } from '@/components/weather/LoadingSpinner';
import { City } from '@/types/weather';
import { toast } from 'sonner';

const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

const Index = () => {
  const { weather, forecast, loading, fetchWeather, fetchWeatherByCity, searchCities } = useWeather();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isDark, toggleTheme } = useTheme();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const getLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
          setLastUpdated(new Date());
          toast.success('Location detected!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Could not detect location. Showing demo data.');
          fetchWeatherByCity('San Francisco');
          setLastUpdated(new Date());
        }
      );
    } else {
      toast.error('Geolocation not supported');
      fetchWeatherByCity('San Francisco');
      setLastUpdated(new Date());
    }
  }, [fetchWeather, fetchWeatherByCity]);

  // Initial load
  useEffect(() => {
    getLocation();
  }, []);

  // Auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (weather) {
        fetchWeatherByCity(weather.city);
        setLastUpdated(new Date());
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [weather, fetchWeatherByCity]);

  const handleSearch = (city: string) => {
    fetchWeatherByCity(city);
    setLastUpdated(new Date());
  };

  const handleSelectCity = (city: City) => {
    fetchWeather(city.lat, city.lon);
    setLastUpdated(new Date());
  };

  const handleToggleFavorite = () => {
    if (!weather) return;
    const city: City = {
      name: weather.city,
      country: weather.country,
      lat: 0,
      lon: 0,
    };
    if (isFavorite(city)) {
      removeFavorite(city);
      toast.success(`${weather.city} removed from favorites`);
    } else {
      addFavorite(city);
      toast.success(`${weather.city} added to favorites`);
    }
  };

  const handleRefresh = () => {
    if (weather) {
      fetchWeatherByCity(weather.city);
      setLastUpdated(new Date());
      toast.success('Weather refreshed!');
    }
  };

  const getBackgroundClass = () => {
    if (!weather) return '';
    const hour = new Date((weather.dt + weather.timezone) * 1000).getUTCHours();
    const isNight = hour < 6 || hour > 20;
    const isSunset = hour >= 17 && hour <= 20;
    const condition = weather.condition.toLowerCase();

    if (isNight) return 'night';
    if (isSunset) return 'sunset';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
    if (condition.includes('cloud')) return 'cloudy';
    return '';
  };

  return (
    <div className={`min-h-screen weather-gradient ${getBackgroundClass()} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 glass-card rounded-full disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchBar
            onSearch={handleSearch}
            onSelectCity={handleSelectCity}
            searchCities={searchCities}
            onGetLocation={getLocation}
          />
        </motion.div>

        {/* Main Content */}
        {loading && !weather ? (
          <LoadingSpinner />
        ) : weather ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <CurrentWeather
              weather={weather}
              isFavorite={isFavorite({ name: weather.city, country: weather.country, lat: 0, lon: 0 })}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sun Times */}
              <SunTimes
                sunrise={weather.sunrise}
                sunset={weather.sunset}
                timezone={weather.timezone}
              />

              {/* Favorites */}
              <Favorites
                favorites={favorites}
                onSelect={handleSelectCity}
                onRemove={removeFavorite}
              />
            </div>

            {/* Forecast */}
            {forecast.length > 0 && <Forecast forecast={forecast} />}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Search for a city to see the weather</p>
          </div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>Weather data powered by OpenWeatherMap</p>
          <p className="text-xs mt-1">Demo mode - add your API key for live data</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
