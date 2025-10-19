import { IconVideo } from '@tabler/icons-react';
import { useDirectors, useCreateDirector, useUpdateDirector, useDeleteDirector } from '@/hooks/use-directors';
import * as z from 'zod';

// Validation schema
export const directorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

// Director configuration
export const directorConfig = {
  entityName: 'director',
  entityNamePlural: 'directors',
  displayName: 'Director',
  displayNamePlural: 'Directors',
  icon: IconVideo,
  hasPhoto: true,
  photoEndpoint: 'directorPhoto',
  placeholderPhoto: '/placeholder-director.jpg',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Director Name',
      required: true,
      placeholder: 'Enter director name'
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography',
      required: true,
      minLength: 10,
      placeholder: 'Enter director biography...'
    }
  ],
  validationSchema: directorSchema,
  hooks: {
    useList: useDirectors,
    useCreate: useCreateDirector,
    useUpdate: useUpdateDirector,
    useDelete: useDeleteDirector
  },
  listConfig: {
    searchPlaceholder: 'Search directors...',
    emptyMessage: 'No directors found',
    emptyDescription: 'Try adding a new director to get started.'
  },
  formConfig: {
    createTitle: 'Create New Director',
    editTitle: 'Edit Director Profile',
    createDescription: 'Add a new director to your database',
    editDescription: 'Update director information'
  }
};
