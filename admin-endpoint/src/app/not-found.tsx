import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">صفحه مورد نظر یافت نشد</h2>
      <Link
        href="/"
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  )
} 