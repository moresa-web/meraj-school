import { useState, useEffect } from 'react';
import { Class, ClassFormData } from '../types';
import { API_URL } from '../constants';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/classes`);
      if (!response.ok) {
        throw new Error('خطا در دریافت کلاس‌ها');
      }
      const data = await response.json();
      setClasses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const addClass = async (formData: ClassFormData): Promise<boolean> => {
    try {
      setSaving(true);
      
      // ایجاد FormData برای ارسال تصویر
      const data = new FormData();
      
      // اضافه کردن تصویر
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      } else {
        throw new Error('تصویر کلاس الزامی است');
      }

      // اضافه کردن سایر فیلدها
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image') {
          if (key === 'price' || key === 'capacity') {
            data.append(key, String(Number(value)));
          } else if (key === 'isActive') {
            data.append(key, String(Boolean(value)));
          } else {
            data.append(key, String(value));
          }
        }
      });

      // لاگ کردن داده‌های ارسالی
      console.log('Form Data:', formData);
      console.log('FormData entries:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.');
      }

      const response = await fetch(`${API_URL}/classes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'خطا در افزودن کلاس');
      }

      await fetchClasses();
      return true;
    } catch (err) {
      console.error('Error in addClass:', err);
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateClass = async (id: string, formData: ClassFormData): Promise<boolean> => {
    try {
      setSaving(true);
      
      // ایجاد FormData برای ارسال تصویر
      const data = new FormData();
      
      // اضافه کردن تصویر اگر وجود داشته باشد
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      // اضافه کردن سایر فیلدها
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image') {
          if (key === 'price' || key === 'capacity') {
            data.append(key, String(Number(value)));
          } else if (key === 'isActive') {
            data.append(key, String(Boolean(value)));
          } else {
            data.append(key, String(value));
          }
        }
      });

      // لاگ کردن داده‌های ارسالی
      console.log('Form Data:', formData);
      console.log('FormData entries:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('توکن احراز هویت یافت نشد. لطفاً دوباره وارد شوید.');
      }

      const response = await fetch(`${API_URL}/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'خطا در بروزرسانی کلاس');
      }

      await fetchClasses();
      return true;
    } catch (err) {
      console.error('Error in updateClass:', err);
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('خطا در حذف کلاس');
      }

      setClasses(prevClasses => prevClasses.filter(item => item._id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    error,
    saving,
    addClass,
    updateClass,
    deleteClass
  };
}; 