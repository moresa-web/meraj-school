import React from 'react';
import { News, Class } from '../types';
import { API_URL } from '../constants';

interface ModalProps {
  item: News | Class;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  const isNews = 'content' in item;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {item.image && (
          <img 
            src={`${API_URL.replace('/api', '')}${item.image}`}
            alt={item.title} 
            className="modal-image"
          />
        )}
        <h2>{item.title}</h2>
        {isNews && (
          <div className="modal-content">
            <p>{item.content}</p>
          </div>
        )}
        <div className="modal-meta">
          <span>دسته‌بندی: {item.category}</span>
          {isNews && <span>تاریخ: {item.date}</span>}
          {!isNews && (
            <>
              <span>استاد: {item.teacher}</span>
              <span>زمان: {item.schedule}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal; 