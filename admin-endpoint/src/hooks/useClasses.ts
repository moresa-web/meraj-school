import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Class } from '@/types/class';
import { toast } from 'react-hot-toast';

// کلیدهای query برای React Query
export const classKeys = {
  all: ['classes'] as const,
  lists: () => [...classKeys.all, 'list'] as const,
  list: (filters: string) => [...classKeys.lists(), { filters }] as const,
  details: () => [...classKeys.all, 'detail'] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
};

export function useClasses() {
  const queryClient = useQueryClient();

  // دریافت لیست کلاس‌ها
  const { data: classes = [], isLoading, error } = useQuery<Class[], Error>({
    queryKey: classKeys.lists(),
    queryFn: async () => {
      console.log('Fetching classes from API...');
      const response = await api.get('/api/classes');
      if (Array.isArray(response.data)) return response.data;
      if (response.data.success && Array.isArray(response.data.data)) return response.data.data;
      throw new Error(response.data.message || 'خطا در دریافت لیست کلاس‌ها');
    },
  });

  // دریافت یک کلاس
  const getClassById = (id: string) => {
    return useQuery<Class, Error>({
      queryKey: classKeys.detail(id),
      queryFn: async () => {
        console.log(`Fetching class ${id} from API...`);
        const response = await api.get(`/api/classes/${id}`);
        if (response.data.success && response.data.data) return response.data.data;
        if (response.data && response.data._id) return response.data;
        throw new Error(response.data.message || 'خطا در دریافت اطلاعات کلاس');
      },
    });
  };

  // ایجاد کلاس جدید
  const createClass = useMutation<Class, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/api/classes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success && response.data.data) return response.data.data;
      throw new Error(response.data.message || 'خطا در ایجاد کلاس');
    },
    onSuccess: () => {
      console.log('Invalidating classes cache after create...');
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success('کلاس با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      console.error('Error creating class:', error);
      toast.error(error.message || 'خطا در ایجاد کلاس');
    },
  });

  // ویرایش کلاس
  const updateClass = useMutation<Class, Error, { id: string; formData: FormData }>({
    mutationFn: async ({ id, formData }) => {
      const response = await api.put(`/api/classes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        transformRequest: [(data) => data]
      });
      if (response.data.success && response.data.data) return response.data.data;
      throw new Error(response.data.message || 'خطا در به‌روزرسانی کلاس');
    },
    onSuccess: () => {
      console.log('Invalidating classes cache after update...');
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success('کلاس با موفقیت به‌روزرسانی شد');
    },
    onError: (error: Error) => {
      console.error('Error updating class:', error);
      toast.error(error.message || 'خطا در به‌روزرسانی کلاس');
    },
  });

  // حذف کلاس
  const deleteClass = useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/classes/${id}`);
      if (response.data.success) return true;
      throw new Error(response.data.message || 'خطا در حذف کلاس');
    },
    onSuccess: () => {
      console.log('Invalidating classes cache after delete...');
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
    error,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
  };
} 