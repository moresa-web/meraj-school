import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { User } from './useUsers';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/api/auth/me')
      return data
    }
  })
} 