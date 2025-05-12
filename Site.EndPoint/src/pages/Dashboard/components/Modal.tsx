import React from 'react';
import { News, Class, Contact } from '../types';
import { API_URL } from '../constants';

interface ModalProps {
  item: News | Class | Contact;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose }) => {
  const isNews = 'content' in item;
  const isContact = 'message' in item;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {isNews && item.image && (
          <img
            src={`${API_URL.replace('/api', '')}${item.image}`}
            alt={item.title}
            className="modal-image"
          />
        )}
        {isNews && (
          <div className="modal-content">
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </div>
        )}
        {isContact && (
          <div className="modal-content">
            <p>{item.message}</p>
          </div>
        )}
        <div className="modal-meta">
          {isNews && (
            <>
              <span>دسته‌بندی: {item.category}</span>
              <span>تاریخ: {item.date}</span>
            </>
          )}
          {!isNews && !isContact && (
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
