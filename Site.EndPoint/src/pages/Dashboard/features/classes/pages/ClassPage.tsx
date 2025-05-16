import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import ClassList from '../components/ClassList';
import LoadingState from '../../../../components/LoadingState';

const ClassPage: React.FC = () => {
  const navigate = useNavigate();
  const { classes, loading, error, deleteClass } = useClasses();

  console.log('ClassPage useClasses:', { classes, loading, error });

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این کلاس اطمینان دارید؟')) {
      await deleteClass(id);
    }
  };

  if (error) {
    return <LoadingState error={error} />;
  }

  return (
    <div className="class-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
        <button
          onClick={() => navigate('/dashboard/classes/new')}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          افزودن کلاس جدید
        </button>
      </div>

      <ClassList
        classes={classes}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClassPage; 