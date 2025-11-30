import { useState } from 'react';

export const useFormState = (initialState = {}) => {
  const [formState, setFormState] = useState(initialState);

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const updateFields = (updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  const resetFields = (fields) => {
    const resetData = {};
    fields.forEach(field => {
      resetData[field] = initialState[field] || '';
    });
    setFormState(prev => ({ ...prev, ...resetData }));
  };

  return {
    formState,
    updateField,
    updateFields,
    resetForm,
    resetFields
  };
};
