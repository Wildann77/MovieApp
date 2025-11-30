import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for standardized error handling across the application
 * Provides consistent error state management and user feedback
 */
const useErrorHandler = (options = {}) => {
  const {
    showToast = true,
    logErrors = true,
    defaultErrorMessage = 'Something went wrong. Please try again.'
  } = options;

  const [errors, setErrors] = useState({});

  /**
   * Handle API errors with consistent formatting and user feedback
   * @param {Error} error - The error object from API call
   * @param {string} context - Context for the error (e.g., 'login', 'create-actor')
   * @param {Object} options - Additional options for error handling
   */
  const handleError = useCallback((error, context = '', options = {}) => {
    const {
      showToast: showToastOverride = showToast,
      logErrors: logErrorsOverride = logErrors,
      customMessage,
      field = null
    } = options;

    // Extract error message
    let errorMessage = defaultErrorMessage;
    
    if (customMessage) {
      errorMessage = customMessage;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Log error if enabled
    if (logErrorsOverride) {
      console.error(`[${context}] Error:`, error);
    }

    // Show toast notification
    if (showToastOverride) {
      toast.error(errorMessage);
    }

    // Set field-specific error if field is provided
    if (field) {
      setErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));
    } else {
      // Set general error
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    }

    return errorMessage;
  }, [showToast, logErrors, defaultErrorMessage]);

  /**
   * Handle success with consistent user feedback
   * @param {string} message - Success message
   * @param {Object} options - Additional options
   */
  const handleSuccess = useCallback((message, options = {}) => {
    const { showToast: showToastOverride = showToast } = options;
    
    if (showToastOverride) {
      toast.success(message);
    }
  }, [showToast]);

  /**
   * Clear specific error or all errors
   * @param {string} field - Field name to clear, or 'all' to clear all errors
   */
  const clearError = useCallback((field = 'all') => {
    if (field === 'all') {
      setErrors({});
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, []);

  /**
   * Set custom error message for a specific field
   * @param {string} field - Field name
   * @param {string} message - Error message
   */
  const setError = useCallback((field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  /**
   * Check if there are any errors
   */
  const hasErrors = Object.keys(errors).length > 0;

  /**
   * Get error message for a specific field
   * @param {string} field - Field name
   */
  const getError = useCallback((field) => {
    return errors[field] || null;
  }, [errors]);

  return {
    errors,
    hasErrors,
    handleError,
    handleSuccess,
    clearError,
    setError,
    getError,
  };
};

export default useErrorHandler;
