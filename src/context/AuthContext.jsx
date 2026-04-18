import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USERS_DB_KEY = 'shopflow_users';

function getUsersDB() {
  const saved = localStorage.getItem(USERS_DB_KEY);
  return saved ? JSON.parse(saved) : [
    { id: 0, email: 'admin@shop.com', password: 'admin123', name: 'Admin', role: 'admin' }
  ];
}

function saveUsersDB(users) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const users = getUsersDB();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = (name, email, password) => {
    const users = getUsersDB();
    if (users.find(u => u.email === email)) throw new Error('Email already exists');
    const newUser = { id: Date.now(), name, email, password, role: 'user' };
    saveUsersDB([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
    return safeUser;
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    // sync to DB
    const users = getUsersDB();
    saveUsersDB(users.map(u => u.id === updated.id ? { ...u, ...updates } : u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isAdmin: user?.role === 'admin',
      isOwner: (ownerId) => user && (user.role === 'admin' || user.id === ownerId),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);