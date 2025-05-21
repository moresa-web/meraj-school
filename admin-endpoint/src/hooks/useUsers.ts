import { useState } from 'react';
import { api } from '@/lib/api';

export interface User {
  _id?: string;
  id: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: string;
  studentName?: string;
  studentPhone?: string;
  parentPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  _id?: string;
  fullName?: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  studentName?: string;
  studentPhone?: string;
  parentPhone?: string;
}

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<User[]>('/api/users');
      return response.data.map(u => ({ ...u, id: u._id || u.id }));
    } catch (err) {
      setError('خطا در دریافت لیست کاربران');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<User>(`/api/users/${id}`);
      const u = response.data;
      return { ...u, id: u._id || u.id };
    } catch (err) {
      setError('خطا در دریافت اطلاعات کاربر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: UserFormData) => {
    try {
      setLoading(true);
      setError(null);
      const payload: any = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password
      };
      if (data.role === 'student') {
        payload.studentName = data.fullName;
        payload.studentPhone = data.studentPhone;
        payload.parentPhone = data.parentPhone;
      }
      const response = await api.post<User>('/api/users', payload);
      return response.data;
    } catch (err) {
      setError('خطا در ایجاد کاربر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: UserFormData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put<User>(`/api/users/${id}`, data);
      return response.data;
    } catch (err) {
      setError('خطا در ویرایش کاربر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/users/${id}`);
    } catch (err) {
      setError('خطا در حذف کاربر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
} 