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
      <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
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
    <div className="p-4 md:p-6">
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="جستجو در کلاس‌ها بر اساس نام، استاد، تاریخ و ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 md:px-5 py-2.5 md:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm bg-white text-gray-900 placeholder-gray-400 text-sm md:text-base"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredClasses.map((cls) => (
          <ClassCard key={cls._id} class={cls} />
        ))}
      </div>
    </div>
  );
} 