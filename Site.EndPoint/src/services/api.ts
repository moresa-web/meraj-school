import axios from 'axios';

// تنظیمات پایه axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://mohammadrezasardashti.ir/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن توکن به همه درخواست‌ها
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// مدیریت خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // اگر توکن منقضی شده باشد، کاربر را به صفحه لاگین هدایت می‌کنیم
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 