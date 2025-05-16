import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClassList from '../components/ClassList';
import { Class } from '../types';
import api from '../../../../../services/api';

const ClassListPage: React.FC = () => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('خطا در دریافت لیست کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (classItem: Class) => {
    if (!window.confirm('آیا از حذف این کلاس اطمینان دارید؟')) {
      return;
    }

    try {
      await api.delete(`/classes/${classItem._id}`);
      // بروزرسانی لیست کلاس‌ها بعد از حذف
      setClasses(classes.filter(item => item._id !== classItem._id));
    } catch (err) {
      console.error('Error deleting class:', err);
      alert('خطا در حذف کلاس');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('dashboard.classes.title')}
        </h1>
        <Link
          to="/dashboard/classes/add"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          {t('dashboard.classes.addNew')}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      <ClassList 
        classes={classes} 
        loading={loading} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default ClassListPage; 