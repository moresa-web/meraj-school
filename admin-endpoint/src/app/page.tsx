import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'داشبورد - پنل مدیریت دبیرستان معراج',
  description: 'داشبورد مدیریت دبیرستان معراج',
}

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">کلاس‌ها</h2>
          <p className="text-3xl font-bold text-emerald-600">12</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">دانش‌آموزان</h2>
          <p className="text-3xl font-bold text-emerald-600">240</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">معلمان</h2>
          <p className="text-3xl font-bold text-emerald-600">24</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">خبرنامه‌ها</h2>
          <p className="text-3xl font-bold text-emerald-600">8</p>
        </div>
      </div>
    </div>
  )
}
