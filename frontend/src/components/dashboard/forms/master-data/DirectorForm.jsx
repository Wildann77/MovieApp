import React from 'react';
import MasterDataWrapper from '@/components/shared/MasterDataWrapper';
import { useDirectors, useCreateDirector, useUpdateDirector, useDeleteDirector } from '@/hooks/use-directors';

export default function DirectorForm() {
  // Use dashboard hooks for user's own data
  return (
    <MasterDataWrapper
      mode="dashboard"
      entityType="director"
      hooks={{
        useGet: useDirectors,
        useCreate: useCreateDirector,
        useUpdate: useUpdateDirector,
        useDelete: useDeleteDirector
      }}
    />
  );
}
