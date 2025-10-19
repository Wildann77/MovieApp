import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminActors, 
  createAdminActor, 
  updateAdminActor, 
  deleteAdminActor,
  getAdminDirectors,
  createAdminDirector,
  updateAdminDirector,
  deleteAdminDirector,
  getAdminWriters,
  createAdminWriter,
  updateAdminWriter,
  deleteAdminWriter,
  getAdminGenres,
  createAdminGenre,
  updateAdminGenre,
  deleteAdminGenre
} from '../lib/service';

// Generic hook factory for master data
const createMasterDataHook = (entityName, apiFunctions) => {
  const useGet = (params = {}) => {
    return useQuery({
      queryKey: [`admin-${entityName}`, params],
      queryFn: () => apiFunctions.get(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: 1000,
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: apiFunctions.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`admin-${entityName}`] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ id, data }) => apiFunctions.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`admin-${entityName}`] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: apiFunctions.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`admin-${entityName}`] });
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      },
    });
  };

  return { useGet, useCreate, useUpdate, useDelete };
};

// Actors hooks
export const useAdminActors = createMasterDataHook('actors', {
  get: getAdminActors,
  create: createAdminActor,
  update: updateAdminActor,
  delete: deleteAdminActor,
});

// Directors hooks
export const useAdminDirectors = createMasterDataHook('directors', {
  get: getAdminDirectors,
  create: createAdminDirector,
  update: updateAdminDirector,
  delete: deleteAdminDirector,
});

// Writers hooks
export const useAdminWriters = createMasterDataHook('writers', {
  get: getAdminWriters,
  create: createAdminWriter,
  update: updateAdminWriter,
  delete: deleteAdminWriter,
});

// Genres hooks
export const useAdminGenres = createMasterDataHook('genres', {
  get: getAdminGenres,
  create: createAdminGenre,
  update: updateAdminGenre,
  delete: deleteAdminGenre,
});
