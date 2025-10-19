# Meta Data Standardization

## Overview
This document outlines the standardization of meta/pagination data handling between the backend and frontend to ensure consistency across all API calls.

## Backend Response Structure
The backend uses the following response structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": [...], // Array of items
  "pagination": { // Pagination metadata
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

## Frontend Standardization

### Axios Interceptor (`axios-client.js`)
The axios interceptor now handles all response transformations consistently:

1. **Default Endpoints**: Transforms `pagination` → `meta` for consistency
2. **Favorites Endpoint**: Special handling to preserve structure while standardizing pagination
3. **Admin Master Data**: Transforms complex nested structures to consistent format
4. **Error Handling**: Maintains consistent error structure

### Service Functions (`service.js`)
All service functions now return consistent data structures:

- **Paginated Endpoints**: Return `{ data: [...], meta: { pagination info } }`
- **Single Item Endpoints**: Return the item directly
- **Error Cases**: Throw consistent error objects

## Standardized Response Structure

### For Paginated Data
```javascript
{
  data: [...], // Array of items
  meta: {      // Pagination metadata (renamed from 'pagination')
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false,
    nextPage: 2,
    prevPage: null
  }
}
```

### For Single Items
```javascript
// Direct item return (no wrapper)
{
  _id: "...",
  title: "...",
  // ... other fields
}
```

## Affected Endpoints

### Movies
- `GET /movies/all` - Returns paginated movie list
- `GET /movies/:id` - Returns single movie

### Admin Management
- `GET /admin/users` - Returns paginated user list
- `GET /admin/movies` - Returns paginated movie list
- `GET /admin/reviews` - Returns paginated review list

### Master Data
- `GET /admin/master-data/actors` - Returns paginated actor list
- `GET /admin/master-data/directors` - Returns paginated director list
- `GET /admin/master-data/writers` - Returns paginated writer list
- `GET /admin/master-data/genres` - Returns paginated genre list

### User Data
- `GET /user/favorites` - Returns paginated favorites list

## Benefits

1. **Consistency**: All paginated endpoints return the same structure
2. **Predictability**: Frontend components can rely on consistent data structure
3. **Maintainability**: Single source of truth for response transformation
4. **Developer Experience**: Clear documentation of expected response formats

## Migration Notes

- All existing frontend code should continue to work without changes
- The `meta` field now consistently contains pagination information
- Backend continues to send `pagination` field, but frontend receives it as `meta`
- Error handling remains consistent across all endpoints
