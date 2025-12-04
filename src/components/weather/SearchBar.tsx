import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { City } from '@/types/weather';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSelectCity: (city: City) => void;
  searchCities: (query: string) => Promise<City[]>;
  onGetLocation: () => void;
}

export const SearchBar = ({ 
  onSearch, 
  onSelectCity, 
  searchCities, 
  onGetLocation 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, searchCities]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (city: City) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div 
          className={`
            glass-card rounded-2xl transition-all duration-300
            ${isFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''}
          `}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-foreground placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button
              type="button"
              onClick={onGetLocation}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              title="Use my location"
            >
              <MapPin className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50"
          >
            {suggestions.map((city, index) => (
              <motion.button
                key={`${city.name}-${city.country}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{city.name}</span>
                <span className="text-muted-foreground text-sm">{city.country}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
