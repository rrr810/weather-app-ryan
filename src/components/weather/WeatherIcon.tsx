import { motion } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle,
  CloudFog,
  Moon,
  CloudSun,
  CloudMoon
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const WeatherIcon = ({ icon, size = 64, className = '' }: WeatherIconProps) => {
  const isNight = icon.includes('n');
  
  const getIcon = () => {
    const code = icon.slice(0, 2);
    const iconProps = { size, className: `${className}` };
    
    switch (code) {
      case '01':
        return isNight ? (
          <Moon {...iconProps} className={`${className} text-yellow-200`} />
        ) : (
          <Sun {...iconProps} className={`${className} text-weather-sunny`} />
        );
      case '02':
        return isNight ? (
          <CloudMoon {...iconProps} className={`${className} text-muted-foreground`} />
        ) : (
          <CloudSun {...iconProps} className={`${className} text-weather-sunny`} />
        );
      case '03':
      case '04':
        return <Cloud {...iconProps} className={`${className} text-weather-cloudy`} />;
      case '09':
        return <CloudDrizzle {...iconProps} className={`${className} text-weather-rainy`} />;
      case '10':
        return <CloudRain {...iconProps} className={`${className} text-weather-rainy`} />;
      case '11':
        return <CloudLightning {...iconProps} className={`${className} text-yellow-500`} />;
      case '13':
        return <CloudSnow {...iconProps} className={`${className} text-blue-200`} />;
      case '50':
        return <CloudFog {...iconProps} className={`${className} text-muted-foreground`} />;
      default:
        return <Sun {...iconProps} className={`${className} text-weather-sunny`} />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="animate-float"
    >
      {getIcon()}
    </motion.div>
  );
};
