import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../constants';

interface User {
  _id: string;
  fullName: string;
  email: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, phone?: string, studentPhone?: string, parentPhone?: string) => Promise<void>;
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

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setUser({ ...response.data, token });
        setIsAuthenticated(true);
      } else {
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
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      await fetchUserData(data.token);
      toast.success('ورود با موفقیت انجام شد');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role?: string, 
    phone?: string,
    studentPhone?: string,
    parentPhone?: string
  ) => {
    try {
      let phoneToSend = phone;
      if (role === 'student') {
        if (studentPhone) {
          phoneToSend = studentPhone;
        } else if (parentPhone) {
          phoneToSend = parentPhone;
        } else {
          throw new Error('حداقل یکی از شماره‌های دانش‌آموز یا والد باید وارد شود');
        }
      }
      // اعتبارسنجی اولیه
      if (!name || !email || !password || !phoneToSend) {
        throw new Error('لطفاً تمام فیلدها را پر کنید');
      }

      // اعتبارسنجی ایمیل
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('فرمت ایمیل نامعتبر است');
      }

      // اعتبارسنجی رمز عبور
      if (password.length < 6) {
        throw new Error('رمز عبور باید حداقل 6 کاراکتر باشد');
      }

      // اعتبارسنجی شماره تماس
      const phoneRegex = /^09[0-9]{9}$/;
      if (!phoneRegex.test(phoneToSend)) {
        throw new Error('فرمت شماره تماس نامعتبر است');
      }

      // اعتبارسنجی فیلدهای دانش‌آموز (اگر وارد شده باشند)
      if (studentPhone && !phoneRegex.test(studentPhone)) {
        throw new Error('فرمت شماره تلفن دانش‌آموز نامعتبر است');
      }
      if (parentPhone && !phoneRegex.test(parentPhone)) {
        throw new Error('فرمت شماره تلفن والد نامعتبر است');
      }

      const payload = {
        fullName: name,
        email,
        password,
        phone: phoneToSend,
        role: role || 'user',
        studentPhone: studentPhone || undefined,
        parentPhone: parentPhone || undefined
      };

      console.log('Sending register request with payload:', { ...payload, password: '***' });

      const response = await axios.post(`${API_URL}/api/auth/register`, payload);
      console.log('Register response:', response.data);

      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('پاسخ نامعتبر از سرور');
      }

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('ثبت‌نام با موفقیت انجام شد');
    } catch (error: any) {
      console.error('Register error:', error);
      
      let errorMessage = 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('خروج با موفقیت انجام شد');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 