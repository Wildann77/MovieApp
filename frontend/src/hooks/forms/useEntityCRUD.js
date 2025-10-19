import { useCallback } from 'react';
import { toast } from 'sonner';

const useEntityCRUD = (hooks, entityName) => {
  const { useCreate, useUpdate, useDelete } = hooks;

  const createEntity = useCallback((data, options = {}) => {
    const { onSuccess, onError, ...restOptions } = options;
    
    return {
      ...restOptions,
      onSuccess: (response) => {
        toast.success(`${entityName} created successfully!`);
        onSuccess?.(response);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || `Failed to create ${entityName}`);
        onError?.(error);
      },
    };
  }, [entityName]);

  const updateEntity = useCallback((data, options = {}) => {
    const { onSuccess, onError, ...restOptions } = options;
    
    return {
      ...restOptions,
      onSuccess: (response) => {
        toast.success(`${entityName} updated successfully!`);
        onSuccess?.(response);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || `Failed to update ${entityName}`);
        onError?.(error);
      },
    };
  }, [entityName]);

  const deleteEntity = useCallback((data, options = {}) => {
    const { onSuccess, onError, ...restOptions } = options;
    
    return {
      ...restOptions,
      onSuccess: (response) => {
        toast.success(`${entityName} deleted successfully!`);
        onSuccess?.(response);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || `Failed to delete ${entityName}`);
        onError?.(error);
      },
    };
  }, [entityName]);

  return {
    createEntity,
    updateEntity,
    deleteEntity,
  };
};

export default useEntityCRUD;
