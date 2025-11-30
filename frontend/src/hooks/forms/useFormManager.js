import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const useFormManager = (schema, defaultValues = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = form;

  const handleEdit = useCallback((item) => {
    setSelectedItem(item);
    setIsEditing(true);
    
    // First, clear all form fields manually
    Object.keys(defaultValues).forEach(key => {
      setValue(key, '');
    });
    
    // Then populate with new data
    Object.keys(item).forEach(key => {
      if (item[key] !== undefined && item[key] !== null) {
        setValue(key, item[key]);
      }
    });
  }, [setValue, defaultValues]);

  const handleNew = useCallback(() => {
    setSelectedItem(null);
    setIsEditing(false);
    
    // Clear all form fields manually
    Object.keys(defaultValues).forEach(key => {
      setValue(key, '');
    });
  }, [setValue, defaultValues]);

  const handleCancel = useCallback(() => {
    if (selectedItem) {
      handleEdit(selectedItem);
    } else {
      handleNew();
    }
  }, [selectedItem, handleEdit, handleNew]);

  return {
    form,
    register,
    handleSubmit,
    errors,
    reset,
    setValue,
    watch,
    isEditing,
    selectedItem,
    handleEdit,
    handleNew,
    handleCancel,
    setIsEditing,
    setSelectedItem,
  };
};

export default useFormManager;
