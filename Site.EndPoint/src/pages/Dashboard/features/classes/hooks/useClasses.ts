import { useState, useEffect } from 'react';
import { Class, ClassFormData } from '../types';
import { API_URL } from '../../../../../constants';
import toast from 'react-hot-toast';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('useClasses useEffect called');
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching classes from:', `${API_URL}/api/classes`);
      const response = await fetch(`${API_URL}/api/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('خطا در دریافت کلاس‌ها');
      }
      const data = await response.json();
      console.log('Received data:', data);
      setClasses(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err instanceof Error ? err.message : 'خطا در دریافت کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  console.log('useClasses state:', { classes, loading, error });

  const addClass = async (formData: ClassFormData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('خطا در افزودن کلاس');
      }

      const newClass = await response.json();
      setClasses(prev => [...prev, newClass]);
      toast.success('کلاس با موفقیت افزوده شد');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در افزودن کلاس';
      toast.error(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateClass = async (id: string, formData: ClassFormData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('خطا در بروزرسانی کلاس');
      }

      const updatedClass = await response.json();
      setClasses(prev => prev.map(item => item._id === id ? updatedClass : item));
      toast.success('کلاس با موفقیت بروزرسانی شد');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در بروزرسانی کلاس';
      toast.error(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/classes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در حذف کلاس');
      }

      setClasses(prev => prev.filter(item => item._id !== id));
      toast.success('کلاس با موفقیت حذف شد');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطا در حذف کلاس';
      toast.error(message);
    }
  };

  return {
    classes,
    loading,
    error,
    saving,
    addClass,
    updateClass,
    deleteClass,
    refreshClasses: fetchClasses
  };
}; 