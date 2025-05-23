import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { FieldError } from '../../components/FieldError/FieldError';
import { NetworkError } from '../../components/NetworkError/NetworkError';
import { PageError } from '../../components/PageError/PageError';
import HeroSection from '../../components/HeroSection/HeroSection';
import { RegistrationModal } from '../../components/RegistrationModal/RegistrationModal';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoResults from '../../components/NoResults/NoResults';
import SEO from '../../components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ClassList from '../../components/classes/ClassList';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

interface RegistrationForm {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
}

const Classes: React.FC = () => {
  const title =
    import.meta.env.VITE_CLASSES_TITLE ||
    'کلاس‌های تقویتی - دبیرستان پسرانه معراج';
  const description =
    import.meta.env.VITE_CLASSES_DESCRIPTION ||
    'معرفی کلاس‌های تقویتی دبیرستان پسرانه معراج در دروس ریاضی، فیزیک و شیمی با اساتید مجرب.';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://merajschool.ir';
  const pagePath = '/classes';
  const fullUrl = `${siteUrl}${pagePath}`;
  const ogImagePath =
    import.meta.env.VITE_OG_IMAGE_PATH || '/images/logo.png';
  const ogImage = `${siteUrl}${ogImagePath}`;

  const { handleError, handleAxiosError } = useErrorHandler();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ClassInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'همه کلاس‌ها');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'جدیدترین');
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [pageError, setPageError] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationForm>({
    studentName: '',
    studentPhone: '',
    parentPhone: '',
    grade: ''
  });
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const [likedClasses, setLikedClasses] = useState<Set<string>>(new Set());
  const [registeredClasses, setRegisteredClasses] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>(['همه کلاس‌ها']);
  const { isAuthenticated, user } = useAuth();

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    updateSearchParams('category', value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearchParams('search', value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    updateSearchParams('sort', value);
  };

  // Sync state with searchParams when URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'همه کلاس‌ها');
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'جدیدترین');
  }, [searchParams]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/classes`, {
        params: {
          category: selectedCategory !== 'همه کلاس‌ها' ? selectedCategory : undefined,
          sortBy,
          search: searchQuery
        }
      });
      setClasses(response.data);
      // دریافت IP کاربر و بررسی لایک‌ها
      const userIP = await axios.get(`${API_URL}/api/user/ip`);
      const liked = new Set<string>(
        response.data
          .filter((course: ClassInfo) => course.likedBy?.includes(userIP.data))
          .map((course: ClassInfo) => course._id)
      );
      setLikedClasses(liked);
    } catch (error) {
      handleAxiosError(error);
      setError('خطا در دریافت کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // Check if Web Share API is supported
    setIsWebShareSupported('share' in navigator);
  }, []);

  // استخراج دسته‌بندی‌های منحصر به فرد از کلاس‌ها
  useEffect(() => {
    if (classes.length > 0) {
      const uniqueCategories = Array.from(new Set(classes.map(course => course.category)));
      setCategories(['همه کلاس‌ها', ...uniqueCategories]);
    }
  }, [classes]);

  // Filter and sort classes
  const filteredClasses = classes
    .filter(item => selectedCategory === 'همه کلاس‌ها' || item.category === selectedCategory)
    .filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

  const handleRegister = async (classItem: ClassInfo) => {
    try {
      // بررسی وضعیت احراز هویت
      if (!isAuthenticated || !user) {
        // ذخیره مسیر فعلی در localStorage
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
        navigate('/login', { replace: true });
        return;
      }

      // بررسی اطلاعات کاربر
      if (!user.fullName || !user.studentPhone || !user.parentPhone) {
        toast.error('لطفاً ابتدا اطلاعات پروفایل خود را تکمیل کنید');
        navigate('/profile', { replace: true });
        return;
      }

      // بررسی وضعیت کلاس
      if (!classItem.isActive) {
        toast.error('این کلاس در حال حاضر فعال نیست');
        return;
      }

      if (classItem.enrolledStudents >= classItem.capacity) {
        toast.error('ظرفیت این کلاس تکمیل شده است');
        return;
      }

      // بررسی تکراری نبودن ثبت‌نام
      if (registeredClasses.has(classItem._id)) {
        toast.error('شما قبلاً در این کلاس ثبت‌نام کرده‌اید');
        return;
      }

      const payload = {
        studentName: user.fullName,
        studentPhone: user.studentPhone,
        parentPhone: user.parentPhone,
        grade: user.grade || ''
      };

      // بررسی فرمت شماره تلفن‌ها
      const phoneRegex = /^09\d{9}$/;
      if (!phoneRegex.test(payload.studentPhone) || !phoneRegex.test(payload.parentPhone)) {
        toast.error('فرمت شماره تلفن نامعتبر است. شماره تلفن باید با ۰۹ شروع شود و ۱۱ رقم باشد');
        return;
      }

      console.log(payload);

      setLoadingCourseId(classItem._id);
      const response = await axios.post(`${API_URL}/api/classes/${classItem._id}/register`, payload);
      
      if (response.data.success) {
        toast.success('ثبت‌نام شما با موفقیت انجام شد');
        // به‌روزرسانی لیست کلاس‌ها و وضعیت ثبت‌نام
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

      // دریافت IP کاربر و به‌روزرسانی وضعیت لایک
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
      handleAxiosError(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // پاک کردن خطای فیلد وقتی کاربر شروع به تایپ می‌کند
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleShare = (classItem: ClassInfo) => {
    setSelectedClass(classItem);
    setShowShareModal(true);
  };

  const handleWebShare = async () => {
    if (!selectedClass) return;

    try {
      await navigator.share({
        title: selectedClass.title,
        text: selectedClass.description,
        url: `${window.location.origin}/classes/${selectedClass._id}`
      });
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    if (!selectedClass) return;
    const url = `${window.location.origin}/classes/${selectedClass._id}`;
    navigator.clipboard.writeText(url);
    setShowShareModal(false);
  };

  const handleShareSocial = (platform: string) => {
    if (!selectedClass) return;
    const url = `${window.location.origin}/classes/${selectedClass._id}`;
    const title = selectedClass.title;
    const text = selectedClass.description;

    let shareUrl = '';
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
    }

    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  // اضافه کردن تابع برای بررسی وضعیت ثبت نام همه کلاس‌ها
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

  // اضافه کردن تابع برای انصراف از کلاس
  const handleUnregister = async (courseId: string) => {
    try {
      setLoadingCourseId(courseId);
      const response = await axios.post(`${API_URL}/api/classes/${courseId}/unregister`);

      if (response.data.success) {
        toast.success('انصراف از کلاس با موفقیت انجام شد');
        // به‌روزرسانی لیست کلاس‌ها و وضعیت ثبت نام
        fetchClasses();
        checkAllRegistrations();
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('خطا در انصراف از کلاس');
      }
    } finally {
      setLoadingCourseId(null);
    }
  };

  // اضافه کردن useEffect برای بررسی وضعیت ثبت نام در هنگام بارگذاری
  useEffect(() => {
    if (classes.length > 0) {
      checkAllRegistrations();
    }
  }, [classes]);

  if (pageError) {
    return <PageError onRetry={() => setPageError(false)} />;
  }

  if (networkError) {
    return (
      <NetworkError
        onRetry={() => {
          setNetworkError(false);
        }}
      />
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: fullUrl,
    name: title,
    description: description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: currentClasses.map((course, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Course",
          name: course.title,
          description: course.description,
          provider: {
            "@type": "Organization",
            name: import.meta.env.VITE_DEFAULT_TITLE || 'دبیرستان پسرانه معراج',
            url: siteUrl
          },
          courseCode: course._id,
          educationalLevel: course.level,
          courseMode: course.isActive ? 'Online' : 'Offline',
          startDate: new Date(course.startDate).toISOString().split('T')[0],
          endDate: new Date(course.endDate).toISOString().split('T')[0],
          image: `${siteUrl}${course.image}`,
          keywords: course.category
        }
      }))
    }
  };

  return (
    <>
      <SEO
        title="کلاس‌های تقویتی | دبیرستان پسرانه معراج"
        description="کلاس‌های تقویتی دبیرستان پسرانه معراج مشهد. ثبت‌نام آنلاین در کلاس‌های ریاضی، فیزیک، شیمی و سایر دروس با اساتید برجسته."
        keywords="کلاس تقویتی, کلاس ریاضی, کلاس فیزیک, کلاس شیمی, ثبت‌نام آنلاین, دبیرستان معراج"
        url="/classes"
      />
        <HeroSection
          title="کلاس‌های تقویتی"
          description="با بهترین روش‌های نوین آموزشی، مسیر موفقیت تحصیلی خود را هموار کنید"
          imageUrl="/images/classes-hero.jpg"
        />
      <div className="w-full">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Breadcrumbs - Placed directly after HeroSection */}
        <div className="container mx-auto px-4 mt-8"> {/* Added container and margin-top */}
          <Breadcrumbs
            items={[
              { label: 'خانه', path: '/' },
              { label: 'کلاس‌های تقویتی' }
            ]}
          />
        </div>

        {/* Main Content Area (Search, Filters, Class List, Pagination) */}
        {/* Combined sections for unified layout */}
        <div className="py-8 md:py-12 bg-white rounded-lg shadow-md mt-4"> {/* Unified padding, background, adjusted margin-top */}
          <div className="max-w-7xl mx-auto px-4">
            {/* Search Bar */}
            <div className="w-full mb-6 animate-fade-in-up animation-delay-300">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="جستجو در کلاس‌ها..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 group-hover:shadow-lg"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-8 animate-fade-in-up animation-delay-400"> {/* Added margin-bottom */}
              {/* Mobile Filter Button */}
              <div className="md:hidden w-full">
                <button
                  onClick={() => document.getElementById('mobileFilters')?.classList.toggle('hidden')}
                  className="w-full flex items-center justify-between px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium transition-all duration-300 hover:bg-emerald-100 hover:shadow-md"
                >
                  <span>فیلترها</span>
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Mobile Filters Dropdown */}
              <div id="mobileFilters" className="md:hidden hidden w-full space-y-4 mt-4 animate-slide-down">
                {/* Categories */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    {categories.map((category, index) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 mb-1">مرتب‌سازی</label>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="جدیدترین">جدیدترین</option>
                    <option value="پربازدیدترین">پربازدیدترین</option>
                    <option value="محبوب‌ترین">محبوب‌ترین</option>
                    <option value="قیمت (صعودی)">قیمت (صعودی)</option>
                    <option value="قیمت (نزولی)">قیمت (نزولی)</option>
                  </select>
                </div>
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center justify-between w-full">
                {/* Sort Options - Left Side */}
                <div className="flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 hover:shadow-md"
                  >
                    <option value="جدیدترین">جدیدترین</option>
                    <option value="پربازدیدترین">پربازدیدترین</option>
                    <option value="محبوب‌ترین">محبوب‌ترین</option>
                    <option value="قیمت (صعودی)">قیمت (صعودی)</option>
                    <option value="قیمت (نزولی)">قیمت (نزولی)</option>
                  </select>
                </div>

                {/* Categories - Center */}
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange({ target: { value: category } } as React.ChangeEvent<HTMLSelectElement>)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md ${selectedCategory === category
                        ? 'bg-emerald-600 text-white scale-105'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Empty div for flex spacing */}
                <div className="w-[120px]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section - Now part of the main content area */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8">
              {loading ? (
                <div className="text-center py-8">در حال بارگذاری...</div>
              ) : filteredClasses.length === 0 ? (
                <div className="col-span-full flex items-center justify-center min-h-[350px]">
                  <NoResults message="کلاسی یافت نشد" />
                </div>
              ) : (
                <ClassList 
                  classes={currentClasses} 
                  onSelect={handleRegister} 
                  onUnregister={handleUnregister}
                  loadingCourseId={loadingCourseId}
                  registeredClasses={registeredClasses}
                />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2 animate-fade-in-up animation-delay-500">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all duration-300 hover:shadow-md flex items-center"
                >
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  قبلی
                </button>

                {/* First Page */}
                {currentPage > 2 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-md"
                  >
                    1
                  </button>
                )}

                {/* Ellipsis */}
                {currentPage > 3 && (
                  <span className="px-4 py-2 text-gray-500">...</span>
                )}

                {/* Previous Page */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-md"
                  >
                    {currentPage - 1}
                  </button>
                )}

                {/* Current Page */}
                <button
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white scale-105 transition-all duration-300"
                >
                  {currentPage}
                </button>

                {/* Next Page */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-md"
                  >
                    {currentPage + 1}
                  </button>
                )}

                {/* Ellipsis */}
                {currentPage < totalPages - 2 && (
                  <span className="px-4 py-2 text-gray-500">...</span>
                )}

                {/* Last Page */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-md"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all duration-300 hover:shadow-md flex items-center"
                >
                  بعدی
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section - Keep as a separate section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
              مزایای کلاس‌های تقویتی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  title: 'آموزش تخصصی',
                  description: 'آموزش توسط اساتید مجرب و متخصص در هر زمینه'
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: 'کلاس‌های کم جمعیت',
                  description: 'توجه ویژه به هر دانش‌آموز با تعداد محدود در هر کلاس'
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  ),
                  title: 'مشاوره تحصیلی',
                  description: 'مشاوره تخصصی برای انتخاب بهترین مسیر تحصیلی'
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Section - Keep as a separate section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
              برنامه زمانی کلاس‌ها
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-6 py-4 text-right text-emerald-600 font-semibold">تاریخ</th>
                      <th className="px-6 py-4 text-right text-emerald-600 font-semibold">درس</th>
                      <th className="px-6 py-4 text-right text-emerald-600 font-semibold">استاد</th>
                      <th className="px-6 py-4 text-right text-emerald-600 font-semibold">سطح</th>
                      <th className="px-6 py-4 text-right text-emerald-600 font-semibold">ظرفیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {classes
                      .filter(course => course.isActive)
                      .sort((a, b) => {
                        const aDate = new Date(a.startDate).getTime();
                        const bDate = new Date(b.startDate).getTime();
                        return aDate - bDate;
                      })
                      .map((course, index) => {
                        let formattedDate = '';
                        try {
                          formattedDate = new Date(course.startDate).toLocaleDateString('fa-IR');
                        } catch {
                          formattedDate = course.startDate;
                        }
                        return (
                          <tr key={course._id} className="hover:bg-emerald-50 transition-colors">
                            <td className="px-6 py-4 text-gray-700">{formattedDate}</td>
                            <td className="px-6 py-4 text-gray-700">{course.title}</td>
                            <td className="px-6 py-4 text-gray-700">{course.teacher}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-sm">
                                {course.level}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {course.registrations?.length || 0} / {course.capacity}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Share Modal */}
        {showShareModal && selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">اشتراک‌گذاری</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {isWebShareSupported && (
                  <button
                    onClick={handleWebShare}
                    className="flex flex-col items-center p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <span className="text-sm">اشتراک‌گذاری</span>
                  </button>
                )}
                <button
                  onClick={() => handleShareSocial('telegram')}
                  className="flex flex-col items-center p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.72 2.95-1.28 3.56-1.5 3.96-1.5.09 0 .28.02.4.09.11.06.18.14.21.24.03.1.04.2.01.32z" />
                  </svg>
                  <span className="text-sm">تلگرام</span>
                </button>
                <button
                  onClick={() => handleShareSocial('whatsapp')}
                  className="flex flex-col items-center p-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm">واتساپ</span>
                </button>
                <button
                  onClick={() => handleShareSocial('twitter')}
                  className="flex flex-col items-center p-4 bg-blue-50 text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span className="text-sm">توییتر</span>
                </button>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                کپی لینک
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Classes; 