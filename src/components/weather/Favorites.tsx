import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { City } from '@/types/weather';

interface FavoritesProps {
  favorites: City[];
  onSelect: (city: City) => void;
  onRemove: (city: City) => void;
}

export const Favorites = ({ favorites, onSelect, onRemove }: FavoritesProps) => {
  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <h3 className="text-lg font-semibold">Favorite Cities</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {favorites.map((city) => (
            <motion.div
              key={`${city.name}-${city.country}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative"
            >
              <button
                onClick={() => onSelect(city)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors pr-8"
              >
                {city.name}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(city);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
