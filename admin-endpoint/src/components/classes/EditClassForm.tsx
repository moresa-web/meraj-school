'use client';

import React, { useState, useEffect } from 'react';
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
import { Upload, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface EditClassFormProps {
  classId: string;
  initialData: ClassFormData;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const faToEnDigits = (str: string) =>
  str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

const convertToGregorian = (persianDate: string) => {
  if (!persianDate) return '';
  
  try {
    const englishDate = faToEnDigits(persianDate);
    const [jy, jm, jd] = englishDate.split('/').map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return '';
  }
};

export default function EditClassForm({
  classId,
  initialData,
  onSubmit,
  isSubmitting
}: EditClassFormProps) {
  const router = useRouter();
  const { updateClass } = useClasses();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    teacher: '',
    level: 'مقدماتی',
    category: '',
    capacity: 0,
    price: 0,
    startDate: '',
    endDate: '',
    schedule: '',
    description: '',
    image: '',
    isActive: false
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (typeof initialData.image === 'string') {
        setImagePreview(`${API_URL}${initialData.image}`);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: any) => {
    if (date) {
      const persianDate = date.format('YYYY/MM/DD');
      setFormData(prev => ({
        ...prev,
        [field]: persianDate,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const startDateGregorian = convertToGregorian(formData.startDate);
      const endDateGregorian = convertToGregorian(formData.endDate);
      
      const dataToSend = {
        title: formData.title,
        teacher: formData.teacher,
        level: formData.level,
        category: formData.category,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        startDate: startDateGregorian,
        endDate: endDateGregorian,
        schedule: formData.schedule,
        description: formData.description,
        isActive: formData.isActive
      };

      const formDataToSend = new FormData();
      Object.entries(dataToSend).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (typeof formData.image === 'string') {
        formDataToSend.append('image', formData.image);
      }

      await onSubmit(formDataToSend);
      toast.success('کلاس با موفقیت به‌روزرسانی شد');
    } catch (err: any) {
      setError(err.message || 'خطا در به‌روزرسانی کلاس');
    }
  };

  const inputClass = "mt-1 block w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200 text-sm md:text-base";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const formGroupClass = "relative";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 p-4 md:p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center text-sm md:text-base">
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
          <AcademicCapIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
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
          <UserCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <TagIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
            <UserGroupIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
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
            <CurrencyDollarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
              format="YYYY/MM/DD"
              inputClass={`${inputClass} pr-10`}
              containerClassName="w-full"
              placeholder="تاریخ شروع را انتخاب کنید"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
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
              format="YYYY/MM/DD"
              inputClass={`${inputClass} pr-10`}
              containerClassName="w-full"
              placeholder="تاریخ پایان را انتخاب کنید"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="schedule" className={labelClass}>
          زمان کلاس
        </label>
        <div className="relative">
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
            placeholder="زمان کلاس را وارد کنید (مثال: دوشنبه و چهارشنبه 16:00-18:00)"
            className={`${inputClass} pr-10`}
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
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
          placeholder="توضیحات کلاس را وارد کنید..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 md:p-6 bg-gray-50">
        <label htmlFor="image" className={`${labelClass} flex items-center gap-2`}>
          <PhotoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          تصویر کلاس
        </label>
        <div className="mt-1 flex justify-center px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative w-full h-40 md:h-48 mb-4">
                <img
                  src={imagePreview}
                  alt="تصویر کلاس"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
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
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="mr-2 block text-sm text-gray-700">
          فعال بودن کلاس
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm md:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm md:text-base font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              در حال ذخیره...
            </span>
          ) : (
            'ذخیره تغییرات'
          )}
        </button>
      </div>
    </form>
  );
} 