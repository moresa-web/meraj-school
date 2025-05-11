import React from 'react';
import { Class } from '../types';
import { API_URL } from '../constants';

interface ClassTableProps {
  classes: Class[];
  onView: (classItem: Class) => void;
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ classes, onView, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>تصویر</th>
            <th>عنوان</th>
            <th>استاد</th>
            <th>سطح</th>
            <th>ظرفیت</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem._id}>
              <td>
                {classItem.image && (
                  <img
                    src={`${API_URL.replace('/api', '')}${classItem.image}`}
                    alt={classItem.title}
                    className="table-image"
                  />
                )}
              </td>
              <td>{classItem.title}</td>
              <td>{classItem.teacher}</td>
              <td>{classItem.level}</td>
              <td>
                {classItem.enrolledStudents} / {classItem.capacity}
              </td>
              <td>
                <span className={`status-badge ${classItem.isActive ? 'active' : 'inactive'}`}>
                  {classItem.isActive ? 'فعال' : 'غیرفعال'}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="btn-view"
                    onClick={() => onView(classItem)}
                  >
                    مشاهده
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(classItem)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(classItem)}
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

export default ClassTable; 