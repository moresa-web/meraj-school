import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    if (data.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
  } catch (error) {
    // می‌توانید لاگ بگذارید یا نادیده بگیرید
  }
  return config;
}); 