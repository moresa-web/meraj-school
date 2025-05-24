'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClassStudents } from '@/hooks/useClassStudents';
import StudentForm from '@/components/classes/StudentForm';
import { StudentFormData } from '@/types/student';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addStudent } = useClassStudents(id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: StudentFormData) => {
    try {
      setIsSubmitting(true);
      await addStudent(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <ArrowLeftIcon className="ml-2 h-5 w-5" />
            بازگشت
          </button>
          <h1 className="text-2xl font-bold text-gray-800">افزودن دانش‌آموز جدید</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <StudentForm
            classId={id as string}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
} 