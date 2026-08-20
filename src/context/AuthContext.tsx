import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('amm_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid token');
        localStorage.removeItem('amm_admin_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem('amm_admin_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('amm_admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
