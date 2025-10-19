// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// YouTube URL validation
export const isValidYouTubeUrl = (url) => {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

// Movie year validation
export const isValidMovieYear = (year) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1888; // First motion picture
  return year >= minYear && year <= currentYear + 5;
};

// Movie duration validation (accepts formats like "2h 30m", "150m", "2.5h")
export const isValidDuration = (duration) => {
  if (!duration || typeof duration !== 'string') return false;
  
  const durationRegex = /^(\d+h\s*)?(\d+m)?$/i;
  return durationRegex.test(duration.trim());
};

// Username validation
export const isValidUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// File type validation
export const isValidImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file?.type);
};

export const isValidVideoType = (file) => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  return validTypes.includes(file?.type);
};

// File size validation
export const isValidFileSize = (file, maxSizeInMB = 10) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file?.size <= maxSizeInBytes;
};

// Array validation
export const hasMinimumItems = (array, minCount = 1) => {
  return Array.isArray(array) && array.length >= minCount;
};

// Object validation
export const hasRequiredFields = (obj, requiredFields) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined && obj[field] !== '');
};

// Rating validation
export const isValidRating = (rating, min = 0, max = 10) => {
  const num = parseFloat(rating);
  return !isNaN(num) && num >= min && num <= max;
};
