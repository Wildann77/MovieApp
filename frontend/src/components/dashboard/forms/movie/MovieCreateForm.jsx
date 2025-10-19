import React from 'react';
import MovieFormLayout from './MovieFormLayout';
import { PageLayout, PageHeader } from '@/components/layouts';
import { IconPlus, IconMovie } from '@tabler/icons-react';

export default function MovieCreateForm({ onCancel, onSuccess, isAdmin = false }) {
  return (
    <PageLayout>
      <PageHeader
        title="Create Movie"
        description="Add a new movie to the system"
        icon={<IconPlus className="h-6 w-6 text-primary" />}
        badges={[
          { variant: 'outline', text: 'Movie Management' },
          ...(isAdmin ? [{ variant: 'secondary', text: 'Admin' }] : [])
        ]}
      />

      <MovieFormLayout
        mode="create"
        onSuccess={onSuccess}
        onCancel={onCancel}
        isAdmin={isAdmin}
      />
    </PageLayout>
  );
}