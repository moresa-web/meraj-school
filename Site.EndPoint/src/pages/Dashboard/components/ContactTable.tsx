// components/ContactTable.tsx
import React from 'react';
import { Contact } from '../types';
import { API_URL } from '../constants';

interface ContactTableProps {
    contacts: Contact[];
    onView: (contact: Contact) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({ contacts, onView }) => {
    return (
        <div className="table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>نام</th>
                        <th>ایمیل</th>
                        <th>عنوان</th>
                        <th>پیام</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.subject}</td>
                            <td>{item.message}</td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        className="btn-view"
                                        onClick={() => onView(item)}
                                    >
                                        مشاهده
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

export default ContactTable;
