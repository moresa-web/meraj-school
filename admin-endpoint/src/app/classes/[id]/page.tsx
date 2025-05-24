'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useClasses } from '@/hooks/useClasses'
import { useClassStudents } from '@/hooks/useClassStudents'
import { StudentList } from '@/components/classes/StudentList'
import { formatDate, getImageUrl } from '@/utils/format'
import { AcademicCapIcon, UserCircleIcon, TagIcon, CalendarIcon, CurrencyDollarIcon, UserGroupIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ClassDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
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
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="ml-2 h-5 w-5" />
          بازگشت به لیست کلاس‌ها
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* دکمه‌های عملیات */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <ArrowLeftIcon className="ml-2 h-5 w-5" />
          بازگشت
        </button>
        <Link
          href={`/classes/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <PencilIcon className="ml-2 h-5 w-5" />
          ویرایش کلاس
        </Link>
      </div>

      {/* اطلاعات کلاس */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-1/3">
            <img
              src={getImageUrl(classItem.image)}
              alt={classItem.title}
              className="w-full h-64 rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{classItem.title}</h1>
              <p className="text-gray-600">{classItem.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <UserCircleIcon className="h-5 w-5 text-emerald-600" />
                <span>استاد: {classItem.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <AcademicCapIcon className="h-5 w-5 text-emerald-600" />
                <span>سطح: {classItem.level}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <TagIcon className="h-5 w-5 text-emerald-600" />
                <span>دسته‌بندی: {classItem.category}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                <span>ظرفیت: {classItem.capacity} نفر</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
                <span>قیمت: {classItem.price.toLocaleString()} تومان</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarIcon className="h-5 w-5 text-emerald-600" />
                <span>زمان: {classItem.schedule}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">تاریخ شروع</h3>
                <p className="text-gray-900">{formatDate(classItem.startDate)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">تاریخ پایان</h3>
                <p className="text-gray-900">{formatDate(classItem.endDate)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                classItem.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {classItem.isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* لیست دانش‌آموزان */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">لیست دانش‌آموزان ثبت‌نام شده</h2>
          <span className="text-sm text-gray-500">
            {students.length} نفر از {classItem.capacity} نفر
          </span>
        </div>
        <StudentList students={students} isLoading={isLoadingStudents} />
      </div>
    </div>
  )
} 