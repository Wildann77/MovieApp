// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete'
  },
  MOVIE: {
    LIST: '/movies',
    CREATE: '/movies',
    UPDATE: '/movies',
    DELETE: '/movies',
    DETAIL: '/movies'
  },
  UPLOAD: {
    USER_AVATAR: 'userAvatar',
    MOVIE_POSTER: 'moviePoster',
    MOVIE_GALLERY: 'movieGallery'
  }
};

// Form Constants
export const FORM_VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true
  },
  MOVIE: {
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MIN_LENGTH: 10,
    YEAR_MIN: 1888,
    YEAR_MAX: new Date().getFullYear() + 5
  },
  FILE: {
    IMAGE_MAX_SIZE_MB: 10,
    VIDEO_MAX_SIZE_MB: 100,
    GALLERY_MAX_IMAGES: 10
  }
};

// UI Constants
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 200,
      SLOW: 300
    },
    EASING: {
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)'
    }
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070
  }
};

// Theme Constants
export const THEME = {
  COLORS: {
    PRIMARY: 'hsl(var(--primary))',
    SECONDARY: 'hsl(var(--secondary))',
    DESTRUCTIVE: 'hsl(var(--destructive))',
    MUTED: 'hsl(var(--muted))',
    ACCENT: 'hsl(var(--accent))',
    POPOVER: 'hsl(var(--popover))',
    CARD: 'hsl(var(--card))',
    BORDER: 'hsl(var(--border))',
    INPUT: 'hsl(var(--input))',
    RING: 'hsl(var(--ring))',
    BACKGROUND: 'hsl(var(--background))',
    FOREGROUND: 'hsl(var(--foreground))'
  },
  SPACING: {
    XS: '0.25rem',    // 4px
    SM: '0.5rem',     // 8px
    MD: '1rem',       // 16px
    LG: '1.5rem',     // 24px
    XL: '2rem',       // 32px
    '2XL': '3rem',    // 48px
    '3XL': '4rem'     // 64px
  },
  RADIUS: {
    NONE: '0',
    SM: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    MD: '0.375rem',   // 6px
    LG: '0.5rem',     // 8px
    XL: '0.75rem',    // 12px
    '2XL': '1rem',    // 16px
    FULL: '9999px'
  }
};

// Movie Genres
export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western'
];

// Movie Ratings
export const MOVIE_RATINGS = [
  { value: 'G', label: 'G - General Audiences' },
  { value: 'PG', label: 'PG - Parental Guidance' },
  { value: 'PG-13', label: 'PG-13 - Parents Strongly Cautioned' },
  { value: 'R', label: 'R - Restricted' },
  { value: 'NC-17', label: 'NC-17 - Adults Only' }
];

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

// Status Types
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DELETED: 'deleted'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Sort Options
export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  RATING: 'rating',
  YEAR: 'year',
  TITLE: 'title',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
};
