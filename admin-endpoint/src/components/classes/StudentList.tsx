import React, { useState } from 'react';
import { formatDate } from '@/utils/format';
import { MagnifyingGlassIcon, PhoneIcon, UserIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Student } from '@/types/student';
import { toast } from 'react-hot-toast';

interface StudentListProps {
  students: Student[];
  isLoading: boolean;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => Promise<void>;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  isLoading,
  onEdit,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(search.toLowerCase()) ||
    student.studentPhone.includes(search) ||
    student.parentPhone.includes(search)
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === 'registeredAt' || sortField === 'createdAt' || sortField === 'updatedAt') {
      return sortDirection === 'asc'
        ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
        : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
    }
    return sortDirection === 'asc'
      ? a[sortField].toString().localeCompare(b[sortField].toString())
      : b[sortField].toString().localeCompare(a[sortField].toString());
  });

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!onDelete) return;

    try {
      setDeletingId(studentId);
      await onDelete(studentId);
    } catch (error) {
      // خطا در toast نمایش داده می‌شود
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        هنوز هیچ دانش‌آموزی در این کلاس ثبت‌نام نکرده است
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="جستجو در دانش‌آموزان..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('studentName')}
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>نام دانش‌آموز</span>
                  {sortField === 'studentName' && (
                    <span className="text-emerald-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('studentPhone')}
              >
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>شماره موبایل دانش‌آموز</span>
                  {sortField === 'studentPhone' && (
                    <span className="text-emerald-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('parentPhone')}
              >
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>شماره موبایل والدین</span>
                  {sortField === 'parentPhone' && (
                    <span className="text-emerald-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('registeredAt')}
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>تاریخ ثبت‌نام</span>
                  {sortField === 'registeredAt' && (
                    <span className="text-emerald-600">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>وضعیت</span>
                </div>
              </th>
              {(onEdit || onDelete) && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.studentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.studentPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.parentPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(student.registeredAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(student)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={deletingId === student._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-left">
        تعداد نتایج: {filteredStudents.length} نفر
      </div>
    </div>
  );
}; 