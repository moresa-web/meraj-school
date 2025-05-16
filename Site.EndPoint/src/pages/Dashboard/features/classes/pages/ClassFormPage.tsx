import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import ClassForm from '../components/ClassForm';
import LoadingState from '../../../../../components/LoadingState';

const ClassFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { classes, loading, error, addClass, updateClass } = useClasses();

  const handleSubmit = async (formData: any) => {
    if (id) {
      return await updateClass(id, formData);
    } else {
      return await addClass(formData);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/classes');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <LoadingState error={error} />;
  }

  const classItem = id ? classes.find(item => item._id === id) : undefined;

  return (
    <ClassForm
      classItem={classItem}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      saving={loading}
    />
  );
};

export default ClassFormPage; 