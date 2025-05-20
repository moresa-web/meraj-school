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
      const { data } = await api.get('/dashboard/stats')
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    retry: 1
  })
} 