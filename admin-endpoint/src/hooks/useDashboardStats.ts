import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

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

export interface DashboardStats {
  totalClasses: number
  totalNewsletters: number
  recentClasses: RecentClass[]
  recentNews: RecentNews[]
  totalNews: number
  totalActiveNews: number
  totalActiveClasses: number
  totalActiveNewsletters: number
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get('/api/dashboard/stats')
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3
  })
} 