import React from 'react';
import MovieFormLayout from './MovieFormLayout';
import { PageLayout, PageHeader } from '@/components/layouts';
import { IconEdit, IconMovie } from '@tabler/icons-react';

export default function MovieEditForm({ movieId, onCancel, onSuccess, isAdmin = false }) {
  return (
    <PageLayout>
      <PageHeader
        title="Edit Movie"
        description="Update your movie information and media content"
        icon={<IconEdit className="h-6 w-6 text-primary" />}
        badges={[
          { variant: 'outline', text: 'Movie Management' },
        ]}
      />

      <MovieFormLayout
        mode="edit"
        movieId={movieId}
        onSuccess={onSuccess}
        onCancel={onCancel}
        isAdmin={isAdmin}
      />
    </PageLayout>
  );
}
