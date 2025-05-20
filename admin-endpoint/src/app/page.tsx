'use client'

import { Metadata } from 'next'
import { StatCard } from '@/components/dashboard/StatCard'
import { RecentList } from '@/components/dashboard/RecentList'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  UserIcon, 
  NewspaperIcon 
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'داشبورد - پنل مدیریت دبیرستان معراج',
  description: 'داشبورد مدیریت دبیرستان معراج',
}

export default function Home() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="خطا در دریافت اطلاعات داشبورد" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="کلاس‌ها" 
          value={stats?.totalClasses || 0}
          icon={<AcademicCapIcon className="w-6 h-6" />}
          color="emerald"
        />
        
        <StatCard 
          title="دانش‌آموزان" 
          value={stats?.totalStudents || 0}
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="blue"
        />

        <StatCard 
          title="معلمان" 
          value={stats?.totalTeachers || 0}
          icon={<UserIcon className="w-6 h-6" />}
          color="purple"
        />
        
        <StatCard 
          title="خبرنامه‌ها" 
          value={stats?.totalNewsletters || 0}
          icon={<NewspaperIcon className="w-6 h-6" />}
          color="orange"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentList
          title="کلاس‌های اخیر"
          items={stats?.recentClasses.map(cls => ({
            id: cls.id,
            title: cls.title,
            date: cls.startDate,
            link: `/classes/${cls.id}`
          })) || []}
          emptyMessage="هیچ کلاسی یافت نشد"
        />

        <RecentList
          title="اخبار اخیر"
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
  )
}
