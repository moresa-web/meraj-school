'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useClasses } from '@/hooks/useClasses';
import { ClassCard } from './ClassCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Class } from '@/types/class';

interface ClassListProps {
  classes: Class[];
}

export function ClassList({ classes }: ClassListProps) {
  const [search, setSearch] = useState('');

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        هیچ کلاسی یافت نشد
      </div>
    );
  }

  const searchValue = search.toLowerCase();
  const filteredClasses = classes.filter(cls =>
    cls.title.toLowerCase().includes(searchValue) ||
    cls.teacher.toLowerCase().includes(searchValue) ||
    (cls.category && cls.category.toLowerCase().includes(searchValue)) ||
    (cls.startDate && cls.startDate.toLowerCase().includes(searchValue)) ||
    (cls.endDate && cls.endDate.toLowerCase().includes(searchValue)) ||
    (cls.schedule && cls.schedule.toLowerCase().includes(searchValue)) ||
    (cls.capacity && cls.capacity.toString().includes(searchValue)) ||
    (cls.price && cls.price.toString().includes(searchValue))
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="جستجو در کلاس‌ها بر اساس نام، استاد، تاریخ و ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm bg-white text-gray-900 placeholder-gray-400 text-base"
        />
        {/* آیکون جستجو */}
        <svg className="-ml-10 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <ClassCard key={cls._id} class={cls} />
      ))}
      </div>
    </div>
  );
} 