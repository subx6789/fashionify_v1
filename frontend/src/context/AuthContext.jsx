import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // TODO:
      // Call GET /api/auth/me
      // If successful: setUser(response.data)
      // If it fails: setUser(null)
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    // TODO:
    // 1. Call POST /api/auth/login with { email, password }.
    // 2. Backend will create session.
    // 3. Save returned user object in state using setUser(res.data).
    // 4. Return res.data for navigation logic.
  };

  const register = async (name, email, password) => {
    // TODO:
    // 1. Call POST /api/auth/register with { name, email, password }.
    // 2. After successful registration, redirect to login page.
  };

  const logout = async () => {
    // TODO:
    // 1. Call POST /api/auth/logout.
    // 2. Clear user state using setUser(null).
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
