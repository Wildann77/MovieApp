// API Response Messages
export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    REVIEW_ADDED: 'Review added successfully'
  },
  
  // Error Messages
  ERROR: {
    INTERNAL_SERVER: 'Internal Server Error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Not authorized',
    FORBIDDEN: 'Access forbidden',
    VALIDATION_ERROR: 'Validation error',
    DUPLICATE_ENTRY: 'Resource already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    MOVIE_NOT_FOUND: 'Movie not found',
    ALREADY_REVIEWED: 'Movie already reviewed',
    EMAIL_EXISTS: 'Email already exists',
    USERNAME_EXISTS: 'Username already exists',
    EMAIL_TAKEN: 'Email is already taken by another user',
    USERNAME_TAKEN: 'Username is already taken by another user'
  },
  
  // Validation Messages
  VALIDATION: {
    REQUIRED_FIELDS: 'All fields are required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    INVALID_EMAIL: 'Invalid email format',
    INVALID_RATING: 'Rating must be between 1 and 5'
  }
};

// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: '4MB',
  MAX_GALLERY_FILES: 5,
  MAX_AVATAR_SIZE: '2MB'
};

// JWT Configuration
export const JWT_CONFIG = {
  EXPIRES_IN: '7d'
};
