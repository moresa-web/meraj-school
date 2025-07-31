import { Users, Newspaper, BookOpen, Map } from 'lucide-react';

const menuItems = [
  {
    title: 'مدیریت کاربران',
    href: '/users',
    icon: Users,
  },
  {
    title: 'مدیریت محتوا',
    items: [
      {
        title: 'اخبار',
        href: '/dashboard/news',
        icon: Newspaper
      },
      {
        title: 'کلاس‌ها',
        href: '/dashboard/classes',
        icon: BookOpen
      },
      {
            title: 'Sitemap',
    href: '/dashboard/sitemap',
    icon: Map
      }
    ]
  },
]; 