'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useClasses } from '@/hooks/useClasses'
import { useClassStudents } from '@/hooks/useClassStudents'
import { StudentList } from '@/components/classes/StudentList'
import { formatDate, getImageUrl } from '@/utils/format'

export default function ClassDetailsPage() {
  const { id } = useParams()
  const { classes, isLoading: isLoadingClass } = useClasses()
  const { students, isLoading: isLoadingStudents } = useClassStudents(id as string)

  const classItem = classes.find(c => c._id === id)

  if (isLoadingClass) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!classItem) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">کلاس مورد نظر یافت نشد</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* اطلاعات کلاس */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-start gap-6">
          <img
            src={getImageUrl(classItem.image)}
            alt={classItem.title}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{classItem.title}</h1>
            <div className="space-y-2 text-sm text-gray-800">
              <p className="text-base">استاد: {classItem.teacher}</p>
              <p className="text-base">ظرفیت: {classItem.capacity} نفر</p>
              <p className="text-base">تاریخ شروع: {formatDate(classItem.startDate)}</p>
              <p className="text-base">زمان: {classItem.schedule}</p>
            </div>
          </div>
        </div>
      </div>

      {/* لیست دانش‌آموزان */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">لیست دانش‌آموزان ثبت‌نام شده</h2>
        <StudentList students={students} isLoading={isLoadingStudents} />
      </div>
    </div>
  )
} 