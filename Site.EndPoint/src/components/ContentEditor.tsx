import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Section {
  type: 'text' | 'image' | 'gallery' | 'video';
  content: string;
  order: number;
  metadata?: {
    alt?: string;
    caption?: string;
    [key: string]: any;
  };
}

interface PageContent {
  pageId: string;
  title: string;
  content: {
    sections: Section[];
  };
}

interface ContentEditorProps {
  pageId: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ pageId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState<PageContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [pageId]);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`/api/page-content/${pageId}`);
      setContent(response.data);
    } catch (error) {
      toast.error('خطا در دریافت محتوا');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedContent: PageContent) => {
    try {
      await axios.put(`/api/page-content/${pageId}`, updatedContent);
      setContent(updatedContent);
      setIsEditing(false);
      toast.success('محتوا با موفقیت بروزرسانی شد');
    } catch (error) {
      toast.error('خطا در بروزرسانی محتوا');
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData);
      return response.data.url;
    } catch (error) {
      toast.error('خطا در آپلود تصویر');
      return null;
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="content-editor">
      {!isEditing ? (
        <div className="view-mode">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            ویرایش محتوا
          </button>
          {/* نمایش محتوا */}
          {content?.content.sections.map((section, index) => (
            <div key={index} className="section">
              {section.type === 'text' && (
                <div className="text-content">{section.content}</div>
              )}
              {section.type === 'image' && (
                <img
                  src={section.content}
                  alt={section.metadata?.alt || ''}
                  className="content-image"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="edit-mode">
          <div className="editor-toolbar">
            <button
              onClick={() => setIsEditing(false)}
              className="cancel-button"
            >
              انصراف
            </button>
            <button
              onClick={() => content && handleUpdate(content)}
              className="save-button"
            >
              ذخیره تغییرات
            </button>
          </div>
          {/* فرم ویرایش */}
          {content?.content.sections.map((section, index) => (
            <div key={index} className="section-editor">
              <select
                value={section.type}
                onChange={(e) => {
                  const newContent = { ...content };
                  newContent.content.sections[index].type = e.target.value as any;
                  setContent(newContent);
                }}
              >
                <option value="text">متن</option>
                <option value="image">تصویر</option>
              </select>
              
              {section.type === 'text' ? (
                <textarea
                  value={section.content}
                  onChange={(e) => {
                    const newContent = { ...content };
                    newContent.content.sections[index].content = e.target.value;
                    setContent(newContent);
                  }}
                />
              ) : (
                <div className="image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleImageUpload(file);
                        if (url) {
                          const newContent = { ...content };
                          newContent.content.sections[index].content = url;
                          setContent(newContent);
                        }
                      }
                    }}
                  />
                  {section.content && (
                    <img
                      src={section.content}
                      alt="Preview"
                      className="preview-image"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentEditor; 