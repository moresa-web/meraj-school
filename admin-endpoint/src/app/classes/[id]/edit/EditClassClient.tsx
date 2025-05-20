'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClasses } from '@/hooks/useClasses';
import EditClassForm from '@/components/classes/EditClassForm';
import { Class, ClassFormData } from '@/types/class';

interface EditClassClientProps {
  id: string;
}

export default function EditClassClient({ id }: EditClassClientProps) {
  const router = useRouter();
  const { updateClass, getClassById, loading, error } = useClasses();
  const [classData, setClassData] = useState<ClassFormData | null>(null);

  useEffect(() => {
    const loadClass = async () => {
      try {
        const classItem = await getClassById(id);
        if (classItem) {
          // تبدیل تاریخ‌ها به فرمت شمسی
          let startDate = '';
          let endDate = '';
          
          try {
            if (classItem.startDate) {
              const startDateObj = new Date(classItem.startDate);
              startDate = startDateObj.toLocaleDateString('fa-IR');
            }
            
            if (classItem.endDate) {
              const endDateObj = new Date(classItem.endDate);
              endDate = endDateObj.toLocaleDateString('fa-IR');
            }
          } catch (dateError) {
            console.error('Error converting dates:', dateError);
          }

          const formData: ClassFormData = {
            title: classItem.title || '',
            teacher: classItem.teacher || '',
            level: classItem.level || 'مقدماتی',
            category: classItem.category || '',
            capacity: classItem.capacity || 0,
            price: classItem.price || 0,
            startDate: startDate,
            endDate: endDate,
            schedule: classItem.schedule || '',
            description: classItem.description || '',
            image: classItem.image || '',
            isActive: classItem.isActive || false,
          };

          setClassData(formData);
        } else {
          router.push('/classes');
        }
      } catch (err) {
        console.error('Error loading class:', err);
      }
    };

    loadClass();
  }, [getClassById, id, router]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateClass(id, formData);
      router.push('/classes');
    } catch (err) {
      console.error('Error updating class:', err);
    }
  };

  if (!classData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

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
          classId={id}
          initialData={classData}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </div>
  );
} 