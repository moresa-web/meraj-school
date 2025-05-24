'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { RecentList } from '@/components/dashboard/RecentList'
import { SystemStatus } from '@/components/dashboard/SystemStatus'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { NewsletterChart } from '@/components/NewsletterChart'
import { useEffect } from 'react'
import { 
  AcademicCapIcon, 
  NewspaperIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const { data: stats, isLoading, error } = useDashboardStats()

  useEffect(() => {
    console.log('Dashboard Stats:', {
      isLoading,
      error,
      stats,
      systemStatus: stats?.systemStatus
    })
  }, [stats, isLoading, error])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    console.error('Dashboard Error:', error)
    return <ErrorMessage message="خطا در دریافت اطلاعات داشبورد" />
  }

  const systemStatus = stats?.systemStatus || {
    cpu: '0%',
    memory: '0%',
    storage: '0%'
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* هدر داشبورد */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">داشبورد مدیریتی</h1>
            <p className="mt-2 text-sm text-gray-600">
              مدیریت و نظارت بر عملکرد سیستم
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="w-5 h-5 ml-2" />
              <span>آخرین به‌روزرسانی: {new Date().toLocaleTimeString('fa-IR')}</span>
            </div>
            <div className="flex items-center text-sm text-emerald-600">
              <CheckCircleIcon className="w-5 h-5 ml-2" />
              <span>سیستم در حال کار</span>
            </div>
          </div>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="کلاس‌های فعال" 
          value={stats?.totalActiveClasses || 0}
          icon={<AcademicCapIcon className="w-6 h-6 md:w-8 md:h-8" />}
          color="emerald"
          className="bg-white"
          trend={stats?.classesTrend || 0}
        />
        
        <StatCard 
          title="مشترکان خبرنامه" 
          value={stats?.totalActiveNewsletters || 0}
          icon={<NewspaperIcon className="w-6 h-6 md:w-8 md:h-8" />}
          color="orange"
          className="bg-white"
          trend={stats?.newslettersTrend || 0}
        />

        <StatCard 
          title="اخبار منتشر شده" 
          value={stats?.totalActiveNews || 0}
          icon={<DocumentTextIcon className="w-6 h-6 md:w-8 md:h-8" />}
          color="blue"
          className="bg-white"
          trend={stats?.newsTrend || 0}
        />

        <StatCard 
          title="کاربران فعال" 
          value={stats?.activeUsers || 0}
          icon={<UsersIcon className="w-6 h-6 md:w-8 md:h-8" />}
          color="purple"
          className="bg-white"
          trend={stats?.usersTrend || 0}
        />
      </div>

      {/* نمودارها و آمار */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* نمودار تاریخچه خبرنامه */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">آمار خبرنامه</h2>
          <div className="min-w-[320px] h-[300px] md:h-[400px]">
            <NewsletterChart />
          </div>
        </div>

        {/* وضعیت سیستم */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">وضعیت سیستم</h2>
          <SystemStatus
            cpu={systemStatus.cpu}
            memory={systemStatus.memory}
            storage={systemStatus.storage}
          />
        </div>
      </div>

      {/* لیست‌های اخیر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">کلاس‌های اخیر</h2>
              <a href="/classes" className="text-sm text-blue-600 hover:text-blue-800">مشاهده همه</a>
            </div>
            <RecentList
              items={stats?.recentClasses.map(cls => ({
                id: cls.id,
                title: cls.title,
                date: cls.startDate,
                link: `/classes/${cls.id}`
              })) || []}
              emptyMessage="هیچ کلاسی یافت نشد"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">اخبار اخیر</h2>
              <a href="/news" className="text-sm text-blue-600 hover:text-blue-800">مشاهده همه</a>
            </div>
            <RecentList
              items={stats?.recentNews.map(news => ({
                id: news.id,
                title: news.title,
                date: news.createdAt,
                link: `/news/${news.id}`
              })) || []}
              emptyMessage="هیچ خبری یافت نشد"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
