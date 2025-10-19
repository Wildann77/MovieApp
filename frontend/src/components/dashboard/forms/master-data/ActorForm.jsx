import React from 'react';
import MasterDataWrapper from '@/components/shared/MasterDataWrapper';
import { useActors, useCreateActor, useUpdateActor, useDeleteActor } from '@/hooks/use-actors';

export default function ActorForm() {
  // Use dashboard hooks for user's own data
  return (
    <MasterDataWrapper
      mode="dashboard"
      entityType="actor"
      hooks={{
        useGet: useActors,
        useCreate: useCreateActor,
        useUpdate: useUpdateActor,
        useDelete: useDeleteActor
      }}
    />
  );
}