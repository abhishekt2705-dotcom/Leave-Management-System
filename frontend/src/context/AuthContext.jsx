import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const defaultAuthContext = {
  user: null,
  login: async () => ({ success: false, message: 'Auth not initialized' }),
  logout: () => {},
  loading: false,
  isAuthenticated: false,
};

const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('leave_app_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const userData = {
        employeeId: data.employeeId,
        role: data.role,
        name: data.name,
        email: data.email,
        employeeCode: data.employeeCode,
        department: data.department,
      };
      setUser(userData);
      localStorage.setItem('leave_app_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.customMessage || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('leave_app_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
};
