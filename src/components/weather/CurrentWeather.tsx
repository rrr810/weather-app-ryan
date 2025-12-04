import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Heart } from 'lucide-react';
import { WeatherData, City } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeather = ({ 
  weather, 
  isFavorite, 
  onToggleFavorite 
}: CurrentWeatherProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      {/* Location */}
      <div className="flex items-center justify-center gap-2">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {weather.city}, {weather.country}
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleFavorite}
          className="p-2 rounded-full hover:bg-secondary/30 transition-colors"
        >
          <Heart 
            className={`w-6 h-6 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`} 
          />
        </motion.button>
      </div>

      {/* Main Temperature & Icon */}
      <div className="flex flex-col items-center gap-4">
        <WeatherIcon icon={weather.icon} size={120} />
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-8xl md:text-9xl font-light text-shadow"
        >
          {weather.temperature}°
        </motion.div>
        
        <p className="text-xl md:text-2xl capitalize text-muted-foreground">
          {weather.description}
        </p>
      </div>

      {/* Weather Details Grid */}
      <motion.div 
        className="grid grid-cols-3 gap-4 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-card rounded-2xl p-4 text-center">
          <Thermometer className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Feels like</p>
          <p className="text-xl font-semibold">{weather.feelsLike}°</p>
        </div>
        
        <div className="glass-card rounded-2xl p-4 text-center">
          <Droplets className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-sm text-muted-foreground">Humidity</p>
          <p className="text-xl font-semibold">{weather.humidity}%</p>
        </div>
        
        <div className="glass-card rounded-2xl p-4 text-center">
          <Wind className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Wind</p>
          <p className="text-xl font-semibold">{weather.windSpeed} km/h</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
