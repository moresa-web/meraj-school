import Link from 'next/link'
import { format } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'

interface RecentItem {
  id: string
  title: string
  date: string
  link: string
}

interface RecentListProps {
  items: RecentItem[]
  emptyMessage: string
}

export function RecentList({ items, emptyMessage }: RecentListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">{emptyMessage}</p>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {format(new Date(item.date), 'yyyy/MM/dd', { locale: faIR })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 