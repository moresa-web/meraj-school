import React from 'react';
import { News } from '../types';
import { API_URL } from '../constants';

interface NewsTableProps {
  news: News[];
  onView: (news: News) => void;
  onEdit: (news: News) => void;
  onDelete: (news: News) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ news, onView, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>تصویر</th>
            <th>عنوان</th>
            <th>لایک</th>
            <th>بازدید</th>
            <th>تاریخ</th>
            <th>دسته‌بندی</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item._id}>
              <td>
                {item.image && typeof item.image === 'string' && (
                  <img
                    src={`${API_URL.replace('/api', '')}${item.image}`}
                    alt={item.title}
                    className="table-image"
                  />
                )}
              </td>
              <td>{item.title}</td>
              <td>{item.likes}</td>
              <td>{item.views}</td>
              <td>{item.date}</td>
              <td>{item.category}</td>
              <td>
                <div className="table-actions">
                  <button
                    className="btn-view"
                    onClick={() => onView(item)}
                  >
                    مشاهده
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(item)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(item)}
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsTable; 