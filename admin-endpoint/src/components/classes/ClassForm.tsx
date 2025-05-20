'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateObject from 'react-date-object';
import { ClassFormData } from '@/types/class';
import { useClasses } from '@/hooks/useClasses';
import { AcademicCapIcon, UserCircleIcon, PhotoIcon, TagIcon, CalendarIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import jalaali from 'jalaali-js';
import { toast } from 'react-hot-toast';

interface ClassFormProps {
  initialData?: Partial<ClassFormData>;
  onSubmit?: (data: ClassFormData, image: File | null) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const faToEnDigits = (str: string) =>
  str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

const convertToGregorian = (persianDate: string) => {
  if (!persianDate) return '';
  const englishDate = faToEnDigits(persianDate);
  const [jy, jm, jd] = englishDate.split('/').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
};

const todayPersian = new DateObject({ calendar: persian, locale: persian_fa }).format('YYYY/MM/DD');

export default function ClassForm({ initialData = {}, onSubmit, loading, submitLabel = 'ذخیره' }: ClassFormProps) {
  const router = useRouter();
  const { createClass, updateClass } = useClasses();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    teacher: '',
    capacity: 0,
    price: 0,
    startDate: todayPersian,
    endDate: todayPersian,
    schedule: '',
    description: '',
    level: 'مقدماتی',
    category: '',
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.image && typeof initialData.image === 'string') {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value,
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY/MM/DD') : '',
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const startDateGregorian = convertToGregorian(formData.startDate);
      const endDateGregorian = convertToGregorian(formData.endDate);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('teacher', formData.teacher);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('capacity', formData.capacity.toString());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('startDate', startDateGregorian);
      formDataToSend.append('endDate', endDateGregorian);
      formDataToSend.append('schedule', formData.schedule);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isActive', formData.isActive.toString());

      if (image) {
        formDataToSend.append('image', image);
      }

      console.log('Submitting form data:', Object.fromEntries(formDataToSend));
      await onSubmit(formDataToSend as any);
      toast.success('کلاس با موفقیت ایجاد شد');
    } catch (err: any) {
      setError(err.message || 'خطا در ایجاد کلاس');
      console.error('Error creating class:', err);
    }
  };

  // استایل‌های مشابه NewsForm
  const inputClass = "mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const formGroupClass = "relative";
  
  const isSubmitting = loading ?? internalLoading;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="class-form">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center mb-4">
          {error}
        </div>
      )}

      <div className={formGroupClass}>
        <label htmlFor="title" className={labelClass}>
          عنوان کلاس
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="عنوان کلاس را وارد کنید"
            className={`${inputClass} pr-10`}
          />
          <AcademicCapIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="teacher" className={labelClass}>
          مدرس
        </label>
        <div className="relative">
          <input
            type="text"
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            required
            placeholder="نام مدرس را وارد کنید"
            className={`${inputClass} pr-10`}
          />
          <UserCircleIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={formGroupClass}>
          <label htmlFor="level" className={labelClass}>
            سطح کلاس
          </label>
          <div className="relative">
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="مقدماتی">مقدماتی</option>
              <option value="متوسط">متوسط</option>
              <option value="پیشرفته">پیشرفته</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className={formGroupClass}>
          <label htmlFor="category" className={labelClass}>
            دسته‌بندی
          </label>
          <div className="relative">
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="دسته‌بندی کلاس را وارد کنید"
              className={`${inputClass} pr-10`}
            />
            <TagIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={formGroupClass}>
          <label htmlFor="capacity" className={labelClass}>
            ظرفیت
          </label>
          <div className="relative">
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min={1}
              required
              placeholder="ظرفیت کلاس را وارد کنید"
              className={`${inputClass} pr-10`}
            />
            <UserGroupIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className={formGroupClass}>
          <label htmlFor="price" className={labelClass}>
            قیمت (تومان)
          </label>
          <div className="relative">
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              required
              placeholder="قیمت کلاس را وارد کنید"
              className={`${inputClass} pr-10`}
            />
            <CurrencyDollarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={formGroupClass}>
          <label htmlFor="startDate" className={labelClass}>
            تاریخ شروع
          </label>
          <div className="relative">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              value={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              inputClass={inputClass + ' w-full pr-10'}
              format="YYYY/MM/DD"
              editable={false}
              required
            />
            <CalendarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className={formGroupClass}>
          <label htmlFor="endDate" className={labelClass}>
            تاریخ پایان
          </label>
          <div className="relative">
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              value={formData.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              inputClass={inputClass + ' w-full pr-10'}
              format="YYYY/MM/DD"
              editable={false}
              required
            />
            <CalendarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="schedule" className={labelClass}>
          روزهای برگزاری
        </label>
        <div className="relative">
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
            placeholder="روزهای برگزاری کلاس را وارد کنید"
            className={`${inputClass} pr-10`}
          />
          <CalendarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <label htmlFor="image" className={`${labelClass} flex items-center gap-2`}>
          <PhotoIcon className="w-5 h-5 text-gray-600" />
          تصویر کلاس
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative w-full h-48 mb-4">
                <img
                  src={imagePreview}
                  alt="تصویر کلاس"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4 flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                  >
                    <span>آپلود تصویر</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pr-1">یا فایل را اینجا رها کنید</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF تا 10MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="description" className={labelClass}>
          توضیحات
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="توضیحات کلاس را وارد کنید"
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
        />
        <label htmlFor="isActive" className="mr-2 text-sm text-gray-700">
          فعال بودن کلاس
        </label>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 rounded-lg text-white font-medium ${isSubmitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow'} transition-colors duration-200`}
        >
          {isSubmitting ? 'در حال ثبت...' : submitLabel}
        </button>
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
          onClick={() => router.back()}
        >
          انصراف
        </button>
      </div>
    </form>
  );
} 