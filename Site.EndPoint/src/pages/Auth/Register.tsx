import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    studentPhone: '',
    parentPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
      toast.success('ثبت‌نام با موفقیت انجام شد');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.15)_0%,transparent_50%),radial-gradient(circle_at_40%_60%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,rgba(255,255,255,0.3),transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.2),transparent),radial-gradient(1px_1px_at_90px_40px,rgba(255,255,255,0.4),transparent),radial-gradient(1px_1px_at_130px_80px,rgba(255,255,255,0.3),transparent),radial-gradient(2px_2px_at_160px_30px,rgba(255,255,255,0.2),transparent)] bg-repeat bg-[length:200px_100px] animate-pulse"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                ثبت نام
              </h2>
              <p className="text-slate-300">
                حساب کاربری جدید ایجاد کنید
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg animate-shake backdrop-blur-sm">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                  placeholder="نام خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                  رمز عبور
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                  placeholder="رمز عبور خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-200 mb-2">
                  نوع کاربر
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="student">دانش‌آموز</option>
                </select>
              </div>

              {formData.role === 'student' ? (
                <>
                  <div>
                    <label htmlFor="studentPhone" className="block text-sm font-medium text-slate-200 mb-2">
                      شماره تماس دانش‌آموز
                    </label>
                    <input
                      type="tel"
                      id="studentPhone"
                      name="studentPhone"
                      value={formData.studentPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                      placeholder="شماره تماس دانش‌آموز"
                    />
                  </div>

                  <div>
                    <label htmlFor="parentPhone" className="block text-sm font-medium text-slate-200 mb-2">
                      شماره تماس والد
                    </label>
                    <input
                      type="tel"
                      id="parentPhone"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                      placeholder="شماره تماس والد"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                    placeholder="شماره تماس خود را وارد کنید"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-300">
                قبلاً ثبت نام کرده‌اید؟{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
                >
                  وارد شوید
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 