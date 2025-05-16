import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClasses } from '../hooks/useClasses';
import { Class, ClassFormData } from '../types';
import LoadingState from '@/components/LoadingState';
import { API_URL } from '../../../../../constants';

interface ClassFormProps {
  classItem?: Class;
  onSubmit: (formData: ClassFormData) => Promise<boolean>;
  onCancel: () => void;
  saving: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({ classItem, onSubmit, onCancel, saving }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<ClassFormData>({
    title: '',
    description: '',
    teacher: '',
    schedule: '',
    capacity: 0,
    price: 0,
    level: 'مقدماتی',
    category: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classItem) {
      setFormData({
        title: classItem.title,
        description: classItem.description,
        teacher: classItem.teacher,
        schedule: classItem.schedule,
        capacity: classItem.capacity,
        price: classItem.price,
        level: classItem.level,
        category: classItem.category,
        startDate: classItem.startDate,
        endDate: classItem.endDate,
        isActive: classItem.isActive
      });
      if (classItem.image) {
        setImagePreview(classItem.image);
      }
    }
  }, [classItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.teacher || !formData.schedule) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (formData.capacity <= 0 || formData.price <= 0) {
      setError('ظرفیت و قیمت باید بزرگتر از صفر باشند');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      navigate('/dashboard/classes');
    }
  };

  return (
    <div className="class-form">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {classItem ? 'ویرایش کلاس' : 'افزودن کلاس جدید'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            عنوان
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            توضیحات
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
            استاد
          </label>
          <input
            type="text"
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
            زمان برگزاری
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              ظرفیت
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              قیمت (تومان)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            تصویر کلاس
          </label>
          <div className="image-upload">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="image-upload-input"
              required={!classItem}
            />
            <span className="image-upload-text">
              {imagePreview
                ? 'تصویر انتخاب شده'
                : 'برای آپلود تصویر کلیک کنید'}
            </span>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview.startsWith('http') ? imagePreview : `${API_URL}${imagePreview}`}
                alt="Preview"
                className="table-image"
                style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '200px' }}
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'در حال ذخیره...' : classItem ? 'بروزرسانی' : 'ذخیره'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm; 