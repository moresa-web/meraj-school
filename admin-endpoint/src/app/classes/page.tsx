'use client';

import { useRouter } from 'next/navigation';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { ClassList } from '@/components/classes/ClassList';
import { useClasses } from '@/hooks/useClasses';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export default function ClassesPage() {
  const router = useRouter();
  const { classes, isLoading, queryError } = useClasses();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <AcademicCapIcon className="h-7 w-7 text-emerald-600 ml-2" />
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
        </div>
        <button
          onClick={() => router.push('/classes/new')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          افزودن کلاس جدید
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : queryError ? (
        <ErrorMessage message={queryError.message || 'خطا در دریافت لیست کلاس‌ها'} />
      ) : (
        <ClassList classes={classes} />
      )}
    </div>
  );
} 