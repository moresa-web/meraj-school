import React from 'react';
import EditClassClient from './EditClassClient';
import { api } from '@/lib/api';

interface EditClassPageProps {
  params: Promise<{
    id: string;
  
  }>;
}

async function getClassData(id: string) {
  try {
    const response = await api.get(`/api/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class data:', error);
    return null;
  }
}

export default async function EditClassPage(
  { params }: EditClassPageProps
) {
  const resolvedParams = await params;
  const classData = await getClassData(resolvedParams.id);
  
  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-3 md:p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm md:text-base">
            خطا در دریافت اطلاعات کلاس
          </div>
        </div>
      </div>
    );
  }

  return <EditClassClient initialData={classData} />;
} 