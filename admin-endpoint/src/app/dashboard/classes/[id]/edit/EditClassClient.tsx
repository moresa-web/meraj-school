'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Class } from '@/types/class';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface EditClassClientProps {
  id: string;
}

export default function EditClassClient({ id }: EditClassClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Class>>({
    title: '',
    description: '',
    teacher: '',
    schedule: '',
    startDate: '',
    endDate: '',
    capacity: 0,
    price: 0,
    category: '',
    level: '',
    image: '',
    isActive: true
  });

  useEffect(() => {
    fetchClass();
  }, [id]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/classes/${id}`);
      if (response.data.success) {
        const classData = response.data.data;
        setFormData({
          title: classData.title,
          description: classData.description,
          teacher: classData.teacher,
          schedule: classData.schedule,
          startDate: classData.startDate,
          endDate: classData.endDate,
          capacity: classData.capacity,
          price: classData.price,
          category: classData.category,
          level: classData.level,
          image: classData.image,
          isActive: classData.isActive,
          views: classData.views,
          likes: classData.likes,
          enrolledStudents: classData.enrolledStudents
        });
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching class:', err);
      setError('خطا در دریافت اطلاعات کلاس');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await axios.put(`/api/classes/${id}`, {
        title: formData.title,
        description: formData.description,
        teacher: formData.teacher,
        schedule: formData.schedule,
        startDate: formData.startDate,
        endDate: formData.endDate,
        capacity: formData.capacity,
        price: formData.price,
        category: formData.category,
        level: formData.level,
        image: formData.image,
        isActive: formData.isActive
      });
      
      if (response.data.success) {
        router.push('/dashboard/classes');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error updating class:', err);
      setError('خطا در به‌روزرسانی کلاس');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: any) => {
    setFormData(prev => ({ ...prev, [name]: date.format() }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="border-[#059669]">
        <CardHeader className="bg-[#059669] text-white">
          <CardTitle>ویرایش کلاس</CardTitle>
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
                <label htmlFor="level" className="text-sm font-medium text-[#064e3b]">
                  سطح کلاس
                </label>
                <Select
                  value={formData.level}
                  onValueChange={(value: string) => handleSelectChange('level', value)}
                >
                  <SelectTrigger className="border-[#059669] focus:ring-[#059669]">
                    <SelectValue placeholder="انتخاب سطح" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مبتدی">مبتدی</SelectItem>
                    <SelectItem value="متوسط">متوسط</SelectItem>
                    <SelectItem value="پیشرفته">پیشرفته</SelectItem>
                  </SelectContent>
                </Select>
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
                <label htmlFor="startDate" className="text-sm font-medium text-[#064e3b]">
                  تاریخ شروع
                </label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  className="w-full border-[#059669] focus:ring-[#059669]"
                  inputClass="w-full px-3 py-2 border rounded-md"
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
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  className="w-full border-[#059669] focus:ring-[#059669]"
                  inputClass="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="capacity" className="text-sm font-medium text-[#064e3b]">
                  ظرفیت کلاس
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
                <label htmlFor="isActive" className="text-sm font-medium text-[#064e3b]">
                  وضعیت کلاس
                </label>
                <Select
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value: string) => handleSelectChange('isActive', value === "true")}
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
                rows={4}
                className="border-[#059669] focus:ring-[#059669]"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
                className="border-[#059669] text-[#059669] hover:bg-[#059669] hover:text-white"
              >
                انصراف
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-[#059669] hover:bg-[#064e3b]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  'ذخیره تغییرات'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 