import { createContext, useContext, useState, useEffect } from 'react';

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [myItems, setMyItems] = useState(() => {
    const saved = localStorage.getItem('myItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myItems', JSON.stringify(myItems));
  }, [myItems]);

  const addItem = (item) => {
    setMyItems(prev => [{ ...item, id: `custom_${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
  };

  const updateItem = (id, updates) => {
    setMyItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteItem = (id) => {
    setMyItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <ItemsContext.Provider value={{ myItems, addItem, updateItem, deleteItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export const useItems = () => useContext(ItemsContext);