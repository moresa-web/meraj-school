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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <AcademicCapIcon className="h-6 w-6 md:h-7 md:w-7 text-emerald-600 ml-2" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
        </div>
        <button
          onClick={() => router.push('/classes/new')}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base"
        >
          افزودن کلاس جدید
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : queryError ? (
        <ErrorMessage message={queryError.message || 'خطا در دریافت لیست کلاس‌ها'} />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <ClassList classes={classes} />
        </div>
      )}
    </div>
  );
} 