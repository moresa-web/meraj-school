import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Class } from '@/types/class';
import { useClasses } from '@/hooks/useClasses';
import { formatDate, formatNumber, getImageUrl } from '@/utils/format';

interface ClassCardProps {
  class: Class;
}

export function ClassCard({ class: classData }: ClassCardProps) {
  const router = useRouter();
  const { deleteClass } = useClasses();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!classData._id) return;
    
    if (window.confirm('آیا از حذف این کلاس اطمینان دارید؟')) {
      setIsDeleting(true);
      try {
        await deleteClass.mutateAsync(classData._id);
      } catch (error) {
        console.error('Error deleting class:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    if (!classData._id) return;
    router.push(`/classes/edit/${classData._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={getImageUrl(classData.image)}
          alt={classData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors ml-2"
            title="ویرایش"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100 transition-colors"
            title="حذف"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{classData.title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>استاد: {classData.teacher?.name || 'نامشخص'}</p>
          <p>ظرفیت: {formatNumber(classData.capacity)} نفر</p>
          <p>تاریخ شروع: {formatDate(classData.startDate)}</p>
          <p>زمان: {classData.schedule}</p>
        </div>
      </div>
    </div>
  );
} 