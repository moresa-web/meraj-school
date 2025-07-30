import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { BookOpen, Users, Clock, Star, Heart, Share2, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditableContent from '../../../components/EditableContent/EditableContent';
import './ClassesListSection.css';

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
  slug: string;
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

interface ClassesListSectionProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
}

interface ClassesListContent {
  title: string;
  subtitle: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultContent: ClassesListContent = {
  title: 'کلاس‌های موجود',
  subtitle: 'کلاس یافت شد'
};

const ClassesListSection: React.FC<ClassesListSectionProps> = ({
  searchQuery,
  selectedCategory,
  sortBy
}) => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [likedClasses, setLikedClasses] = useState<Set<string>>(new Set());
  const [registeredClasses, setRegisteredClasses] = useState<Set<string>>(new Set());
  const [content, setContent] = useState<ClassesListContent>(defaultContent);
  const [contentLoading, setContentLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const itemsPerPage = 6;

  // Fetch content for admin editing
  const fetchContent = useCallback(async () => {
    try {
      setContentLoading(true);
      console.log('Fetching content from:', `${API_URL}/api/content/classes/list`);
      const response = await fetch(`${API_URL}/api/content/classes/list`);
      console.log('Content response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Content data:', data);
        setContent({
          title: data.title || defaultContent.title,
          subtitle: data.subtitle || defaultContent.subtitle
        });
      } else {
        console.error('Content response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching classes list content:', error);
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleContentSave = async (field: keyof ClassesListContent, newValue: string) => {
    try {
      const updatedContent = { ...content, [field]: newValue };
      
      const response = await fetch(`${API_URL}/api/content/classes/list`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      if (response.ok) {
        setContent(updatedContent);
        toast.success('محتوا با موفقیت به‌روزرسانی شد');
      } else {
        throw new Error('خطا در به‌روزرسانی محتوا');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('خطا در به‌روزرسانی محتوا');
    }
  };

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map Persian sort values to English values
      const sortMapping: { [key: string]: string } = {
        'جدیدترین': 'newest',
        'پربازدیدترین': 'views',
        'محبوب‌ترین': 'likes',
        'قیمت (صعودی)': 'price-asc',
        'قیمت (نزولی)': 'price-desc'
      };
      
      const mappedSortBy = sortMapping[sortBy] || 'newest';
      
      const response = await axios.get(`${API_URL}/api/classes`, {
        params: {
          category: selectedCategory !== 'همه کلاس‌ها' ? selectedCategory : undefined,
          sortBy: mappedSortBy,
          search: searchQuery
        }
      });
      setClasses(response.data);
      
      // دریافت IP کاربر و بررسی لایک‌ها
      try {
        const userIP = await axios.get(`${API_URL}/api/user/ip`);
        const liked = new Set<string>(
          response.data
            .filter((course: ClassInfo) => course.likedBy?.includes(userIP.data))
            .map((course: ClassInfo) => course._id)
        );
        setLikedClasses(liked);
      } catch (ipError) {
        console.error('Error fetching user IP:', ipError);
        setLikedClasses(new Set());
      }
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError(`خطا در دریافت کلاس‌ها: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Filter and sort classes
  const filteredClasses = classes
    .filter(item => {
      const categoryMatch = selectedCategory === 'همه کلاس‌ها' || item.category === selectedCategory;
      return categoryMatch;
    })
    .filter(item => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch;
    })
    .sort((a, b) => {
      const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه'];
      const [aDay, aTime] = a.schedule ? a.schedule.split(' - ') : ['', ''];
      const [bDay, bTime] = b.schedule ? b.schedule.split(' - ') : ['', ''];
      const aDayIndex = days.indexOf(aDay);
      const bDayIndex = days.indexOf(bDay);
      if (aDayIndex !== bDayIndex) {
        return aDayIndex - bDayIndex;
      }
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1;
      if (!bTime) return -1;
      return aTime.localeCompare(bTime);
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const currentClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log('Debug Info:', {
    totalClasses: classes.length,
    filteredClasses: filteredClasses.length,
    selectedCategory,
    searchQuery,
    currentClasses: currentClasses.length,
    currentPage,
    itemsPerPage
  });

  const handleRegister = async (classItem: ClassInfo) => {
    try {
      if (!isAuthenticated || !user) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
        return;
      }

      if (!user.username || !user.studentPhone || !user.parentPhone) {
        toast.error('لطفاً ابتدا اطلاعات پروفایل خود را تکمیل کنید');
        return;
      }

      if (!classItem.isActive) {
        toast.error('این کلاس در حال حاضر فعال نیست');
        return;
      }

      if (classItem.enrolledStudents >= classItem.capacity) {
        toast.error('ظرفیت این کلاس تکمیل شده است');
        return;
      }

      if (registeredClasses.has(classItem._id)) {
        toast.error('شما قبلاً در این کلاس ثبت‌نام کرده‌اید');
        return;
      }

      const payload = {
        studentName: user.username,
        studentPhone: user.studentPhone,
        parentPhone: user.parentPhone,
        grade: user.grade || ''
      };

      const phoneRegex = /^09\d{9}$/;
      if (!phoneRegex.test(payload.studentPhone) || !phoneRegex.test(payload.parentPhone)) {
        toast.error('فرمت شماره تلفن نامعتبر است');
        return;
      }

      setLoadingCourseId(classItem._id);
      const response = await axios.post(`${API_URL}/api/classes/${classItem._id}/register`, payload);
      
      if (response.data.success) {
        toast.success('ثبت‌نام شما با موفقیت انجام شد');
        await fetchClasses();
        await checkAllRegistrations();
      } else {
        toast.error(response.data.message || 'خطا در ثبت‌نام');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'خطا در ثبت‌نام';
      toast.error(errorMessage);
    } finally {
      setLoadingCourseId(null);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/classes/${id}/like`);
      setClasses(prevClasses =>
        prevClasses.map(course =>
          course._id === id ? response.data : course
        )
      );

      const userIP = await axios.get(`${API_URL}/api/user/ip`);
      setLikedClasses(prev => {
        const newSet = new Set(prev);
        if (response.data.likedBy.includes(userIP.data)) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleCardClick = (classItem: ClassInfo) => {
    navigate(`/classes/${classItem.slug}`);
  };

  const checkAllRegistrations = async () => {
    try {
      const registrations = new Set<string>();
      for (const course of classes) {
        const response = await axios.get(`${API_URL}/api/classes/${course._id}/check-registration`);
        if (response.data.isRegistered) {
          registrations.add(course._id);
        }
      }
      setRegisteredClasses(registrations);
    } catch (error) {
      console.error('Error checking registrations:', error);
    }
  };

  useEffect(() => {
    if (classes.length > 0) {
      checkAllRegistrations();
    }
  }, [classes]);

  if (loading) {
    return (
      <section className="classes-list-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="classes-list-section">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <button
              onClick={fetchClasses}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="classes-list-section">
      <div className="container mx-auto px-4">
                  <div className="text-center mb-12">
            <h2 className="classes-list-title">
              <EditableContent
                type="text"
                value={content.title}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleContentSave('title', newValue)}
              />
            </h2>
            <p className="classes-list-subtitle">
              <EditableContent
                type="text"
                value={`${filteredClasses.length} ${content.subtitle}`}
                isAdmin={user?.role === 'admin'}
                onSave={(newValue) => handleContentSave('subtitle', newValue)}
              />
            </p>
          </div>

        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">کلاسی یافت نشد</h3>
            <p className="text-gray-400">لطفاً فیلترهای خود را تغییر دهید</p>
          </div>
        ) : (
          <>
            
            <div className="classes-grid">
              {currentClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="classes-card cursor-pointer"
                  onClick={() => handleCardClick(classItem)}
                >
                  <div className="classes-card-image">
                    <div className="classes-card-image-placeholder">
                      <div className="classes-card-image-icon">
                        <BookOpen className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div className="classes-card-image-text">
                        <h4 className="classes-card-image-title">{classItem.title}</h4>
                        <p className="classes-card-image-subtitle">{classItem.category}</p>
                      </div>
                    </div>
                    <div className="classes-card-overlay">
                      <div className="classes-card-overlay-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(classItem._id);
                          }}
                          className={`classes-like-button ${likedClasses.has(classItem._id) ? 'liked' : ''}`}
                          aria-label={likedClasses.has(classItem._id) ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="classes-share-button"
                          aria-label="اشتراک‌گذاری"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="classes-card-overlay-content">
                        <h4 className="classes-card-overlay-title">{classItem.title}</h4>
                        <p className="classes-card-overlay-subtitle">{classItem.teacher}</p>
                      </div>
                    </div>
                    <div className="classes-card-badge">
                      <span className={`classes-card-status ${classItem.isActive ? 'active' : 'inactive'}`}>
                        {classItem.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>

                  <div className="classes-card-content">
                    <div className="classes-card-header">
                      <div className="classes-card-title-section">
                        <h3 className="classes-card-title">{classItem.title}</h3>
                        <span className="classes-card-category">{classItem.category}</span>
                      </div>
                      <div className="classes-card-rating">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="classes-card-rating-text">{classItem.likes}</span>
                      </div>
                    </div>

                    <p className="classes-card-description">{classItem.description}</p>

                    <div className="classes-card-info">
                      <div className="classes-info-item">
                        <Users className="w-4 h-4" />
                        <span>{classItem.teacher}</span>
                      </div>
                      <div className="classes-info-item">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.schedule}</span>
                      </div>
                      <div className="classes-info-item">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.level}</span>
                      </div>
                    </div>

                    <div className="classes-card-progress">
                      <div className="classes-progress-header">
                        <span className="classes-progress-label">ظرفیت کلاس</span>
                        <span className="classes-progress-text">{classItem.enrolledStudents}/{classItem.capacity}</span>
                      </div>
                      <div className="classes-progress-bar">
                        <div 
                          className="classes-progress-fill"
                          style={{ 
                            width: `${Math.min((classItem.enrolledStudents / classItem.capacity) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="classes-card-footer">
                      <div className="classes-price">
                        <DollarSign className="w-4 h-4" />
                        <span>{classItem.price.toLocaleString()} تومان</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(classItem);
                        }}
                        disabled={loadingCourseId === classItem._id || registeredClasses.has(classItem._id) || !classItem.isActive || classItem.enrolledStudents >= classItem.capacity}
                        className={`classes-register-button ${registeredClasses.has(classItem._id) ? 'registered' : ''} ${!classItem.isActive || classItem.enrolledStudents >= classItem.capacity ? 'disabled' : ''}`}
                      >
                        {loadingCourseId === classItem._id ? (
                          <div className="classes-loading-spinner"></div>
                        ) : registeredClasses.has(classItem._id) ? (
                          'ثبت‌نام شده'
                        ) : !classItem.isActive ? (
                          'غیرفعال'
                        ) : classItem.enrolledStudents >= classItem.capacity ? (
                          'ظرفیت تکمیل'
                        ) : (
                          'ثبت‌نام'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="classes-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="classes-pagination-button"
                >
                  قبلی
                </button>

                {currentPage > 2 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="classes-pagination-button"
                  >
                    1
                  </button>
                )}

                {currentPage > 3 && (
                  <span className="classes-pagination-ellipsis">...</span>
                )}

                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="classes-pagination-button"
                  >
                    {currentPage - 1}
                  </button>
                )}

                <button className="classes-pagination-button active">
                  {currentPage}
                </button>

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="classes-pagination-button"
                  >
                    {currentPage + 1}
                  </button>
                )}

                {currentPage < totalPages - 2 && (
                  <span className="classes-pagination-ellipsis">...</span>
                )}

                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="classes-pagination-button"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="classes-pagination-button"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ClassesListSection;