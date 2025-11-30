import { STATUS_CODES, MESSAGES } from './constants.js';

/**
 * Create success response
 */
export const createSuccessResponse = (res, statusCode = STATUS_CODES.OK, message, data = null, pagination = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data }),
    ...(pagination && { pagination })
  };
  
  return res.status(statusCode).json(response);
};


/**
 * Create error response
 */
export const createErrorResponse = (res, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Response factory functions
 */
export const responseFactory = {
  success: createSuccessResponse,
  error: createErrorResponse,
  created: (res, message = MESSAGES.SUCCESS.CREATED, data = null) => 
    createSuccessResponse(res, STATUS_CODES.CREATED, message, data),
  notFound: (res, message = MESSAGES.ERROR.NOT_FOUND) => 
    createErrorResponse(res, STATUS_CODES.NOT_FOUND, message),
  unauthorized: (res, message = MESSAGES.ERROR.UNAUTHORIZED) => 
    createErrorResponse(res, STATUS_CODES.UNAUTHORIZED, message),
  badRequest: (res, message = MESSAGES.ERROR.VALIDATION_ERROR, errors = null) => 
    createErrorResponse(res, STATUS_CODES.BAD_REQUEST, message, errors),
  forbidden: (res, message = 'Access forbidden') => 
    createErrorResponse(res, STATUS_CODES.FORBIDDEN, message),
  internalError: (res, message = MESSAGES.ERROR.INTERNAL_SERVER) => 
    createErrorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, message)
};

/**
 * Async error handler wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return responseFactory.badRequest(res, MESSAGES.ERROR.VALIDATION_ERROR, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return responseFactory.badRequest(res, `${field} already exists`);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return responseFactory.badRequest(res, 'Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return responseFactory.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return responseFactory.unauthorized(res, 'Token expired');
  }

  // Default error
  return responseFactory.internalError(res, err.message || MESSAGES.ERROR.INTERNAL_SERVER);
};
