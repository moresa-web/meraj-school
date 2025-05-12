import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './EditableContent.css';

interface EditableContentProps {
  type: 'text' | 'image';
  value: string;
  isAdmin: boolean;
  onSave: (newValue: string) => Promise<void>;
}

const EditableContent: React.FC<EditableContentProps> = ({ type, value, isAdmin, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [isUploading, setIsUploading] = useState(false);

  // Reset states when value changes
  useEffect(() => {
    setEditValue(value);
    setPreviewUrl(value);
    setSelectedFile(null);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/content/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ imageUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در حذف تصویر');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/content/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'خطا در آپلود تصویر');
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error('آدرس تصویر در پاسخ سرور یافت نشد');
    }

    // تبدیل مسیر نسبی به مسیر کامل
    const imageUrl = data.url.startsWith('http') 
      ? data.url 
      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${data.url.replace(/^\/+/, '')}`;

    return imageUrl;
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      if (type === 'image' && selectedFile) {
        // اگر تصویر قبلی وجود دارد، آن را حذف کن
        if (value && value !== previewUrl) {
          try {
            await deleteImage(value);
          } catch (error) {
            console.warn('Failed to delete old image:', error);
            // ادامه می‌دهیم حتی اگر حذف تصویر قبلی با خطا مواجه شد
          }
        }

        const uploadedUrl = await uploadImage(selectedFile);
        await onSave(uploadedUrl);
      } else {
        await onSave(editValue);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('خطا در ذخیره تغییرات: ' + (error instanceof Error ? error.message : 'خطای ناشناخته'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(value);
    setEditValue(value);
    setIsEditing(false);
  };

  // تبدیل مسیر تصویر به مسیر کامل
  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${url.replace(/^\/+/, '')}`;
  };

  if (!isAdmin) {
    return type === 'image' ? (
      <img src={getFullImageUrl(value)} alt="Content" className="editable-image" />
    ) : (
      <span className="editable-text">{value}</span>
    );
  }

  const modal = isEditing && (
    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <h3>{type === 'image' ? 'ویرایش تصویر' : 'ویرایش متن'}</h3>
        
        {type === 'image' ? (
          <div className="image-upload-container">
            <div className="image-preview-container">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview"
                style={{ opacity: isUploading ? 0.5 : 1 }}
              />
              {isUploading && (
                <div className="uploading-overlay">
                  <div className="uploading-spinner"></div>
                  <span>در حال آپلود و ذخیره...</span>
                </div>
              )}
            </div>
            
            <div className="upload-button-container">
              <label className="editable-image-upload-input">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />
                {isUploading ? 'در حال آپلود...' : (selectedFile ? 'تصویر انتخاب شده' : 'انتخاب تصویر جدید')}
              </label>
            </div>
          </div>
        ) : (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="editable-textarea"
            placeholder={value}
          />
        )}

        <div className="modal-actions">
          <button 
            onClick={handleCancel}
            type="button"
            className="cancel-button"
            disabled={isUploading}
          >
            انصراف
          </button>
          <button 
            onClick={handleSave}
            type="button"
            className="save-button"
            disabled={isUploading || (type === 'image' && !selectedFile)}
          >
            {isUploading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <span 
        className="editable-content"
        onMouseEnter={() => setShowEditIcon(true)}
        onMouseLeave={() => setShowEditIcon(false)}
      >
        {type === 'image' ? (
          <span className="image-container">
            <img src={getFullImageUrl(value)} alt="Content" className="editable-image" />
            {showEditIcon && (
              <button onClick={handleEdit} className="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            )}
          </span>
        ) : (
          <span className="text-container">
            <span className="editable-text">{value}</span>
            {showEditIcon && (
              <button onClick={handleEdit} className="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            )}
          </span>
        )}
      </span>
      {isEditing && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default EditableContent; 