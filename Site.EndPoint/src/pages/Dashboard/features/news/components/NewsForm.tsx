import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { News, NewsFormData } from '../types';
import { API_URL } from '../../../../../constants';
import { NEWS_CATEGORIES } from '../../../../Dashboard/constants';
import { useAuth } from '../../../../../contexts/AuthContext';

interface NewsFormProps {
  news?: News;
  onSubmit: (formData: NewsFormData) => Promise<boolean>;
  onCancel: () => void;
  saving: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({ news, onSubmit, onCancel, saving }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    category: 'اخبار مدرسه',
    description: '',
    slug: '',
    author: user?.fullName || '',
    tags: [],
    isPublished: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (news) {
      console.log('Loading news into form:', news);
      setFormData({
        id: news._id,
        title: news.title,
        content: news.content,
        category: news.category || 'اخبار مدرسه',
        description: news.description || '',
        slug: news.slug || '',
        author: news.author || user?.fullName || '',
        tags: news.tags || [],
        isPublished: news.isPublished !== false,
      });
      if (news.image) {
        const fullImageUrl = news.image.startsWith('http') 
          ? news.image 
          : `${API_URL}${news.image}`;
        console.log('Setting image preview to:', fullImageUrl);
        setImagePreview(fullImageUrl);
      }
    }
  }, [news, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
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

    if (!formData.title || !formData.content || !formData.category) {
      setError('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      navigate('/dashboard/news');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{news ? 'ویرایش خبر' : 'افزودن خبر جدید'}</h2>
      
      {error && (
        <div className="error-state">
          <p className="error-message">{error}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">عنوان خبر</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="عنوان خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug">نامک (اختیاری)</label>
        <input
          id="slug"
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="نامک خبر را وارد کنید (در صورت خالی بودن، از عنوان خبر ساخته می‌شود)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">توضیحات کوتاه</label>
        <input
          id="description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="توضیحات کوتاه خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">متن کامل خبر</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="متن کامل خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">دسته‌بندی</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {NEWS_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="author">نویسنده</label>
        <input
          id="author"
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="نام نویسنده را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">برچسب‌ها</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={formData.tags?.join(', ') || ''}
          onChange={handleTagsChange}
          placeholder="برچسب‌ها را با کاما جدا کنید"
        />
      </div>

      <div className="form-group">
        <div className="checkbox-label">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isPublished">منتشر شود</label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">تصویر خبر</label>
        <div className="image-upload">
          <input
            id="image"
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="image-upload-input"
            required={!news}
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
              src={imagePreview}
              alt="Preview"
              className="table-image"
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '200px' }}
              onError={(e) => {
                console.error('Error loading image:', imagePreview);
                e.currentTarget.src = `${API_URL}${imagePreview}`;
              }}
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={saving}
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-submit"
        >
          {saving ? 'در حال ذخیره...' : news ? 'ویرایش خبر' : 'ذخیره'}
        </button>
      </div>
    </form>
  );
};

export default NewsForm; 