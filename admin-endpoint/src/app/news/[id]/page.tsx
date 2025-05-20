import React from 'react';
import EditNewsClient from './EditNewsClient';

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

export default function EditNewsPage({ params }: EditNewsPageProps) {
  return <EditNewsClient id={params.id} />;
} 