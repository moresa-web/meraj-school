import React from 'react';
import EditClassClient from './EditClassClient';
import { api } from '@/lib/api';

interface EditClassPageProps {
  params: {
    id: string;
  };
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

export default async function EditClassPage({ params }: EditClassPageProps) {
  const classData = await getClassData(params.id);
  
  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            خطا در دریافت اطلاعات کلاس
          </div>
        </div>
      </div>
    );
  }

  return <EditClassClient initialData={classData} />;
} 