import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rossa_token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('rossa_token'); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('rossa_token', token);
    localStorage.setItem('rossa_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('rossa_token');
    localStorage.removeItem('rossa_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
