"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // بررسی توکن در localStorage هنگام بارگذاری
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 