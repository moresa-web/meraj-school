import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

interface DashboardStats {
  totalClasses: number
  totalNewsletters: number
  recentClasses: Array<{
    id: string
    title: string
    teacher: string
    startDate: string
  }>
  recentNews: Array<{
    id: string
    title: string
    createdAt: string
  }>
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/dashboard/stats')
        return response.data
      } catch (error) {
        console.error('خطا در دریافت آمار داشبورد:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    retry: 1
  })
} 