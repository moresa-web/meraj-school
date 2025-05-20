'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  NewspaperIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'داشبورد',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'اخبار',
    href: '/news',
    icon: NewspaperIcon,
  },
  {
    name: 'کلاس‌ها',
    href: '/classes',
    icon: AcademicCapIcon,
  },
  {
    name: 'خبرنامه',
    href: '/newsletters',
    icon: EnvelopeIcon,
  },
  {
    name: 'قالب‌های ایمیل',
    href: '/email-templates',
    icon: DocumentTextIcon,
  },
  {
    name: 'تنظیمات SEO',
    href: '/seo',
    icon: Cog6ToothIcon,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">دبیرستان معراج</h1>
        <p className="text-emerald-200 text-sm">پنل مدیریت</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-100 hover:bg-emerald-700/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-lg font-medium">ا</span>
          </div>
          <div>
            <p className="font-medium">مدیر سیستم</p>
            <p className="text-sm text-emerald-200">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 