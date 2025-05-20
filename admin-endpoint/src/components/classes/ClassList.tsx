'use client';

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
  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        هیچ کلاسی یافت نشد
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls._id} class={cls} />
      ))}
    </div>
  );
} 