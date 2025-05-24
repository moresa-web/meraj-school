import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface StatCardProps {
  title: string
  value: number
  icon: ReactNode
  color: 'emerald' | 'orange' | 'blue' | 'red' | 'purple'
  className?: string
  trend?: number
}

const colorClasses = {
  emerald: 'text-emerald-600',
  orange: 'text-orange-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
  purple: 'text-purple-600'
}

export function StatCard({ title, value, icon, color, className, trend }: StatCardProps) {
  const trendColor = trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-600'
  const TrendIcon = trend && trend > 0 ? ArrowUpIcon : ArrowDownIcon

  return (
    <div className={cn('rounded-lg shadow p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center">
              <TrendIcon className={cn('w-4 h-4', trendColor)} />
              <span className={cn('text-sm font-medium mr-1', trendColor)}>
                {Math.abs(trend)}%
              </span>
              <span className="text-sm text-gray-600">از ماه گذشته</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-full bg-opacity-10', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
} 