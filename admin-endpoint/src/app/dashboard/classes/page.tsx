'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';

interface Class {
  _id: string;
  title: string;
  description: string;
  teacher: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledStudents: number;
  isActive: boolean;
  price: number;
  category: string;
  level: string;
  views: number;
  likes: number;
}

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/classes');
      if (response.data.success) {
        setClasses(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('خطا در دریافت لیست کلاس‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این کلاس اطمینان دارید؟')) return;
    
    try {
      const response = await axios.delete(`/api/classes/${id}`);
      if (response.data.success) {
        setClasses(classes.filter(c => c._id !== id));
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('خطا در حذف کلاس');
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const statusConfig = {
      true: { label: 'فعال', variant: 'success' },
      false: { label: 'غیرفعال', variant: 'secondary' }
    } as const;
    
    const config = statusConfig[isActive.toString() as keyof typeof statusConfig];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'مقدماتی': { label: 'مقدماتی', variant: 'info' },
      'متوسط': { label: 'متوسط', variant: 'warning' },
      'پیشرفته': { label: 'پیشرفته', variant: 'destructive' }
    } as const;
    
    const config = levelConfig[level as keyof typeof levelConfig];
    if (!config) {
      return <Badge variant="secondary">{level}</Badge>;
    }
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت کلاس‌ها</h1>
        <button
          onClick={() => router.push('/dashboard/classes/new')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          افزودن کلاس جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{classItem.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/classes/${classItem._id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(classItem._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(classItem.isActive)}
                {getLevelBadge(classItem.level)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{classItem.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">مدرس:</p>
                  <p>{classItem.teacher}</p>
                </div>
                <div>
                  <p className="font-semibold">دسته‌بندی:</p>
                  <p>{classItem.category}</p>
                </div>
                <div>
                  <p className="font-semibold">تاریخ شروع:</p>
                  <p>{new Date(classItem.startDate).toLocaleDateString('fa-IR')}</p>
                </div>
                <div>
                  <p className="font-semibold">تاریخ پایان:</p>
                  <p>{new Date(classItem.endDate).toLocaleDateString('fa-IR')}</p>
                </div>
                <div>
                  <p className="font-semibold">ظرفیت:</p>
                  <p>{classItem.enrolledStudents} / {classItem.capacity}</p>
                </div>
                <div>
                  <p className="font-semibold">قیمت:</p>
                  <p>{classItem.price.toLocaleString()} تومان</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 