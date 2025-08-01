import React, { useState } from 'react';
import { User } from '@/hooks/useUsers';
import { formatDate } from '@/utils/format';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export default function UserList({ users, onEdit, onDelete }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = users.filter((user) => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const phone = user.phone || '';
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role?.toLowerCase() === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-600 focus:ring-emerald-600 sm:text-sm text-gray-800 placeholder-gray-500 font-medium"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm text-gray-700"
        >
          <option value="">همه نقش‌ها</option>
          <option value="user" className="text-gray-700">کاربر عادی</option>
          <option value="admin" className="text-gray-700">مدیر</option>
          <option value="student" className="text-gray-700">دانش‌آموز</option>
          <option value="parent" className="text-gray-700">والد دانش‌آموز</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">نام</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">ایمیل</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">شماره تماس</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">نقش</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">تاریخ ایجاد</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400 text-base">
                  کاربری یافت نشد
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={(user.id || user._id)?.toString() || ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.fullName || '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role?.toLowerCase() === 'admin'
                      ? 'مدیر'
                      : user.role?.toLowerCase() === 'user'
                        ? 'کاربر عادی'
                        : user.role?.toLowerCase() === 'student'
                          ? 'دانش‌آموز'
                          : user.role?.toLowerCase() === 'parent'
                            ? 'والد دانش‌آموز'
                            : user.role || '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => onDelete((user.id || user._id)?.toString() || '')}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 