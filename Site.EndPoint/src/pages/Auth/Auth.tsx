import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'user',
    studentPhone: '',
    parentPhone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        let phoneToSend = formData.phone;
        if (formData.role === 'student') {
          if (formData.studentPhone) {
            phoneToSend = formData.studentPhone;
          } else if (formData.parentPhone) {
            phoneToSend = formData.parentPhone;
          } else {
            setError('حداقل یکی از شماره‌های دانش‌آموز یا والد باید وارد شود');
            setLoading(false);
            return;
          }
        }
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role,
          phoneToSend,
          formData.studentPhone,
          formData.parentPhone
        );
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Auth Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          {/* Decorative Top Bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'ورود به حساب کاربری' : 'ثبت نام'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'به دبیرستان معراج خوش آمدید' : 'حساب کاربری جدید ایجاد کنید'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="animate-fade-in-up">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
              )}

              {!isLogin && formData.role !== 'student' && (
                <div className="animate-fade-in-up animation-delay-150">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    placeholder="شماره تماس خود را وارد کنید"
                  />
                </div>
              )}

              {!isLogin && (
                <>
                  <div className="animate-fade-in-up animation-delay-200">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      نقش
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleSelectChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                    >
                      <option value="user">کاربر عادی</option>
                      <option value="student">دانش‌آموز</option>
                      <option value="parent">والد دانش‌آموز</option>
                    </select>
                  </div>

                  {formData.role === 'student' && (
                    <>
                      <div className="animate-fade-in-up animation-delay-400">
                        <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          شماره دانش‌آموز (حداقل یکی از این یا شماره والد الزامی است)
                        </label>
                        <input
                          type="tel"
                          id="studentPhone"
                          name="studentPhone"
                          value={formData.studentPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          placeholder="شماره موبایل دانش‌آموز را وارد کنید"
                        />
                      </div>

                      <div className="animate-fade-in-up animation-delay-500">
                        <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          شماره والد (حداقل یکی از این یا شماره دانش‌آموز الزامی است)
                        </label>
                        <input
                          type="tel"
                          id="parentPhone"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                          placeholder="شماره موبایل والد را وارد کنید"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="animate-fade-in-up animation-delay-300">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>

              <div className="animate-fade-in-up animation-delay-400">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                  placeholder="رمز عبور خود را وارد کنید"
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
                    در حال پردازش...
                  </div>
                ) : (
                  isLogin ? 'ورود' : 'ثبت نام'
                )}
              </button>
            </form>

            {/* Toggle Form */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    phone: '',
                    role: 'user',
                    studentPhone: '',
                    parentPhone: ''
                  });
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {isLogin ? 'حساب کاربری ندارید؟ ثبت نام کنید' : 'قبلاً ثبت نام کرده‌اید؟ وارد شوید'}
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-emerald-300 rounded-full opacity-30 animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Auth; 