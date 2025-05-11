import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment-jalaali';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Class, ClassFormData } from '../types';
import { CLASS_LEVELS } from '../constants';
import type { DateObject } from 'react-multi-date-picker';

interface ClassFormProps {
  classItem?: Class;
  onSubmit: (formData: ClassFormData) => Promise<boolean>;
  onCancel: () => void;
  saving: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({ classItem, onSubmit, onCancel, saving }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    teacher: '',
    schedule: '',
    description: '',
    price: 0,
    level: 'مقدماتی',
    category: 'قرآن',
    capacity: 20,
    startDate: '',
    endDate: '',
    isActive: true,
    image: undefined
  });

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classItem) {
      setFormData({
        title: classItem.title,
        teacher: classItem.teacher,
        schedule: classItem.schedule,
        description: classItem.description,
        price: classItem.price,
        level: classItem.level,
        category: classItem.category,
        capacity: classItem.capacity,
        startDate: classItem.startDate,
        endDate: classItem.endDate,
        isActive: classItem.isActive,
        image: undefined
      });
      if (classItem.image && typeof classItem.image === 'string') {
        setPreviewImage(classItem.image);
      }
      
      if (classItem.startDate) {
        setSelectedStartDate(new Date(classItem.startDate));
      }
      
      if (classItem.endDate) {
        setSelectedEndDate(new Date(classItem.endDate));
      }
    }
  }, [classItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleStartDateChange = (date: DateObject | null) => {
    if (date) {
      const newDate = new Date(date.toDate());
      setSelectedStartDate(newDate);
      setFormData(prev => ({
        ...prev,
        startDate: newDate.toISOString().split('T')[0]
      }));
    } else {
      setSelectedStartDate(null);
      setFormData(prev => ({
        ...prev,
        startDate: ''
      }));
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    if (date) {
      const newDate = new Date(date.toDate());
      setSelectedEndDate(newDate);
      setFormData(prev => ({
        ...prev,
        endDate: newDate.toISOString().split('T')[0]
      }));
    } else {
      setSelectedEndDate(null);
      setFormData(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.startDate) {
        throw new Error('تاریخ شروع الزامی است');
      }
      if (!formData.endDate) {
        throw new Error('تاریخ پایان الزامی است');
      }

      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          title: '',
          teacher: '',
          schedule: '',
          description: '',
          price: 0,
          level: 'مقدماتی',
          category: 'قرآن',
          capacity: 20,
          startDate: '',
          endDate: '',
          isActive: true,
          image: undefined
        });
        setPreviewImage(null);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        navigate('/dashboard/classes');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ذخیره اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{classItem ? 'ویرایش کلاس' : 'افزودن کلاس جدید'}</h2>
      
      {error && (
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">عنوان کلاس</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="عنوان کلاس را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="teacher">نام استاد</label>
        <input
          id="teacher"
          type="text"
          name="teacher"
          value={formData.teacher}
          onChange={handleInputChange}
          placeholder="نام استاد را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="schedule">برنامه زمانی</label>
        <input
          id="schedule"
          type="text"
          name="schedule"
          value={formData.schedule}
          onChange={handleInputChange}
          placeholder="برنامه زمانی کلاس را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">قیمت (تومان)</label>
        <input
          id="price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="قیمت کلاس را وارد کنید"
          required
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="level">سطح کلاس</label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleInputChange}
          required
        >
          {CLASS_LEVELS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">دسته‌بندی</label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="دسته‌بندی کلاس را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">ظرفیت</label>
        <input
          id="capacity"
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          placeholder="ظرفیت کلاس را وارد کنید"
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="isActive">وضعیت</label>
        <select
          id="isActive"
          name="isActive"
          value={formData.isActive.toString()}
          onChange={handleInputChange}
        >
          <option value="true">فعال</option>
          <option value="false">غیرفعال</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">تاریخ شروع</label>
        <DatePicker
          value={selectedStartDate}
          onChange={handleStartDateChange}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          inputClass="w-full"
          containerClassName="w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">تاریخ پایان</label>
        <DatePicker
          value={selectedEndDate}
          onChange={handleEndDateChange}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          inputClass="w-full"
          containerClassName="w-full"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">توضیحات</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="توضیحات کلاس را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">تصویر کلاس</label>
        <div className="image-upload">
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-upload-input"
            required={!classItem}
          />
          <span className="image-upload-text">
            {formData.image instanceof File 
              ? formData.image.name 
              : previewImage
                ? 'تصویر فعلی'
                : 'برای آپلود تصویر کلیک کنید'}
          </span>
        </div>
        {previewImage && (
          <div className="mt-4">
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          انصراف
        </button>
        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'در حال ذخیره...' : (classItem ? 'ویرایش کلاس' : 'افزودن کلاس')}
        </button>
      </div>
    </form>
  );
};

export default ClassForm; 