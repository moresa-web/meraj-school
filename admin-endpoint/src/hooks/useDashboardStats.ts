import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { AxiosError } from 'axios'

interface RecentClass {
  id: string
  title: string
  teacher: string
  startDate: string
}

interface RecentNews {
  id: string
  title: string
  createdAt: string
}

interface SystemStatus {
  cpu: string
  memory: string
  storage: string
}

export interface DashboardStats {
  totalClasses: number
  totalNewsletters: number
  recentClasses: RecentClass[]
  recentNews: RecentNews[]
  totalNews: number
  totalActiveNews: number
  totalActiveClasses: number
  totalActiveNewsletters: number
  activeUsers: number
  classesTrend: number
  newslettersTrend: number
  newsTrend: number
  usersTrend: number
  systemStatus: SystemStatus
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        console.log('Fetching dashboard stats...')
        const response = await api.get<DashboardStats>('/api/dashboard/stats')
        console.log('Dashboard stats raw response:', response)
        console.log('Response headers:', response.headers)
        console.log('Response status:', response.status)
        
        const data = response.data
        console.log('Dashboard stats parsed data:', JSON.stringify(data, null, 2))
        
        if (!data.systemStatus) {
          console.warn('System status is missing from response')
          // اگر systemStatus در پاسخ نبود، مقادیر پیش‌فرض را استفاده می‌کنیم
          data.systemStatus = {
            cpu: '0%',
            memory: '0%',
            storage: '0%'
          }
        }
        
        console.log('System status from response:', data.systemStatus)
        return data
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        if (error instanceof AxiosError) {
          console.error('Error response:', error.response)
          console.error('Error status:', error.response?.status)
          console.error('Error headers:', error.response?.headers)
          console.error('Error data:', error.response?.data)
        }
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchInterval: 1000 * 30 // هر 30 ثانیه یکبار به‌روزرسانی
  })
} 