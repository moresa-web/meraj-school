'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import NewsletterForm from '@/components/newsletters/NewsletterForm';
import { Newsletter } from '@/types/newsletter';

export default function EditNewsletterPage() {
  const params = useParams();
  const [newsletterData, setNewsletterData] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await axios.get(`/api/newsletters/${params.id}`);
        setNewsletterData(response.data);
      } catch (err) {
        setError('خطا در دریافت اطلاعات خبرنامه');
        console.error('Error fetching newsletter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
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

  if (!newsletterData) {
    return (
      <div className="text-center p-4">
        خبرنامه مورد نظر یافت نشد
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ویرایش خبرنامه</h1>
      <NewsletterForm newsletterId={params.id as string} initialData={newsletterData} />
    </div>
  );
} 