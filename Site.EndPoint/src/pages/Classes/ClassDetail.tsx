import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import SEO from '../../components/SEO';
import Breadcrumbs from '../../components/Breadcrumbs';
import LoadingState from '../../components/LoadingState';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  MapPin, 
  Eye, 
  Heart, 
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ClassData {
  _id: string;
  title: string;
  description: string;
  teacher: string;
  schedule: string;
  capacity: number;
  enrolledStudents: number;
  price: number;
  level: string;
  category: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  views: number;
  likes: number;
  slug: string;
  image: string;
}

const ClassDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/classes/slug/${slug}`);
        setClassData(response.data);
        
        if (user) {
          const token = localStorage.getItem('token');
          if (token) {
            const checkResponse = await axios.get(`${API_URL}/api/classes/${response.data._id}/check-registration`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsRegistered(checkResponse.data.isRegistered);
          }
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast.error('خطا در دریافت اطلاعات کلاس');
        navigate('/classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [slug, user, navigate]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      navigate('/login', { state: { from: `/classes/${slug}` } });
      return;
    }

    // Check if user has required profile information
    if (!user.username || !user.studentPhone || !user.parentPhone) {
      toast.error('لطفاً ابتدا اطلاعات پروفایل خود را تکمیل کنید');
      return;
    }

    // Validate phone numbers
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(user.studentPhone) || !phoneRegex.test(user.parentPhone)) {
      toast.error('فرمت شماره تلفن نامعتبر است');
      return;
    }

    // Check if already registered
    if (isRegistered) {
      toast.error('شما قبلاً در این کلاس ثبت‌نام کرده‌اید');
      return;
    }

    // Check if class is active
    if (!classData?.isActive) {
      toast.error('این کلاس در حال حاضر فعال نیست');
      return;
    }

    // Check if class is full
    if (classData?.enrolledStudents >= classData?.capacity) {
      toast.error('ظرفیت این کلاس تکمیل شده است');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('توکن احراز هویت یافت نشد');
        return;
      }

      const payload = {
        studentName: user.username,
        studentPhone: user.studentPhone,
        parentPhone: user.parentPhone,
        grade: user.grade || ''
      };

      const response = await axios.post(
        `${API_URL}/api/classes/${classData?._id}/register`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setIsRegistered(true);
        toast.success('ثبت‌نام با موفقیت انجام شد');
      } else {
        toast.error(response.data.message || 'خطا در ثبت‌نام');
      }
    } catch (error: any) {
      console.error('Error registering for class:', error);
      toast.error(error.response?.data?.message || 'خطا در ثبت‌نام');
    }
  };

  const getStatusIcon = () => {
    if (!classData?.isActive) return <XCircle className="w-5 h-5 text-red-500" />;
    if (classData?.enrolledStudents >= classData?.capacity) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (!classData?.isActive) return 'غیرفعال';
    if (classData?.enrolledStudents >= classData?.capacity) return 'ظرفیت تکمیل';
    return 'فعال';
  };

  const getStatusColor = () => {
    if (!classData?.isActive) return 'text-red-500';
    if (classData?.enrolledStudents >= classData?.capacity) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingState />
      </div>
    );
  }

  if (!classData) {
    return null;
  }

  return (
    <>
      <SEO
        title={`${classData.title} | دبیرستان پسرانه معراج`}
        description={classData.description}
        keywords={`${classData.category}, ${classData.level}, ${classData.teacher}`}
        url={`/classes/${classData.slug}`}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20">
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
          theme="dark"
        />
        
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: 'کلاس‌های تقویتی', path: '/classes' },
              { label: classData.title }
            ]
          } />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Image and Title */}
              <Card className="bg-gray-800/50 border-gray-700">
                <div className="relative">
                  {classData.image ? (
                    <img 
                      src={classData.image} 
                      alt={classData.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center rounded-t-lg">
                      <BookOpen className="w-16 h-16 text-white/80" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {classData.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {classData.level}
                    </span>
                  </div>
                </div>
                <CardHeader className="bg-gray-800/30">
                  <CardTitle className="text-2xl font-bold text-white">{classData.title}</CardTitle>
                </CardHeader>
              </Card>

              {/* Description */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    توضیحات کلاس
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">{classData.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Class Statistics */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">آمار کلاس</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{classData.views}</div>
                      <div className="text-sm text-gray-400">بازدید</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{classData.likes}</div>
                      <div className="text-sm text-gray-400">پسند</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{classData.enrolledStudents}</div>
                      <div className="text-sm text-gray-400">ثبت‌نام شده</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{classData.capacity}</div>
                      <div className="text-sm text-gray-400">ظرفیت کل</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Class Information */}
              <Card className="bg-gray-800/50 border-gray-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">اطلاعات کلاس</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">استاد</div>
                      <div className="text-white font-medium">{classData.teacher}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">زمان برگزاری</div>
                      <div className="text-white font-medium">{classData.schedule}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">ظرفیت</div>
                      <div className="text-white font-medium">
                        {classData.enrolledStudents}/{classData.capacity}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">وضعیت</div>
                      <div className={`font-medium flex items-center gap-2 ${getStatusColor()}`}>
                        {getStatusIcon()}
                        {getStatusText()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">مکان</div>
                      <div className="text-white font-medium">کلاس‌های دبیرستان معراج</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing and Registration */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">ثبت‌نام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-2">
                      {classData.price.toLocaleString()} تومان
                    </div>
                    <div className="text-sm text-gray-400">هزینه کلاس</div>
                  </div>
                  
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistered || !classData.isActive || classData.enrolledStudents >= classData.capacity}
                    className={`w-full h-12 text-lg font-semibold transition-all duration-300 ${
                      isRegistered || !classData.isActive || classData.enrolledStudents >= classData.capacity
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        شما در این کلاس ثبت‌نام کرده‌اید
                      </>
                    ) : !classData.isActive ? (
                      <>
                        <XCircle className="w-5 h-5 ml-2" />
                        این کلاس در حال حاضر فعال نیست
                      </>
                    ) : classData.enrolledStudents >= classData.capacity ? (
                      <>
                        <AlertCircle className="w-5 h-5 ml-2" />
                        ظرفیت کلاس تکمیل شده است
                      </>
                    ) : (
                      <>
                        ثبت‌نام در کلاس
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                  
                  {classData.enrolledStudents < classData.capacity && classData.isActive && (
                    <div className="text-center text-sm text-gray-400">
                      {classData.capacity - classData.enrolledStudents} جای خالی باقی‌مانده
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetail; 