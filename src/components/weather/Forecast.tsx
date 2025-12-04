import { motion } from 'framer-motion';
import { ForecastDay } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface ForecastProps {
  forecast: ForecastDay[];
}

export const Forecast = ({ forecast }: ForecastProps) => {
  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-3xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
          >
            <span className="font-medium w-24">{getDayName(day.date)}</span>
            
            <div className="flex items-center gap-2">
              <WeatherIcon icon={day.icon} size={32} />
              <span className="text-sm text-muted-foreground w-16">
                {day.condition}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold">{day.tempMax}°</span>
              <span className="text-muted-foreground">{day.tempMin}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
