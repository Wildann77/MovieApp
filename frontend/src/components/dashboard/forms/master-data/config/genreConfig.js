import { IconTag } from '@tabler/icons-react';
import { useGenres, useCreateGenre, useUpdateGenre, useDeleteGenre } from '@/hooks/use-genres';
import * as z from 'zod';

// Validation schema
export const genreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Genre configuration
export const genreConfig = {
  entityName: 'genre',
  entityNamePlural: 'genres',
  displayName: 'Genre',
  displayNamePlural: 'Genres',
  icon: IconTag,
  hasPhoto: false,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Genre Name',
      required: true,
      placeholder: 'Enter genre name'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      minLength: 10,
      placeholder: 'Enter genre description...'
    }
  ],
  validationSchema: genreSchema,
  hooks: {
    useList: useGenres,
    useCreate: useCreateGenre,
    useUpdate: useUpdateGenre,
    useDelete: useDeleteGenre
  },
  listConfig: {
    searchPlaceholder: 'Search genres...',
    emptyMessage: 'No genres found',
    emptyDescription: 'Try adding a new genre to get started.'
  },
  formConfig: {
    createTitle: 'Create New Genre',
    editTitle: 'Edit Genre',
    createDescription: 'Add a new genre to your database',
    editDescription: 'Update genre information'
  }
};
