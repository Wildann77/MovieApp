import React from 'react';
import MasterDataWrapper from '@/components/shared/MasterDataWrapper';
import { useGenres, useCreateGenre, useUpdateGenre, useDeleteGenre } from '@/hooks/use-genres';

export default function GenreForm() {
  // Use dashboard hooks for user's own data
  return (
    <MasterDataWrapper
      mode="dashboard"
      entityType="genre"
      hooks={{
        useGet: useGenres,
        useCreate: useCreateGenre,
        useUpdate: useUpdateGenre,
        useDelete: useDeleteGenre
      }}
    />
  );
}