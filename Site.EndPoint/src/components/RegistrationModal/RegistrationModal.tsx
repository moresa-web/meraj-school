import React from 'react';
import { useTranslation } from 'react-i18next';
import { FieldError } from '../FieldError/FieldError';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ClassInfo {
  _id: string;
  title: string;
  teacher: string;
  schedule: string;
  description: string;
  price: number;
  level: string;
  image: string;
  category: string;
  views: number;
  likes: number;
  capacity: number;
  enrolledStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  likedBy: string[];
  registrations?: string[];
}

interface RegistrationForm {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ClassInfo;
  onSubmit: (formData: RegistrationForm) => void;
  formData: RegistrationForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  course,
  onSubmit,
  formData,
  onInputChange,
  fieldErrors
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 transform transition-all duration-300 animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">ثبت‌نام در کلاس</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Course Info */}
        <div className="bg-emerald-50 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <img
              src={`${API_URL.replace('/api', '')}${course.image}`}
              alt={course.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <svg className="w-5 h-5 ml-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{course.teacher}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 ml-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{course.schedule}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Name */}
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
              نام و نام خانوادگی دانش‌آموز
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.studentName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
              placeholder="نام و نام خانوادگی دانش‌آموز را وارد کنید"
            />
            {fieldErrors.studentName && <FieldError message={fieldErrors.studentName} />}
          </div>

          {/* Student Phone */}
          <div>
            <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-2">
              شماره موبایل دانش‌آموز
            </label>
            <input
              type="tel"
              id="studentPhone"
              name="studentPhone"
              value={formData.studentPhone}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.studentPhone ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
              placeholder="شماره موبایل دانش‌آموز را وارد کنید"
            />
            {fieldErrors.studentPhone && <FieldError message={fieldErrors.studentPhone} />}
          </div>

          {/* Parent Phone */}
          <div>
            <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
              شماره موبایل والدین
            </label>
            <input
              type="tel"
              id="parentPhone"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.parentPhone ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
              placeholder="شماره موبایل والدین را وارد کنید"
            />
            {fieldErrors.parentPhone && <FieldError message={fieldErrors.parentPhone} />}
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              پایه تحصیلی
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                fieldErrors.grade ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300`}
            >
              <option value="">پایه تحصیلی را انتخاب کنید</option>
              <option value="هفتم">هفتم</option>
              <option value="هشتم">هشتم</option>
              <option value="نهم">نهم</option>
              <option value="دهم">دهم</option>
              <option value="یازدهم">یازدهم</option>
              <option value="دوازدهم">دوازدهم</option>
            </select>
            {fieldErrors.grade && <FieldError message={fieldErrors.grade} />}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            ثبت‌نام در کلاس
          </button>
        </form>
      </div>
    </div>
  );
}; 