import React, { useState, useEffect } from 'react';
import { News, NewsFormData } from '../types';
import { NEWS_CATEGORIES } from '../constants';
import { useAuth } from '../../../contexts/AuthContext';

interface NewsFormProps {
  news?: News;
  onSubmit: (formData: NewsFormData) => Promise<boolean>;
  onCancel: () => void;
  saving: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({ news, onSubmit, onCancel, saving }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    description: '',
    content: '',
    category: 'اخبار مدرسه',
    tags: [],
    date: new Date().toLocaleDateString('fa-IR'),
    author: user?.fullName || '',
    isPublished: true,
    image: undefined,
    slug: ''
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        description: news.description,
        content: news.content,
        category: news.category,
        tags: news.tags,
        date: news.date,
        author: news.author,
        isPublished: news.isPublished,
        image: undefined,
        slug: news.slug
      });
    }
  }, [news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'اخبار مدرسه',
        tags: [],
        date: new Date().toLocaleDateString('fa-IR'),
        author: user?.fullName || '',
        isPublished: true,
        image: undefined,
        slug: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h2>{news ? 'ویرایش خبر' : 'افزودن خبر جدید'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">عنوان خبر</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="عنوان خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug">نامک (اختیاری)</label>
        <input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="نامک خبر را وارد کنید (در صورت خالی بودن، از عنوان خبر ساخته می‌شود)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">توضیحات کوتاه</label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="توضیحات کوتاه خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">متن کامل خبر</label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="متن کامل خبر را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">دسته‌بندی</label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="نام نویسنده را وارد کنید"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">برچسب‌ها</label>
        <input
          id="tags"
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({ 
            ...formData, 
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
          })}
          placeholder="برچسب‌ها را با کاما جدا کنید"
        />
      </div>

      <div className="form-group">
        <div className="checkbox-label">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
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
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData(prev => ({ ...prev, image: file }));
              }
            }}
            className="image-upload-input"
            required={!news}
          />
          <span className="image-upload-text">
            {formData.image instanceof File 
              ? formData.image.name 
              : news?.image && typeof news.image === 'string'
                ? 'تصویر فعلی: ' + news.image
                : 'برای آپلود تصویر کلیک کنید'}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn-cancel"
          onClick={onCancel}
          disabled={saving}
        >
          انصراف
        </button>
        <button 
          type="submit" 
          className="btn-submit"
          disabled={saving}
        >
          {saving ? 'در حال ذخیره...' : (news ? 'ویرایش خبر' : 'افزودن خبر')}
        </button>
      </div>
    </form>
  );
};

export default NewsForm; 