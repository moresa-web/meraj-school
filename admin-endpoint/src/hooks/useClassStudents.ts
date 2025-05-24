import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Student, StudentFormData } from '@/types/student';
import { toast } from 'react-hot-toast';

export function useClassStudents(classId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) {
        setStudents([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<Student[]>(`/api/classes/${classId}/students`);
        setStudents(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'خطا در دریافت لیست دانش‌آموزان';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const addStudent = async (studentData: StudentFormData) => {
    try {
      const response = await api.post<Student>(`/api/classes/${classId}/students`, studentData);
      setStudents(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'خطا در اضافه کردن دانش‌آموز';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateStudent = async (studentId: string, studentData: Partial<StudentFormData>) => {
    try {
      const response = await api.put<Student>(`/api/classes/${classId}/students/${studentId}`, studentData);
      setStudents(prev => prev.map(student => 
        student._id === studentId ? response.data : student
      ));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'خطا در به‌روزرسانی اطلاعات دانش‌آموز';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      await api.delete(`/api/classes/${classId}/students/${studentId}`);
      setStudents(prev => prev.filter(student => student._id !== studentId));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'خطا در حذف دانش‌آموز';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    students,
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent
  };
} 