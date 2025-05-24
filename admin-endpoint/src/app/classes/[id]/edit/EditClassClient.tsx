'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useClasses } from '@/hooks/useClasses';
import EditClassForm from '@/components/classes/EditClassForm';
import { ClassFormData } from '@/types/class';
import { AcademicCapIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

interface EditClassClientProps {
  initialData: any;
}

export default function EditClassClient({ initialData }: EditClassClientProps) {
  const router = useRouter();
  const { updateClass, loading, error } = useClasses();

  // تبدیل تاریخ‌ها به فرمت شمسی
  let startDate = '';
  let endDate = '';
  
  try {
    if (initialData.startDate) {
      const startDateObj = new Date(initialData.startDate);
      startDate = startDateObj.toLocaleDateString('fa-IR');
    }
    
    if (initialData.endDate) {
      const endDateObj = new Date(initialData.endDate);
      endDate = endDateObj.toLocaleDateString('fa-IR');
    }
  } catch (dateError) {
    console.error('Error converting dates:', dateError);
  }

  const formData: ClassFormData = {
    title: initialData.title || '',
    teacher: initialData.teacher || '',
    level: initialData.level || 'مقدماتی',
    category: initialData.category || '',
    capacity: initialData.capacity || 0,
    price: initialData.price || 0,
    startDate: startDate,
    endDate: endDate,
    schedule: initialData.schedule || '',
    description: initialData.description || '',
    image: initialData.image || '',
    isActive: initialData.isActive || false,
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateClass(initialData._id, formData);
      router.push('/classes');
    } catch (err) {
      console.error('Error updating class:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <AcademicCapIcon className="h-6 w-6 md:h-7 md:w-7 text-emerald-600 ml-2" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">ویرایش کلاس</h1>
        </div>
        <button
          onClick={() => router.push('/classes')}
          className="flex items-center px-3 py-2 text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowUturnLeftIcon className="h-4 w-4 ml-1" />
          بازگشت به لیست
        </button>
      </div>

      {error && (
        <div className="p-3 md:p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm md:text-base">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <EditClassForm
          classId={initialData._id}
          initialData={formData}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
} 