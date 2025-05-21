import React, { useState } from 'react';
import { formatDate } from '@/utils/format';

interface Student {
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  grade: string;
  registeredAt: string;
}

interface StudentListProps {
  students: Student[];
  isLoading: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({ students, isLoading }) => {
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(student =>
    student.studentName.includes(search) ||
    student.studentPhone.includes(search) ||
    student.parentPhone.includes(search) ||
    student.grade.includes(search)
  );

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
    <div>
      <input
        type="text"
        placeholder="جستجو در دانش‌آموزان..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full text-gray-900"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نام دانش‌آموز
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                شماره موبایل دانش‌آموز
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                شماره موبایل والدین
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                پایه تحصیلی
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاریخ ثبت‌نام
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
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
                  {student.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(student.registeredAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 