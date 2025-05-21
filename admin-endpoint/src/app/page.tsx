'use client'

import { StatCard } from '@/components/dashboard/StatCard'
import { RecentList } from '@/components/dashboard/RecentList'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { NewsletterChart } from '@/components/NewsletterChart'
import { 
  AcademicCapIcon, 
  NewspaperIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="خطا در دریافت اطلاعات داشبورد" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">داشبورد</h1>
          <p className="mt-2 text-sm text-gray-600">
            مدیریت و نظارت بر عملکرد سیستم
          </p>
        </div>

        {/* کارت‌های آمار */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="کلاس‌های فعال" 
            value={stats?.totalActiveClasses || 0}
            icon={<AcademicCapIcon className="w-8 h-8" />}
            color="emerald"
            className="bg-white"
          />
          
          <StatCard 
            title="مشترکان خبرنامه" 
            value={stats?.totalActiveNewsletters || 0}
            icon={<NewspaperIcon className="w-8 h-8" />}
            color="orange"
            className="bg-white"
          />

          <StatCard 
            title="اخبار منتشر شده" 
            value={stats?.totalActiveNews || 0}
            icon={<DocumentTextIcon className="w-8 h-8" />}
            color="blue"
            className="bg-white"
          />
        </div>

        {/* نمودار و لیست‌های اخیر */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* نمودار تاریخچه خبرنامه */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                تاریخچه مشترکان خبرنامه
              </h2>
              <div className="h-[400px]">
                <NewsletterChart />
              </div>
            </div>
          </div>

          {/* لیست‌های اخیر */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  کلاس‌های اخیر
                </h2>
                <RecentList
                  items={stats?.recentClasses.map(cls => ({
                    id: cls.id,
                    title: cls.title,
                    date: cls.startDate,
                    link: `/admin/classes/${cls.id}`
                  })) || []}
                  emptyMessage="هیچ کلاسی یافت نشد"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  اخبار اخیر
                </h2>
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
      </div>
    </div>
  )
}
