import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';

interface SunTimesProps {
  sunrise: number;
  sunset: number;
  timezone: number;
}

export const SunTimes = ({ sunrise, sunset, timezone }: SunTimesProps) => {
  const formatTime = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  };

  const now = Date.now() / 1000;
  const dayLength = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(now - sunrise, dayLength));
  const progress = (elapsed / dayLength) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-3xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Sun Schedule</h3>
      
      {/* Sun Arc */}
      <div className="relative h-24 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 90 Q 100 10 190 90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 90 Q 100 10 190 90"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="280"
            strokeDashoffset={280 - (280 * progress) / 100}
            className="transition-all duration-1000"
          />
          {/* Sun indicator */}
          <motion.circle
            cx={10 + (progress / 100) * 180}
            cy={90 - Math.sin((progress / 100) * Math.PI) * 80}
            r="8"
            fill="hsl(var(--sunny))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          />
        </svg>
      </div>

      {/* Times */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sunrise className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">Sunrise</p>
            <p className="font-semibold">{formatTime(sunrise)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Sunset</p>
            <p className="font-semibold">{formatTime(sunset)}</p>
          </div>
          <Sunset className="w-5 h-5 text-orange-500" />
        </div>
      </div>
    </motion.div>
  );
};
