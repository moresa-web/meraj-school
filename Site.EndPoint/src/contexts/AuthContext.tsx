import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../constants';
import type { User } from '../types/index';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, phone: string, studentPhone?: string, parentPhone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      // Check if response has token and user data
      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        toast.success('ورود موفقیت‌آمیز');
      } else {
        throw new Error('پاسخ نامعتبر از سرور');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'خطا در ورود';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string, role: string, phone: string, studentPhone?: string, parentPhone?: string) => {
    try {
      const payload: any = {
        fullName: name,
        email,
        password,
        role,
        phone
      };

      if (role === 'student') {
        payload.studentPhone = studentPhone;
        payload.parentPhone = parentPhone;
      }

      const response = await axios.post(`${API_URL}/api/auth/register`, payload);

      // Check if response has success field or token and user data
      if (response.data.success || (response.data.token && response.data.user)) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        toast.success('ثبت‌نام با موفقیت انجام شد');
      } else {
        throw new Error(response.data.message || 'خطا در ثبت‌نام');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'خطا در ثبت‌نام';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('خروج موفقیت‌آمیز');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 