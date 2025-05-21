import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Class, ClassFormData } from '@/types/class';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// کلیدهای query برای React Query
export const classKeys = {
  all: ['classes'] as const,
  lists: () => [...classKeys.all, 'list'] as const,
  list: (filters: string) => [...classKeys.lists(), { filters }] as const,
  details: () => [...classKeys.all, 'detail'] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
};

export function useClasses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // دریافت لیست کلاس‌ها
  const { data: classes = [], isLoading, error: queryError } = useQuery<Class[], Error>({
    queryKey: classKeys.lists(),
    queryFn: async () => {
      const response = await axios.get('/api/classes');
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'خطا در دریافت لیست کلاس‌ها');
    },
  });

  // دریافت یک کلاس
  const getClassById = (id: string) => {
    return useQuery({
      queryKey: ['class', id],
      queryFn: async () => {
        const response = await axios.get(`/api/classes/${id}`);
        if (response.data.success && response.data.data) {
          return response.data.data;
        }
        throw new Error(response.data.message || 'خطا در دریافت اطلاعات کلاس');
      },
    });
  };

  // ایجاد کلاس جدید
  const createClass = useMutation<Class, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post('/api/classes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'خطا در ایجاد کلاس');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success('کلاس با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      console.error('Error creating class:', error);
      toast.error(error.message || 'خطا در ایجاد کلاس');
    },
  });

  // ویرایش کلاس
  const updateClass = async (id: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/classes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success && response.data.data) {
        toast.success('کلاس با موفقیت به‌روزرسانی شد');
        queryClient.invalidateQueries({ queryKey: ['class', id] });
        return response.data.data;
      }
      throw new Error(response.data.message || 'خطا در به‌روزرسانی کلاس');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در به‌روزرسانی کلاس';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف کلاس
  const deleteClass = useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/classes/${id}`);
      if (response.data.success) {
        return true;
      }
      throw new Error(response.data.message || 'خطا در حذف کلاس');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success('کلاس با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      console.error('Error deleting class:', error);
      toast.error(error.message || 'خطا در حذف کلاس');
    },
  });

  return {
    classes,
    isLoading,
    queryError,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    loading,
    error,
  };
} 