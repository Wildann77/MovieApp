import { MESSAGES } from './constants.js';

/**
 * Validation utility functions
 */

/**
 * Validate required fields
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`
    };
  }
  
  return { isValid: true };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH };
  }
  
  return { isValid: true };
};

/**
 * Validate rating value
 * @param {number} rating - Rating to validate
 * @returns {Object} - Validation result
 */
export const validateRating = (rating) => {
  const numRating = Number(rating);
  
  if (isNaN(numRating)) {
    return { isValid: false, message: 'Rating must be a number' };
  }
  
  if (numRating < 1 || numRating > 5) {
    return { isValid: false, message: MESSAGES.VALIDATION.INVALID_RATING };
  }
  
  return { isValid: true };
};

/**
 * Validate ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} - Is valid ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate pagination parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - Validated pagination parameters
 */
export const validatePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Validate sort parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @param {Array} allowedFields - Allowed fields for sorting
 * @returns {Object} - Validated sort parameters
 */
export const validateSort = (sortBy, sortOrder, allowedFields = []) => {
  const validSortBy = allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const validSortOrder = ['asc', 'desc'].includes(sortOrder?.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';
  
  return {
    sortBy: validSortBy,
    sortOrder: validSortOrder,
    sortOptions: { [validSortBy]: validSortOrder === 'desc' ? -1 : 1 }
  };
};
