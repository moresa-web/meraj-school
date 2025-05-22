import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getImageUrl } from '@/utils/format';

interface ClassInfo {
  _id: string;
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  likedBy: string[];
  registrations?: string[];
}

interface ClassListProps {
  classes: ClassInfo[];
  onSelect: (classItem: ClassInfo) => void;
  onUnregister?: (classId: string) => void;
  loadingCourseId: string | null;
  registeredClasses: Set<string>;
}

const ClassList: React.FC<ClassListProps> = ({ 
  classes, 
  onSelect, 
  onUnregister,
  loadingCourseId,
  registeredClasses 
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleAction = async (classItem: ClassInfo) => {
    if (!isAuthenticated || !user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      navigate('/auth', { replace: true });
      return;
    }

    if (registeredClasses.has(classItem._id)) {
      if (onUnregister) {
        await onUnregister(classItem._id);
      }
    } else {
      onSelect(classItem);
    }
  };

  if (!classes.length) {
    return <div className="text-center text-gray-500 py-8">کلاسی یافت نشد.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {classes.map((classItem) => (
        <div
          key={classItem._id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col overflow-hidden"
        >
          <div className="relative">
            <img 
              src={getImageUrl(classItem.image)} 
              alt={classItem.title} 
              className="w-full h-56 object-cover"
            />
            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              {classItem.category}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-xl font-bold text-white mb-1">{classItem.title}</h3>
              <p className="text-white/90 text-sm">استاد: {classItem.teacher}</p>
            </div>
            {classItem.isActive ? (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm">
                فعال
              </span>
            ) : (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                غیرفعال
              </span>
            )}
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{classItem.schedule}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-600">{classItem.enrolledStudents} / {classItem.capacity}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 line-clamp-2">{classItem.description}</p>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-emerald-600 font-bold text-xl">{classItem.price.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">تومان</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                  {classItem.level}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(classItem);
                }}
                disabled={loadingCourseId === classItem._id || !classItem.isActive}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  loadingCourseId === classItem._id || !classItem.isActive
                    ? 'bg-gray-400 cursor-not-allowed'
                    : registeredClasses.has(classItem._id)
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                }`}
              >
                {loadingCourseId === classItem._id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    در حال پردازش...
                  </div>
                ) : !classItem.isActive ? (
                  'کلاس غیرفعال'
                ) : registeredClasses.has(classItem._id) ? (
                  'انصراف از کلاس'
                ) : (
                  'ثبت‌نام در کلاس'
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassList; 