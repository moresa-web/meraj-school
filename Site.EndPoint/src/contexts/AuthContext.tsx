import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

// تعریف API URL با مقدار پیش‌فرض
const API_URL = 'http://localhost:5000/api';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async (token: string) => {
    try {
      console.log('Fetching user data with token:', token);
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('User data response:', response.data);
      
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        console.log('User authenticated successfully:', response.data);
      } else {
        console.log('No user data received');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token);
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      console.log('API URL for login:', `${API_URL}/auth/login`);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);

      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('ورود با موفقیت انجام شد');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'خطا در ورود. لطفاً دوباره تلاش کنید.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('ثبت‌نام با موفقیت انجام شد');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 