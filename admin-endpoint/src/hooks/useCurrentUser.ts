import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from './useUsers';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<User>('/api/auth/me');
        setUser(response.data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات کاربر');
        console.error('Error fetching current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading, error };
} 