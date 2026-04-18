import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  const getKey = () => `favorites_${user?.id || 'guest'}`;

  const [favorites, setFavorites] = useState(() => {
    const key = `favorites_${JSON.parse(localStorage.getItem('user') || 'null')?.id || 'guest'}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem(getKey());
    setFavorites(saved ? JSON.parse(saved) : []);
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(getKey(), JSON.stringify(favorites));
  }, [favorites, user?.id]);

  const toggle = (product) => {
    setFavorites(prev =>
      prev.find(f => f.id === product.id)
        ? prev.filter(f => f.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavorite = (id) => favorites.some(f => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);