import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for standardized form validation
 * Provides consistent validation patterns and error handling
 */
const useFormValidation = (options = {}) => {
  const {
    showToast = true,
    validateOnChange = true,
  } = options;

  /**
   * Validate required fields
   * @param {Object} values - Form values
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} Validation result with errors
   */
  const validateRequired = useCallback((values, requiredFields) => {
    const errors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const value = values[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      }
    });

    return { isValid, errors };
  }, []);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @param {Object} options - Password requirements
   * @returns {Object} Validation result
   */
  const validatePassword = useCallback((password, options = {}) => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumber = true,
      requireSpecialChar = false
    } = options;

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.join('. ')
    };
  }, []);

  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @param {Object} options - Username requirements
   * @returns {Object} Validation result
   */
  const validateUsername = useCallback((username, options = {}) => {
    const {
      minLength = 3,
      maxLength = 20,
      allowSpecialChars = false
    } = options;

    const errors = [];
    
    if (username.length < minLength) {
      errors.push(`Username must be at least ${minLength} characters long`);
    }
    
    if (username.length > maxLength) {
      errors.push(`Username must be no more than ${maxLength} characters long`);
    }
    
    if (allowSpecialChars) {
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      }
    } else {
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push('Username can only contain letters and numbers');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.join('. ')
    };
  }, []);

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  const validateUrl = useCallback((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Validate form data with custom validation rules
   * @param {Object} values - Form values
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation result
   */
  const validateForm = useCallback((values, rules) => {
    const errors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const value = values[field];
      const fieldRules = rules[field];

      // Required validation
      if (fieldRules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field] = fieldRules.requiredMessage || `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return;
      }

      // Email validation
      if (fieldRules.email && !validateEmail(value)) {
        errors[field] = fieldRules.emailMessage || 'Please enter a valid email address';
        isValid = false;
      }

      // URL validation
      if (fieldRules.url && !validateUrl(value)) {
        errors[field] = fieldRules.urlMessage || 'Please enter a valid URL';
        isValid = false;
      }

      // Min length validation
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = fieldRules.minLengthMessage || `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${fieldRules.minLength} characters long`;
        isValid = false;
      }

      // Max length validation
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = fieldRules.maxLengthMessage || `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${fieldRules.maxLength} characters long`;
        isValid = false;
      }

      // Custom validation function
      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customResult = fieldRules.custom(value, values);
        if (customResult !== true) {
          errors[field] = typeof customResult === 'string' ? customResult : 'Invalid value';
          isValid = false;
        }
      }
    });

    return { isValid, errors };
  }, [validateEmail, validateUrl]);

  /**
   * Show validation error toast
   * @param {Object} errors - Validation errors
   * @param {string} context - Context for the error message
   */
  const showValidationErrors = useCallback((errors, context = 'Form') => {
    if (showToast && Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors);
      toast.error(`${context} validation failed: ${errorMessages.join(', ')}`);
    }
  }, [showToast]);

  return {
    validateRequired,
    validateEmail,
    validatePassword,
    validateUsername,
    validateUrl,
    validateForm,
    showValidationErrors,
  };
};

export default useFormValidation;
