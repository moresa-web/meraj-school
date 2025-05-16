import React from 'react';
import { Link } from 'react-router-dom';
import { Class } from '../types';
import LoadingState from '@/components/LoadingState';
import { API_URL } from '../../../../../constants';

interface ClassListProps {
  classes: Class[];
  loading: boolean;
  onDelete: (classItem: Class) => Promise<void>;
}

const ClassList: React.FC<ClassListProps> = ({ classes, loading, onDelete }) => {
  console.log('ClassList props:', { classes, loading });

  if (loading) {
    return <LoadingState />;
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">هیچ کلاسی یافت نشد</p>
        <Link
          to="/dashboard/classes/new"
          className="inline-block mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          افزودن کلاس جدید
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
          {item.image && (
            <img
              src={`${API_URL.replace(/\/$/, '')}${item.image}`}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-2">استاد: {item.teacher}</p>
            <p className="text-sm text-gray-500 mb-2">زمان: {item.schedule}</p>
            <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">
                  ظرفیت: {item.capacity}
                </span>
                <span className="text-sm text-gray-500">
                  قیمت: {item.price.toLocaleString()} تومان
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/classes/edit/${item._id}`}
                  className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  ویرایش
                </Link>
                <button
                  onClick={() => onDelete(item)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassList; 