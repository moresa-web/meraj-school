import React from 'react';
import EditNewsClient from './EditNewsClient';

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const resolvedParams = await params;
  return <EditNewsClient id={resolvedParams.id} />;
} 