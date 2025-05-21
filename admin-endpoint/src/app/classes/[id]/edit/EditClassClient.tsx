'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useClasses } from '@/hooks/useClasses';
import EditClassForm from '@/components/classes/EditClassForm';
import { ClassFormData } from '@/types/class';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">ویرایش کلاس</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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