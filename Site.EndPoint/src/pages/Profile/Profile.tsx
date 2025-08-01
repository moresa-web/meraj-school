import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentPhone: '',
    parentPhone: '',
    grade: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.username || '',
        studentPhone: user.studentPhone || '',
        parentPhone: user.parentPhone || '',
        grade: user.grade || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // بررسی فرمت شماره تلفن‌ها
      const phoneRegex = /^09\d{9}$/;
      if (formData.studentPhone && !phoneRegex.test(formData.studentPhone)) {
        toast.error('فرمت شماره تلفن دانش‌آموز نامعتبر است');
        return;
      }
      if (formData.parentPhone && !phoneRegex.test(formData.parentPhone)) {
        toast.error('فرمت شماره تلفن والد نامعتبر است');
        return;
      }

      const response = await axios.put(`${API_URL}/api/users/profile`, formData);
      
      if (response.data.success) {
        toast.success('اطلاعات پروفایل با موفقیت به‌روز شد');
        // ریدایرکت به صفحه قبلی
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/classes';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">تکمیل اطلاعات پروفایل</h2>
            <p className="text-gray-600 mb-8">
              برای ثبت‌نام در کلاس‌ها، لطفاً اطلاعات زیر را تکمیل کنید.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل دانش‌آموز
                </label>
                <input
                  type="tel"
                  id="studentPhone"
                  name="studentPhone"
                  value={formData.studentPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="شماره موبایل دانش‌آموز را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل والد
                </label>
                <input
                  type="tel"
                  id="parentPhone"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="شماره موبایل والد را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  پایه تحصیلی
                </label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="پایه تحصیلی خود را وارد کنید"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    در حال ذخیره...
                  </div>
                ) : (
                  'ذخیره اطلاعات'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 