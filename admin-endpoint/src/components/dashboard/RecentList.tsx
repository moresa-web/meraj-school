import Link from 'next/link'
import { formatDate } from '@/utils/format'

interface RecentItem {
  id: string
  title: string
  date: string
  link: string
}

interface RecentListProps {
  title: string
  items: RecentItem[]
  emptyMessage: string
}

export function RecentList({ title, items, emptyMessage }: RecentListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.link}
                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <span className="text-gray-700">{item.title}</span>
                <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 