'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SEOForm from '@/components/seo/SEOForm';
import { SEO } from '@/types/seo';

export default function EditSEOPage() {
  const params = useParams();
  const [seoData, setSeoData] = useState<SEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const response = await axios.get(`/api/seo/${params.id}`);
        setSeoData(response.data);
      } catch (err) {
        setError('خطا در دریافت تنظیمات SEO');
        console.error('Error fetching SEO:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  if (!seoData) {
    return (
      <div className="text-center p-4">
        تنظیمات SEO مورد نظر یافت نشد
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ویرایش تنظیمات SEO</h1>
      <SEOForm seoId={params.id as string} initialData={seoData} />
    </div>
  );
} 