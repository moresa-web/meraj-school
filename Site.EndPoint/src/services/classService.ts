import axios from 'axios';

export interface Class {
  id: string;
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
}

const API_URL = 'http://localhost:5000/api';

export const classService = {
  // دریافت لیست کلاس‌ها
  getClasses: async (params?: {
    category?: string;
    level?: string;
    search?: string;
    sortBy?: 'views' | 'likes' | 'price';
  }) => {
    const response = await axios.get(`${API_URL}/classes`, { params });
    return response.data;
  },

  // دریافت جزئیات یک کلاس
  getClassById: async (id: string) => {
    const response = await axios.get(`${API_URL}/classes/${id}`);
    return response.data;
  },

  // لایک کردن یک کلاس
  likeClass: async (id: string) => {
    const response = await axios.post(`${API_URL}/classes/${id}/like`);
    return response.data;
  }
}; 