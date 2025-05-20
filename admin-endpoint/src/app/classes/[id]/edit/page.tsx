import React from 'react';
import EditClassClient from './EditClassClient';

interface EditClassPageProps {
  params: {
    id: string;
  };
}

export default function EditClassPage({ params }: EditClassPageProps) {
  return <EditClassClient id={params.id} />;
} 