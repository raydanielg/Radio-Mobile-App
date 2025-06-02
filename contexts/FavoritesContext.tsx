import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RadioStation } from '@/api/radioApi';

interface FavoritesContextType {
  favorites: RadioStation[];
  addFavorite: (station: RadioStation) => void;
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
  toggleFavorite: (station: RadioStation) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);

  // In a real app, we would load this from AsyncStorage
  useEffect(() => {
    // Mock loading from storage
    const loadFavorites = async () => {
      // This would be replaced with actual AsyncStorage load
      const savedFavorites: RadioStation[] = [];
      setFavorites(savedFavorites);
    };
    
    loadFavorites();
  }, []);

  // Save favorites when changed
  useEffect(() => {
    // This would save to AsyncStorage in a real app
    const saveFavorites = async () => {
      // Mock saving to storage
      console.log('Saved favorites:', favorites);
    };
    
    if (favorites.length > 0) {
      saveFavorites();
    }
  }, [favorites]);

  const addFavorite = (station: RadioStation) => {
    setFavorites(prev => {
      if (prev.some(s => s.stationuuid === station.stationuuid)) {
        return prev;
      }
      return [...prev, station];
    });
  };

  const removeFavorite = (stationId: string) => {
    setFavorites(prev => prev.filter(s => s.stationuuid !== stationId));
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(s => s.stationuuid === stationId);
  };

  const toggleFavorite = (station: RadioStation) => {
    if (isFavorite(station.stationuuid)) {
      removeFavorite(station.stationuuid);
    } else {
      addFavorite(station);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};