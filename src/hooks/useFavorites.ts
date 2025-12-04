import { useState, useEffect } from 'react';
import { City } from '@/types/weather';

const STORAGE_KEY = 'weather-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<City[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (city: City) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.name === city.name && f.country === city.country
      );
      if (exists) return prev;
      const updated = [...prev, city];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (city: City) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (f) => !(f.name === city.name && f.country === city.country)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (city: City) => {
    return favorites.some(
      (f) => f.name === city.name && f.country === city.country
    );
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
