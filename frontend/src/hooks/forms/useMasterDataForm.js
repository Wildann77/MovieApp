import { useState, useCallback } from 'react';
import useFormManager from './useFormManager';
import useEntityCRUD from './useEntityCRUD';
import useSearch from '../ui/useSearch';
import useConfirmDialog from '../ui/useConfirmDialog';

// Helper function to create default values from config
const getDefaultValues = (config) => {
  const defaultValues = {};
  config.fields.forEach(field => {
    defaultValues[field.name] = '';
  });
  return defaultValues;
};

const useMasterDataForm = (config) => {
  const [photoUrl, setPhotoUrl] = useState("");
  
  const {
    form,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    isEditing,
    selectedItem,
    handleEdit,
    handleNew,
    handleCancel,
  } = useFormManager(config.validationSchema, getDefaultValues(config));

  const { searchValue, debouncedValue, handleSearchChange } = useSearch();
  const { showConfirm } = useConfirmDialog();

  // Get hooks from config
  const { useList, useCreate, useUpdate, useDelete } = config.hooks;
  
  // React Query hooks
  const { data: listData, isLoading } = useList({ 
    search: debouncedValue, 
    limit: 50 
  });
  const { mutate: createEntity, isPending: isCreating } = useCreate();
  const { mutate: updateEntity, isPending: isUpdating } = useUpdate();
  const { mutate: deleteEntity, isPending: isDeleting } = useDelete();

  const items = listData?.[config.entityNamePlural] || [];

  const handleItemSelect = useCallback((item) => {
    // Reset photo URL first
    setPhotoUrl("");
    
    // Then handle edit (which will reset the form)
    handleEdit(item);
    
    // Set photo URL after form is reset
    if (config.hasPhoto) {
      setPhotoUrl(item.photo || "");
    }
  }, [handleEdit, config.hasPhoto, setPhotoUrl]);

  const handleNewItem = useCallback(() => {
    handleNew();
    setPhotoUrl("");
  }, [handleNew]);

  const handleDeleteItem = useCallback((item) => {
    showConfirm({
      title: `Delete ${config.displayName}`,
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        deleteEntity(item._id, {
          onSuccess: () => {
            if (selectedItem?._id === item._id) {
              handleNewItem();
            }
          },
        });
      },
    });
  }, [showConfirm, config.displayName, deleteEntity, selectedItem, handleNewItem]);

  const onSubmit = useCallback((data) => {
    if (config.hasPhoto && !photoUrl) {
      return;
    }

    const entityData = {
      ...data,
      ...(config.hasPhoto && { photo: photoUrl }),
    };

    if (isEditing && selectedItem) {
      updateEntity(
        { [`${config.entityName}Id`]: selectedItem._id, [`${config.entityName}Data`]: entityData },
        {
          onSuccess: () => {
            handleNewItem();
          },
        }
      );
    } else {
      createEntity(entityData, {
        onSuccess: () => {
          handleNewItem();
        },
      });
    }
  }, [config.hasPhoto, config.entityName, photoUrl, isEditing, selectedItem, updateEntity, createEntity, handleNewItem]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return {
    // Form state
    form,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    isEditing,
    selectedItem,
    photoUrl,
    setPhotoUrl,
    
    // Search
    searchValue,
    handleSearchChange,
    filteredItems,
    
    // CRUD operations
    items,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Handlers
    handleItemSelect,
    handleNewItem,
    handleDeleteItem,
    handleCancel,
    onSubmit,
    
    // Config
    config,
  };
};

export default useMasterDataForm;
