import React from 'react';
import MasterDataWrapper from '@/components/shared/MasterDataWrapper';
import { useWriters, useCreateWriter, useUpdateWriter, useDeleteWriter } from '@/hooks/use-writers';

export default function WriterForm() {
  // Use dashboard hooks for user's own data
  return (
    <MasterDataWrapper
      mode="dashboard"
      entityType="writer"
      hooks={{
        useGet: useWriters,
        useCreate: useCreateWriter,
        useUpdate: useUpdateWriter,
        useDelete: useDeleteWriter
      }}
    />
  );
}