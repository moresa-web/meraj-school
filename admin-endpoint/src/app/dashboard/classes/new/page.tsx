'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    teacher: '',
    schedule: '',
    description: '',
    price: '',
    level: '',
    category: '',
    capacity: '',
    startDate: '',
    endDate: '',
    isActive: 'true'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // بررسی فیلدهای الزامی
      const requiredFields = ['title', 'teacher', 'schedule', 'description', 'price', 'level', 'category', 'capacity', 'startDate', 'endDate'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        setError(`لطفاً فیلدهای زیر را پر کنید: ${missingFields.join(', ')}`);
        return;
      }

      if (!image) {
        setError('لطفاً تصویر کلاس را انتخاب کنید');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('image', image);
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      console.log('Form Data being sent:', {
        image: image?.name,
        ...Object.fromEntries(formDataToSend.entries())
      });

      const response = await axios.post('/api/classes', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        router.push('/dashboard/classes');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error creating class:', err);
      setError('خطا در ایجاد کلاس');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: any) => {
    if (date) {
      const newDate = new Date(date.toDate());
      setFormData(prev => ({ ...prev, [name]: newDate.toISOString() }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="border-[#059669]">
        <CardHeader className="bg-[#059669] text-white">
          <CardTitle>افزودن کلاس جدید</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-[#064e3b]">
                  عنوان کلاس
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="teacher" className="text-sm font-medium text-[#064e3b]">
                  نام مدرس
                </label>
                <Input
                  id="teacher"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-[#064e3b]">
                  دسته‌بندی
                </label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="schedule" className="text-sm font-medium text-[#064e3b]">
                  برنامه زمانی
                </label>
                <Input
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-[#064e3b]">
                  قیمت (تومان)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="capacity" className="text-sm font-medium text-[#064e3b]">
                  ظرفیت
                </label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium text-[#064e3b]">
                  سطح
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange('level', value)}
                >
                  <SelectTrigger className="border-[#059669] focus:ring-[#059669]">
                    <SelectValue placeholder="انتخاب سطح" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مقدماتی">مقدماتی</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="پیشرفته">پیشرفته</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="isActive" className="text-sm font-medium text-[#064e3b]">
                  وضعیت
                </label>
                <Select
                  value={formData.isActive}
                  onValueChange={(value) => handleSelectChange('isActive', value)}
                >
                  <SelectTrigger className="border-[#059669] focus:ring-[#059669]">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">فعال</SelectItem>
                    <SelectItem value="false">غیرفعال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-[#064e3b]">
                  تاریخ شروع
                </label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  onChange={(date) => handleDateChange('startDate', date)}
                  className="w-full border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-[#064e3b]">
                  تاریخ پایان
                </label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  onChange={(date) => handleDateChange('endDate', date)}
                  className="w-full border-[#059669] focus:ring-[#059669]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium text-[#064e3b]">
                  تصویر کلاس
                </label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="border-[#059669] focus:ring-[#059669]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-[#064e3b]">
                توضیحات
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="border-[#059669] focus:ring-[#059669]"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/classes')}
                className="border-[#059669] text-[#059669] hover:bg-[#059669] hover:text-white"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#059669] hover:bg-[#064e3b] text-white"
              >
                {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 