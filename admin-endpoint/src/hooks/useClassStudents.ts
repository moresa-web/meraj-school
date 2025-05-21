import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Student {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  registeredAt: string;
}

export function useClassStudents(classId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get(`/api/classes/${classId}/students`);
        setStudents(response.data);
      } catch (err) {
        setError('خطا در دریافت لیست دانش‌آموزان');
        console.error('Error fetching students:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchStudents();
    }
  }, [classId]);

  return { students, isLoading, error };
} 