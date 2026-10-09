import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on app initialization / reload
  const fetchUser = async () => {
    try {
      const response = await API.get('/customers/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    await API.post('/customers/login', { email, password });
    await fetchUser(); // Refresh user state after setting the cookie
  };

  const logout = async () => {
    await API.post('/customers/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};