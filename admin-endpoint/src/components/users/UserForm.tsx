import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserFormData } from '@/hooks/useUsers';

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  isSubmitting: boolean;
}

export default function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: initialData,
  });

  const role = watch('role');

  const handleFormSubmit = (data: UserFormData) => {
    // اگر نقش دانش‌آموز بود، studentName را برابر fullName قرار بده
    if (data.role === 'student') {
      data.studentName = data.fullName;
      // اگر هر دو شماره خالی بود، خطا بده
      if (!data.studentPhone && !data.parentPhone) {
        alert('حداقل یکی از شماره‌های دانش‌آموز یا والد الزامی است');
        return;
      }
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          نام و نام خانوادگی
        </label>
        <input
          type="text"
          id="fullName"
          {...register('fullName', { required: 'نام و نام خانوادگی الزامی است' })}
          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      {/* فقط برای نقش‌های غیر دانش‌آموز */}
      {role !== 'student' && (
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            شماره تماس
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { required: 'شماره تماس الزامی است', pattern: { value: /^09[0-9]{9}$/, message: 'فرمت شماره تماس نامعتبر است' } })}
            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      )}

      {/* فقط برای دانش‌آموز */}
      {role === 'student' && (
        <>
          <div>
            <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-1">
              شماره دانش‌آموز (حداقل یکی از این یا شماره والد الزامی است)
            </label>
            <input
              type="tel"
              id="studentPhone"
              {...register('studentPhone', { pattern: { value: /^09[0-9]{9}$/, message: 'فرمت شماره دانش‌آموز نامعتبر است' } })}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
              placeholder="شماره موبایل دانش‌آموز را وارد کنید"
            />
            {errors.studentPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.studentPhone.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
              شماره والد (حداقل یکی از این یا شماره دانش‌آموز الزامی است)
            </label>
            <input
              type="tel"
              id="parentPhone"
              {...register('parentPhone', { pattern: { value: /^09[0-9]{9}$/, message: 'فرمت شماره والد نامعتبر است' } })}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
              placeholder="شماره موبایل والد را وارد کنید"
            />
            {errors.parentPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.parentPhone.message}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          ایمیل
        </label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'ایمیل الزامی است',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'ایمیل نامعتبر است',
            },
          })}
          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {!initialData && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            رمز عبور
          </label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'رمز عبور الزامی است',
              minLength: {
                value: 6,
                message: 'رمز عبور باید حداقل 6 کاراکتر باشد',
              },
            })}
            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          نقش
        </label>
        <select
          id="role"
          {...register('role', { required: 'نقش الزامی است' })}
          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200"
        >
          <option value="user">کاربر عادی</option>
          <option value="admin">مدیر</option>
          <option value="student">دانش‌آموز</option>
          <option value="parent">والد دانش‌آموز</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 rounded-lg text-white font-medium ${
            isSubmitting
              ? 'bg-emerald-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow'
          } transition-colors duration-200`}
        >
          {isSubmitting ? 'در حال ذخیره...' : initialData ? 'ویرایش' : 'ایجاد'}
        </button>
      </div>
    </form>
  );
} 