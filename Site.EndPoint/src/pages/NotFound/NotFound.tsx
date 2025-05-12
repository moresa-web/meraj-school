import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  // این هوک فقط یک بار هنگام نمایش کامپوننت اجرا می‌شود
  useEffect(() => {
    // تنظیم status code به 404
    document.title = "404 - صفحه یافت نشد";
    
    // این روش برای برنامه‌های SPA بهینه است
    const originalStatus = document.querySelector('meta[name="status"]');
    if (originalStatus) {
      originalStatus.setAttribute('content', '404');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'status';
      meta.content = '404';
      document.head.appendChild(meta);
    }

    return () => {
      // پاکسازی در هنگام unmount کامپوننت
      const statusMeta = document.querySelector('meta[name="status"]');
      if (statusMeta) {
        statusMeta.setAttribute('content', '200');
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-emerald-600 animate-bounce">
            404
          </h1>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-emerald-200 rounded-full"></div>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up">
          صفحه مورد نظر یافت نشد
        </h2>
        <p className="text-gray-600 mb-8 animate-fade-in-up animation-delay-200">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>

        {/* Decorative Elements */}
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-200 rounded-full opacity-50 animate-pulse animation-delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-300 rounded-full opacity-50 animate-pulse animation-delay-600"></div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            بازگشت به صفحه اصلی
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-block px-8 py-3 bg-white text-emerald-600 font-semibold rounded-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* Floating Elements */}
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

export default NotFound;