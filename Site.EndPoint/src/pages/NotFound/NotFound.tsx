import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500 rounded-full blur-2xl animate-float animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500 rounded-full blur-xl animate-float animation-delay-400"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-500 rounded-full blur-2xl animate-float animation-delay-600"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* 404 Number */}
        <div className="animate-fade-in-up">
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="animate-fade-in-up animation-delay-200 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full border-2 border-gray-700">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up animation-delay-300">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            صفحه مورد نظر یافت نشد
          </h2>
        </div>

        {/* Description */}
        <div className="animate-fade-in-up animation-delay-400">
          <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-in-up animation-delay-600 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            بازگشت به صفحه اصلی
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-4 border-2 border-gray-600 text-base font-semibold rounded-xl text-gray-300 hover:text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* Additional Help */}
        <div className="animate-fade-in-up animation-delay-600 mt-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">نیاز به کمک دارید؟</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 ml-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                بررسی آدرس URL
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 ml-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                استفاده از منوی اصلی
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-4 h-4 ml-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                تماس با پشتیبانی
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;