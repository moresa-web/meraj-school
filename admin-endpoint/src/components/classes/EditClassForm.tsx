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
import { FiUpload, FiX } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface EditClassFormProps {
  classId: string;
  initialData: ClassFormData;
  onSubmit: (data: ClassFormData) => Promise<void>;
  isSubmitting: boolean;
}

const faToEnDigits = (str: string) =>
  str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

const convertToGregorian = (persianDate: string) => {
  if (!persianDate) return '';
  
  try {
    // تبدیل اعداد فارسی به انگلیسی
    const englishDate = faToEnDigits(persianDate);
    console.log('English date:', englishDate);
    
    // تبدیل تاریخ شمسی به میلادی
    const [jy, jm, jd] = englishDate.split('/').map(Number);
    console.log('Jalali components:', { jy, jm, jd });
    
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    console.log('Gregorian components:', { gy, gm, gd });
    
    const result = `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
    console.log('Final result:', result);
    
    return result;
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
  console.log('EditClassForm received initialData:', initialData);
  
  
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
    console.log('Setting form data from initialData:', initialData);
    if (initialData) {
      setFormData(initialData);
      if (initialData.image) {
        setImagePreview(`${API_URL}${initialData.image}`);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    console.log('Handling change for field:', name, 'with value:', value);
    
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
    console.log('Handling date change for field:', field, 'with date:', date);
    if (date) {
      const persianDate = date.format('YYYY/MM/DD');
      console.log('Converted to Persian date:', persianDate);
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
      // تبدیل تاریخ‌ها به فرمت میلادی
      const startDateGregorian = convertToGregorian(formData.startDate);
      const endDateGregorian = convertToGregorian(formData.endDate);
      
      console.log('Form data before conversion:', formData);
      console.log('Converted dates:', {
        startDate: startDateGregorian,
        endDate: endDateGregorian
      });
      
      // ایجاد یک آبجکت برای ارسال به API
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

      // اگر تصویر جدیدی آپلود شده باشد، آن را به FormData اضافه می‌کنیم
      const formDataToSend = new FormData();
      Object.entries(dataToSend).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // لاگ کردن داده‌های ارسالی
      console.log('Sending form data:', {
        data: dataToSend,
        hasImageFile: !!imageFile,
        hasExistingImage: !!formData.image
      });

      await onSubmit(formDataToSend as any);
      toast.success('کلاس با موفقیت به‌روزرسانی شد');
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'خطا در به‌روزرسانی کلاس');
    }
  };

  const inputClass = "mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const formGroupClass = "relative";

  console.log('Current form data:', formData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            ظرفیت کلاس
          </label>
          <div className="relative">
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
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
              required
              min="0"
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
              onChange={(date) => {
                handleDateChange('startDate', date);
                return false;
              }}
              format="YYYY/MM/DD"
              inputClass={`${inputClass} pr-10`}
              containerClassName="w-full"
              placeholder="تاریخ شروع را انتخاب کنید"
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
              onChange={(date) => {
                handleDateChange('endDate', date);
                return false;
              }}
              format="YYYY/MM/DD"
              inputClass={`${inputClass} pr-10`}
              containerClassName="w-full"
              placeholder="تاریخ پایان را انتخاب کنید"
            />
            <CalendarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="schedule" className={labelClass}>
          برنامه زمانی
        </label>
        <div className="relative">
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            required
            placeholder="برنامه زمانی کلاس را وارد کنید"
            className={`${inputClass} pr-10`}
          />
          <CalendarIcon className="absolute right-3 top-[14px] text-gray-400 w-5 h-5" />
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
          required
          rows={4}
          placeholder="توضیحات کلاس را وارد کنید"
          className={inputClass}
        />
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <label htmlFor="image" className={`${labelClass} flex items-center gap-2`}>
          <PhotoIcon className="w-5 h-5 text-gray-600" />
          تصویر کلاس
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
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
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
          کلاس فعال است
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              در حال به‌روزرسانی...
            </div>
          ) : (
            'به‌روزرسانی کلاس'
          )}
        </button>
      </div>
    </form>
  );
} 