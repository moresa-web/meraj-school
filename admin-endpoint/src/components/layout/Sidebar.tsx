'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  NewspaperIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UsersIcon,
  MapIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  {
    name: 'داشبورد',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'مدیریت کاربران',
    href: '/users',
    icon: UsersIcon,
  },
  {
    name: 'مدیریت اخبار',
    href: '/news',
    icon: NewspaperIcon,
  },
  {
    name: 'مدیریت کلاس‌ها',
    href: '/classes',
    icon: AcademicCapIcon,
  },
  {
    name: 'مدیریت خبرنامه',
    href: '/newsletters',
    icon: EnvelopeIcon,
  },
  {
    name: 'قالب‌های ایمیل',
    href: '/email-templates',
    icon: DocumentTextIcon,
  },
  {
    name: 'تنظیمات سئو',
    href: '/seo',
    icon: Cog6ToothIcon,
  },
  {
    name: 'مدیریت نخشه سایت',
    href: '/sitemap',
    icon: MapIcon,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user, loading } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const SidebarContent = () => (
    <>
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
              onClick={() => setIsOpen(false)}
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
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-600 text-white">
              {loading ? '...' : getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {loading ? 'در حال بارگذاری...' : user?.fullName || 'کاربر'}
            </p>
            <p className="text-sm text-emerald-200">
              {loading ? '...' : user?.email || 'ایمیل نامشخص'}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64" />
    </>
  );
};

export default Sidebar; 