'use client'

import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'

interface SystemStatusProps {
  cpu: string
  memory: string
  storage: string
}

export function SystemStatus({ cpu, memory, storage }: SystemStatusProps) {
  console.log('SystemStatus props:', { cpu, memory, storage })

  const parsePercentage = (value: string) => {
    const cleanValue = value.replace('%', '')
    const parsed = parseFloat(cleanValue)
    console.log('Parsing percentage:', { value, cleanValue, parsed })
    return isNaN(parsed) ? 0 : parsed
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <AlertCircle className="h-5 w-5 text-red-600" />
    if (percentage >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return 'بحرانی'
    if (percentage >= 60) return 'هشدار'
    return 'بهینه'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-600'
    if (percentage >= 60) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  const cpuValue = parsePercentage(cpu)
  const memoryValue = parsePercentage(memory)
  const storageValue = parsePercentage(storage)

  console.log('Parsed values:', { cpuValue, memoryValue, storageValue })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">CPU</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStatusColor(cpuValue)}`}>
                {cpu}
              </span>
              {getStatusIcon(cpuValue)}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(cpuValue)}`}
              style={{ width: `${cpuValue}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            {getStatusText(cpuValue)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">حافظه</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStatusColor(memoryValue)}`}>
                {memory}
              </span>
              {getStatusIcon(memoryValue)}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(memoryValue)}`}
              style={{ width: `${memoryValue}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            {getStatusText(memoryValue)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">فضای ذخیره‌سازی</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getStatusColor(storageValue)}`}>
                {storage}
              </span>
              {getStatusIcon(storageValue)}
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(storageValue)}`}
              style={{ width: `${storageValue}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            {getStatusText(storageValue)}
          </span>
        </div>
      </div>
    </div>
  )
} 