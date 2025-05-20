'use client';

import { useRouter } from 'next/navigation';
import { AcademicCapIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import ClassForm from '@/components/classes/ClassForm';
import { useClasses } from '@/hooks/useClasses';

export default function NewClassPage() {
  const router = useRouter();
  const { createClass } = useClasses();

  const handleSubmit = async (data: any, image: File | null) => {
    try {
      await createClass(data, image!);
      router.push('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <AcademicCapIcon className="h-7 w-7 text-emerald-600 ml-2" />
          <h1 className="text-2xl font-bold text-gray-800">افزودن کلاس جدید</h1>
        </div>
        <button
          onClick={() => router.push('/classes')}
          className="flex items-center px-3 py-2 text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowUturnLeftIcon className="h-4 w-4 ml-1" />
          بازگشت به لیست
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <ClassForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 