import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log('ProtectedRoute state:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  // اگر توکن وجود دارد اما هنوز اطلاعات کاربر دریافت نشده، صبر می‌کنیم
  if (localStorage.getItem('token') && !user) {
    console.log('Token exists but user data not loaded yet');
    return null; // یا می‌توانید یک loading spinner نمایش دهید
  }

  if (!isAuthenticated || !user) {
    console.log('Not authenticated or no user data, redirecting to login');
    return <Navigate to="/auth" />;
  }

  if (user.role !== 'admin') {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 