import React, { useState, useEffect } from 'react';
import { News, NewsFormData } from '@/types/news';
import Image from 'next/image';
import { TagIcon, UserCircleIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useNews } from "@/hooks/useNews";

interface NewsFormProps {
  initialData?: News;
  isEdit?: boolean;
  onSubmit?: (data: NewsFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  isSubmitting: externalIsSubmitting,
}) => {
  const router = useRouter();
  const { createNews, updateNews } = useNews();
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    content: '',
    category: '',
    description: '',
    author: '',
    tags: [],
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category,
        description: initialData.description || '',
        author: typeof initialData.author === 'string' ? initialData.author : initialData.author?.fullName || '',
        tags: initialData.tags || [],
        isPublished: initialData.isPublished ?? false,
      });
      
      if (initialData.image) {
        const imageUrl = initialData.image.startsWith('http') 
          ? initialData.image 
          : `http://localhost:5000${initialData.image}`;
        setPreviewImage(imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSubmitting = externalIsSubmitting ?? internalIsSubmitting;
    if (isSubmitting) return;

    try {
      setInternalIsSubmitting(true);
      const currentDate = new Date().toISOString().split('T')[0];
      const data = {
        ...formData,
        date: currentDate,
      };

      if (onSubmit) {
        await onSubmit(data);
      } else {
        if (isEdit && initialData?._id) {
          await updateNews(initialData._id, data);
        } else {
          await createNews(data);
        }
        toast.success(isEdit ? "خبر با موفقیت ویرایش شد" : "خبر با موفقیت ایجاد شد");
        router.push("/news");
        router.refresh();
      }
    } catch (error) {
      toast.error("خطا در ذخیره خبر");
      console.error("Error saving news:", error);
    } finally {
      setInternalIsSubmitting(false);
    }
  };

  // Define input styles
  const inputClass = "mt-1 block w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all duration-200 text-sm md:text-base";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const formGroupClass = "relative";
  
  const isSubmitting = externalIsSubmitting ?? internalIsSubmitting;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 p-4 md:p-6" id="news-form">
      <div className={formGroupClass}>
        <label htmlFor="title" className={labelClass}>
          عنوان خبر
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="عنوان خبر را وارد کنید"
            className={`${inputClass} pr-10`}
          />
          <DocumentTextIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>

      <div className={formGroupClass}>
        <label htmlFor="description" className={labelClass}>
          توضیحات کوتاه
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="یک توضیح کوتاه درباره خبر وارد کنید..."
          className={inputClass}
        />
      </div>

      <div className={formGroupClass}>
        <label htmlFor="content" className={labelClass}>
          محتوای خبر
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          placeholder="محتوای کامل خبر را وارد کنید..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className={formGroupClass}>
          <label htmlFor="category" className={labelClass}>
            دسته‌بندی
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="">انتخاب کنید</option>
              <option value="اخبار مدرسه">اخبار مدرسه</option>
              <option value="افتخارات">افتخارات</option>
              <option value="همایش‌ها">همایش‌ها</option>
              <option value="کلاس‌های تقویتی">کلاس‌های تقویتی</option>
            </select>
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className={formGroupClass}>
          <label className={labelClass}>
            نویسنده
          </label>
          <div className="relative">
            <div className={`${inputClass} pr-10 bg-gray-100 cursor-not-allowed`}>
              {initialData?.author?.fullName || 'کاربر فعلی'}
            </div>
            <UserCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-xs text-gray-500 mt-1">نویسنده به صورت خودکار از حساب کاربری شما انتخاب می‌شود</p>
        </div>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 md:p-6 bg-gray-50">
        <label htmlFor="image" className={`${labelClass} flex items-center gap-2`}>
          <PhotoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          تصویر خبر
        </label>
        <div className="mt-1 flex justify-center px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {previewImage ? (
              <div className="relative w-full h-40 md:h-48 mb-4">
                <img
                  src={previewImage}
                  alt="تصویر خبر"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData((prev) => ({ ...prev, image: undefined }));
                  }}
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

      <div className={formGroupClass}>
        <label htmlFor="tags" className={labelClass}>
          برچسب‌ها
        </label>
        <div className="relative">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="برچسب را وارد کنید و Enter را بزنید"
            className={`${inputClass} pr-10`}
          />
          <TagIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs md:text-sm font-medium bg-emerald-100 text-emerald-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="mr-2 block text-sm text-gray-700">
          انتشار خبر
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
            'ذخیره خبر'
          )}
        </button>
      </div>
    </form>
  );
};

export default NewsForm; 