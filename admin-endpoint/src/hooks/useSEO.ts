import { useState, useEffect } from 'react';
import { SEO } from '@/types/seo';
import api from '@/services/api';

export const useSEO = () => {
  const [seoList, setSEOList] = useState<SEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSEOList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/seo');
      console.log('SEO Response:', response.data);
      
      // Check if response has success property (from our API route)
      if (response.data.success) {
        const seoData = response.data.data;
        setSEOList(Array.isArray(seoData) ? seoData : [seoData]);
      } else if (response.data._id) {
        // Direct response from backend (no wrapper)
        setSEOList([response.data]);
      } else {
        setError('خطا در دریافت اطلاعات SEO');
        setSEOList([]);
      }
    } catch (err) {
      setError('خطا در دریافت اطلاعات تنظیمات SEO');
      setSEOList([]);
      console.error('Error fetching SEO settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSEO = async (seoData: Omit<SEO, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.put('/api/seo', seoData);
      console.log('Create SEO Response:', response.data);
      
      if (response.data.success) {
        setSEOList(prevList => [...prevList, response.data.data]);
        return response.data.data;
      } else if (response.data._id) {
        // Direct response from backend
        setSEOList(prevList => [...prevList, response.data]);
        return response.data;
      } else {
        throw new Error(response.data.message || 'خطا در ایجاد تنظیمات SEO');
      }
    } catch (err) {
      setError('خطا در ایجاد تنظیمات SEO');
      console.error('Error creating SEO settings:', err);
      throw err;
    }
  };

  const updateSEO = async (id: string, seoData: Partial<SEO>) => {
    try {
      const response = await api.put('/api/seo', seoData);
      console.log('Update SEO Response:', response.data);
      
      if (response.data.success) {
        setSEOList(prevList => prevList.map(s => s._id === id ? response.data.data : s));
        return response.data.data;
      } else if (response.data._id) {
        // Direct response from backend
        setSEOList(prevList => prevList.map(s => s._id === id ? response.data : s));
        return response.data;
      } else {
        throw new Error(response.data.message || 'خطا در بروزرسانی تنظیمات SEO');
      }
    } catch (err) {
      setError('خطا در بروزرسانی تنظیمات SEO');
      console.error('Error updating SEO settings:', err);
      throw err;
    }
  };

  const deleteSEO = async (id: string) => {
    try {
      await api.delete(`/api/seo/${id}`);
      setSEOList(prevList => prevList.filter(s => s._id !== id));
    } catch (err) {
      setError('خطا در حذف تنظیمات SEO');
      console.error('Error deleting SEO settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSEOList();
  }, []);

  return {
    seoList,
    loading,
    error,
    fetchSEOList,
    createSEO,
    updateSEO,
    deleteSEO,
  };
}; 