'use client';

import { use } from 'react';
import EditClassClient from './EditClassClient';

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <EditClassClient id={resolvedParams.id} />;
} 