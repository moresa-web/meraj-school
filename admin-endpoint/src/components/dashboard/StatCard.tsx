import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon?: ReactNode
  color?: 'emerald' | 'blue' | 'purple' | 'orange'
}

export function StatCard({ title, value, icon, color = 'emerald' }: StatCardProps) {
  const colorClasses = {
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
        {value}
      </p>
    </div>
  )
} 