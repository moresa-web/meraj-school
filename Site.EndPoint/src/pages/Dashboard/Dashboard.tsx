import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { useNews } from './hooks/useNews';
import { useClasses } from './hooks/useClasses';
import { News, Class, NewsFormData, ClassFormData, Contact } from './types';
import Sidebar from './components/Sidebar';
import NewsTable from './components/NewsTable';
import NewsForm from './components/NewsForm';
import ClassTable from './components/ClassTable';
import ClassForm from './components/ClassForm';
import ContactTable from './components/ContactTable';
import Modal from './components/Modal';
import LoadingState from './components/LoadingState';
import './Dashboard.css';
import { useContacts } from './hooks/useContacts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedItem, setSelectedItem] = useState<News | Class | Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const {
    news,
    loading: newsLoading,
    error: newsError,
    saving: newsSaving,
    addNews,
    updateNews,
    deleteNews
  } = useNews();

  const {
    classes,
    loading: classesLoading,
    error: classesError,
    saving: classesSaving,
    addClass,
    updateClass,
    deleteClass
  } = useClasses();

  const {
    contacts,
    loading: contactsLoading,
    error: contactsError,
  } = useContacts();

  useEffect(() => {
    console.log('Location changed:', location.pathname);
    console.log('Current ID:', id);
    console.log('Current news:', news);

    if (location.pathname.includes('/news/edit/') && id) {
      const newsToEdit = news.find(item => item._id === id);
      console.log('Found news to edit:', newsToEdit);
      if (newsToEdit) {
        setEditingNews(newsToEdit);
        setIsAddingNews(true);
      }
    }
  }, [location.pathname, id, news]);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleViewItem = (item: News | Class | Contact) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleEditNews = (news: News) => {
    console.log('Edit news clicked:', news);
    setEditingNews(news);
    setIsAddingNews(true);
    navigate(`/dashboard/news/edit/${news._id}`);
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setIsAddingClass(true);
    navigate(`/dashboard/classes/edit/${classItem._id}`);
  };

  const handleDeleteNews = async (news: News) => {
    if (window.confirm('آیا از حذف این خبر اطمینان دارید؟')) {
      await deleteNews(news._id);
    }
  };

  const handleDeleteClass = async (classItem: Class) => {
    if (window.confirm('آیا از حذف این کلاس اطمینان دارید؟')) {
      await deleteClass(classItem._id);
    }
  };

  const handleNewsSubmit = async (formData: NewsFormData): Promise<boolean> => {
    if (editingNews) {
      const success = await updateNews(editingNews._id, formData);
      if (success) {
        setIsAddingNews(false);
        setEditingNews(null);
        navigate('/dashboard/news');
      }
      return success;
    } else {
      const success = await addNews(formData);
      if (success) {
        setIsAddingNews(false);
        navigate('/dashboard/news');
      }
      return success;
    }
  };

  const handleClassSubmit = async (formData: ClassFormData) => {
    const success = editingClass
      ? await updateClass(editingClass._id, formData)
      : await addClass(formData);

    if (success) {
      setIsAddingClass(false);
      setEditingClass(null);
      navigate('/dashboard/classes');
    }
    return success;
  };

  const renderContent = () => {
    console.log('Rendering content...');
    console.log('Current path:', location.pathname);
    console.log('Is adding news:', isAddingNews);
    console.log('Editing news:', editingNews);

    if (newsLoading || classesLoading || contactsLoading) {
      return <LoadingState loading={true} error={null} />;
    }

    if (newsError || classesError || contactsError) {
      return <LoadingState loading={false} error={newsError || classesError || contactsError} />;
    }

    // Check for edit path first
    if (location.pathname.includes('/news/edit/')) {
      console.log('Rendering edit form for news');
      return (
        <NewsForm
          news={editingNews || undefined}
          onSubmit={handleNewsSubmit}
          onCancel={() => {
            setIsAddingNews(false);
            setEditingNews(null);
            navigate('/dashboard/news');
          }}
          saving={newsSaving}
        />
      );
    }

    // Check for add path
    if (location.pathname.includes('/news/add')) {
      console.log('Rendering add form for news');
      return (
        <NewsForm
          onSubmit={handleNewsSubmit}
          onCancel={() => {
            setIsAddingNews(false);
            navigate('/dashboard/news');
          }}
          saving={newsSaving}
        />
      );
    }

    // Check for classes edit path
    if (location.pathname.includes('/classes/edit/')) {
      return (
        <ClassForm
          classItem={editingClass || undefined}
          onSubmit={handleClassSubmit}
          onCancel={() => {
            setIsAddingClass(false);
            setEditingClass(null);
            navigate('/dashboard/classes');
          }}
          saving={classesSaving}
        />
      );
    }

    // Check for classes add path
    if (location.pathname.includes('/classes/add')) {
      return (
        <ClassForm
          onSubmit={handleClassSubmit}
          onCancel={() => {
            setIsAddingClass(false);
            navigate('/dashboard/classes');
          }}
          saving={classesSaving}
        />
      );
    }

    // Default views
    if (location.pathname.includes('/news')) {
      return (
        <NewsTable
          news={news}
          onView={handleViewItem}
          onEdit={handleEditNews}
          onDelete={handleDeleteNews}
        />
      );
    }

    if (location.pathname.includes('/classes')) {
      return (
        <ClassTable
          classes={classes}
          onView={handleViewItem}
          onEdit={handleEditClass}
          onDelete={handleDeleteClass}
        />
      );
    }

    if (location.pathname.includes('/contacts')) {
      return (
        <ContactTable
          contacts={contacts}
          onView={handleViewItem}
        />
      );
    }

    return <Outlet />;
  };

  return (
    <div className="dashboard">
      <Sidebar
        onAddNews={() => {
          setIsAddingNews(true);
          navigate('/dashboard/news/add');
        }}
        onAddClass={() => {
          setIsAddingClass(true);
          navigate('/dashboard/classes/add');
        }}
      />
      <main className="dashboard-content">
        {renderContent()}
      </main>
      {isModalOpen && selectedItem && (
        <Modal
          item={selectedItem}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard; 