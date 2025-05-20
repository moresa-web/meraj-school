import { useState } from 'react';
import axios from 'axios';
import { Class } from '@/types/class';

export function useClass() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/classes');
      return response.data.data;
    } catch (err) {
      setError('خطا در دریافت اطلاعات کلاس‌ها');
      console.error('Error fetching classes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, data: Partial<Class>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`/api/classes/${id}`, data);
      return response.data;
    } catch (err) {
      setError('خطا در ویرایش کلاس');
      console.error('Error updating class:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchClass,
    updateClass
  };
} 