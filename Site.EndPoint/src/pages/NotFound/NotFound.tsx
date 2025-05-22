import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-emerald-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-6">صفحه مورد نظر یافت نشد</h2>
        <p className="text-gray-600 mb-8">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
};

export default NotFound;