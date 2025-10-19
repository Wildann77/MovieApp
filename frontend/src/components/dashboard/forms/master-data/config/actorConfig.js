import { IconUsers } from '@tabler/icons-react';
import { useActors, useCreateActor, useUpdateActor, useDeleteActor } from '@/hooks/use-actors';
import * as z from 'zod';

// Validation schema
export const actorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

// Actor configuration
export const actorConfig = {
  entityName: 'actor',
  entityNamePlural: 'actors',
  displayName: 'Actor',
  displayNamePlural: 'Actors',
  icon: IconUsers,
  hasPhoto: true,
  photoEndpoint: 'actorPhoto',
  placeholderPhoto: '/placeholder-actor.jpg',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Actor Name',
      required: true,
      placeholder: 'Enter actor name'
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography',
      required: true,
      minLength: 10,
      placeholder: 'Enter actor biography...'
    }
  ],
  validationSchema: actorSchema,
  hooks: {
    useList: useActors,
    useCreate: useCreateActor,
    useUpdate: useUpdateActor,
    useDelete: useDeleteActor
  },
  listConfig: {
    searchPlaceholder: 'Search actors...',
    emptyMessage: 'No actors found',
    emptyDescription: 'Try adding a new actor to get started.'
  },
  formConfig: {
    createTitle: 'Create New Actor',
    editTitle: 'Edit Actor Profile',
    createDescription: 'Add a new actor to your database',
    editDescription: 'Update actor information'
  }
};
