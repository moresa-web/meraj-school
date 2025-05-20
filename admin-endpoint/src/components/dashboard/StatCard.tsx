import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
  color: 'emerald' | 'orange' | 'blue' | 'red'
  className?: string
}

const colorClasses = {
  emerald: 'text-emerald-600',
  orange: 'text-orange-600',
  blue: 'text-blue-600',
  red: 'text-red-600'
}

export function StatCard({ title, value, icon, color, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg shadow p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={cn('p-3 rounded-full bg-opacity-10', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
} 