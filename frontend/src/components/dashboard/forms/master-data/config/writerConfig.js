import { IconUserEdit } from '@tabler/icons-react';
import { useWriters, useCreateWriter, useUpdateWriter, useDeleteWriter } from '@/hooks/use-writers';
import * as z from 'zod';

// Validation schema
export const writerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

// Writer configuration
export const writerConfig = {
  entityName: 'writer',
  entityNamePlural: 'writers',
  displayName: 'Writer',
  displayNamePlural: 'Writers',
  icon: IconUserEdit,
  hasPhoto: false,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Writer Name',
      required: true,
      placeholder: 'Enter writer name'
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography',
      required: true,
      minLength: 10,
      placeholder: 'Enter writer biography...'
    }
  ],
  validationSchema: writerSchema,
  hooks: {
    useList: useWriters,
    useCreate: useCreateWriter,
    useUpdate: useUpdateWriter,
    useDelete: useDeleteWriter
  },
  listConfig: {
    searchPlaceholder: 'Search writers...',
    emptyMessage: 'No writers found',
    emptyDescription: 'Try adding a new writer to get started.'
  },
  formConfig: {
    createTitle: 'Create New Writer',
    editTitle: 'Edit Writer Profile',
    createDescription: 'Add a new writer to your database',
    editDescription: 'Update writer information'
  }
};
