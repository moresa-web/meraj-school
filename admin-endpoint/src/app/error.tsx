'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">خطایی رخ داد</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        تلاش مجدد
      </button>
    </div>
  )
} 