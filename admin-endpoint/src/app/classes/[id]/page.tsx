'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import EditClassClient from './edit/EditClassClient'

interface ClassDetails {
  id: string
  title: string
  teacher: string
  startDate: string
  description: string
  isActive: boolean
}

export default function ClassEditPage() {
  const params = useParams()
  const classId = params.id as string

  const { data: classDetails, isLoading, error } = useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const { data } = await api.get(`/api/classes/${classId}`)
      return data
    }
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message="خطا در دریافت اطلاعات کلاس" />
  }

  if (!classDetails) {
    return <ErrorMessage message="کلاس مورد نظر یافت نشد" />
  }

  return <EditClassClient initialData={classDetails} />
} 