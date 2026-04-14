import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = { email: 'admin@shop.com', password: 'admin123' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    // Admin check
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = { id: 0, email, name: 'Admin', role: 'admin', token: 'admin-token' };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return adminUser;
    }
    // Regular user via FakeStoreAPI
    const res = await fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'mor_2314', password: '83r5^_' }) // demo creds
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    const loggedUser = { id: 1, email, name: email.split('@')[0], role: 'user', token: data.token };
    setUser(loggedUser);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = (name, email) => {
    const newUser = { id: Date.now(), name, email, role: 'user', token: 'token-' + Date.now() };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);