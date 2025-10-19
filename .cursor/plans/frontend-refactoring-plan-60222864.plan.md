<!-- 60222864-8238-42c6-bd80-9a2bee4663b3 c3f82f24-e0a5-4209-bf62-198da0eebf09 -->
# Frontend Refactoring - Comprehensive Clean Architecture

## Overview

Refactor frontend untuk mencapai kode yang reusable, konsisten, dinamis, dan clean dengan pattern yang terinspirasi dari backend tapi dioptimasi untuk React ecosystem.

## Phase 1: Foundation & Constants Standardization

### 1.1 Unify Constants Structure

**File:** `frontend/src/lib/constants.js` + `backend/src/utils/constants.js`

Masalah saat ini:

- Frontend dan backend punya struktur constants yang berbeda
- Beberapa constants terduplikasi dengan nilai yang beda
- Tidak ada single source of truth

Action:

- Standardisasi struktur constants untuk match dengan backend pattern
- Tambahkan constants yang missing dari backend (STATUS_CODES, MESSAGES)
- Buat constants untuk entity types, API endpoints, validation rules
- Group constants by domain (AUTH, MOVIE, MASTER_DATA, UI, VALIDATION)

**New structure:**

```javascript
// constants/index.js (barrel export)
export * from './api.constants'
export * from './validation.constants'
export * from './ui.constants'
export * from './entity.constants'
```

### 1.2 Create Response Utilities

**New file:** `frontend/src/lib/response.utils.js`

Terinspirasi dari `backend/src/utils/response.js`, buat frontend utilities untuk:

- Standardize API response handling
- Error message extraction
- Success message formatting
- Consistent data transformation

## Phase 2: Service Layer Refactoring

### 2.1 Create Service Factory Pattern

**New file:** `frontend/src/lib/services/createServiceFactory.js`

Masalah saat ini:

- Service functions di `service.js` terlalu besar (528 lines)
- Banyak duplicate pattern untuk CRUD operations
- Tidak ada consistency dalam error handling

Action:

- Buat generic service factory seperti backend `createCrudService`
- Support untuk pagination, search, filtering
- Built-in error handling dan response transformation
- Type safety dengan JSDoc

**Pattern:**

```javascript
const createEntityService = (entityName, endpoints) => ({
  getAll: async (params) => { /* standardized */ },
  getById: async (id) => { /* standardized */ },
  create: async (data) => { /* standardized */ },
  update: async (id, data) => { /* standardized */ },
  delete: async (id) => { /* standardized */ }
})
```

### 2.2 Split Service by Domain

**New structure:**

```
frontend/src/lib/services/
  ├── index.js (barrel export)
  ├── createServiceFactory.js
  ├── auth.service.js
  ├── movie.service.js
  ├── masterData.service.js (actors, directors, writers, genres)
  ├── review.service.js
  ├── user.service.js
  └── admin.service.js
```

Refactor `service.js` (528 lines) menjadi domain-specific services dengan shared factory pattern.

## Phase 3: Hooks Standardization

### 3.1 Create Generic CRUD Hook Factory

**New file:** `frontend/src/hooks/factories/createCRUDHooks.js`

Masalah saat ini:

- Hooks seperti `use-actors.jsx`, `use-directors.jsx` punya duplicate code
- Cache strategy di-duplicate di setiap hook
- `useAdminMasterData.js` sudah punya factory pattern yang bagus tapi belum konsisten

Action:

- Standardize cache strategy logic (sudah ada di `use-movies.jsx`)
- Buat generic CRUD hook factory
- Support untuk optimistic updates
- Built-in invalidation strategy

**Pattern:**

```javascript
const createEntityHooks = (entityName, service, options = {}) => {
  const useGet = (params) => { /* with smart caching */ }
  const useGetById = (id) => { /* ... */ }
  const useCreate = () => { /* with invalidation */ }
  const useUpdate = () => { /* with optimistic update */ }
  const useDelete = () => { /* ... */ }
  return { useGet, useGetById, useCreate, useUpdate, useDelete }
}
```

### 3.2 Refactor Existing Entity Hooks

**Files to refactor:**

- `use-actors.jsx` (120 lines)
- `use-directors.jsx`
- `use-writers.jsx`
- `use-genres.jsx`
- `useAdminMasterData.js` (already has factory, enhance it)

Gunakan `createEntityHooks` factory, reduce code by ~60%.

### 3.3 Enhance Form Hooks

**Files:**

- `hooks/forms/useMovieForm.js`
- `hooks/forms/useMasterDataForm.js`
- `hooks/forms/useFormManager.js`
- `hooks/forms/useFormValidation.js`

Action:

- Standardize form state management
- Create validation utilities matching backend patterns
- Add form error handling utilities
- Support for nested forms dan dynamic fields

## Phase 4: Component Architecture

### 4.1 Create Base Components Library

**New structure:**

```
frontend/src/components/base/
  ├── DataTable/
  │   ├── DataTable.jsx (generic table component)
  │   ├── DataTableToolbar.jsx
  │   ├── DataTablePagination.jsx
  │   └── useDataTable.js
  ├── EntityForm/
  │   ├── EntityForm.jsx (generic form wrapper)
  │   ├── FormField.jsx (already exists in shared/)
  │   └── useEntityForm.js
  ├── EntityManager/
  │   ├── EntityManager.jsx (combines table + CRUD)
  │   └── useEntityManager.js
  └── index.js
```

### 4.2 Refactor MasterDataManagement

**File:** `frontend/src/components/admin/management/MasterDataManagement.jsx` (541 lines)

Current state: Sudah cukup generic dengan props-based configuration

Improvements:

- Extract table logic ke `DataTable` base component
- Extract form logic ke `EntityForm` base component
- Simplify dengan composition pattern
- Reduce dari 541 lines ke ~200 lines

### 4.3 Refactor MovieManagement

**File:** `frontend/src/components/admin/management/MovieManagement.jsx` (526 lines)

Action:

- Use `EntityManager` base component
- Extract statistics cards ke separate component
- Standardize filters dengan `DataTableToolbar`
- Use composition untuk modals

### 4.4 Create Shared Components

**Enhance existing:** `frontend/src/components/shared/`

Current components are good, enhance:

- `SearchSelect.jsx` - add more configuration options
- `ImageUpload.jsx` - standardize upload flow
- Add `FilterBar.jsx` for common filtering patterns
- Add `StatCard.jsx` for dashboard statistics

### 4.5 Standardize Form Components

**Current:** `frontend/src/components/forms/`

Files are good (FormInput, FormSelect, etc.), enhance:

- Add consistent error display
- Add loading states
- Add validation feedback
- Create `FormBuilder.jsx` for dynamic forms

## Phase 5: Routing & Layouts

### 5.1 Refactor Route Configuration

**File:** `frontend/src/App.jsx` (247 lines)

Masalah:

- Repetitive route definitions (lines 66-211)
- Same wrapper component repeated
- Hard to maintain

Action:

- Create route configuration object
- Use route generator function
- Support for nested routes
- Reduce from 247 lines ke ~100 lines

**Pattern:**

```javascript
const routeConfig = {
  dashboard: {
    path: '/dashboard',
    component: DashboardLayout,
    guard: UserRoute,
    children: ['movies', 'create-movie', 'actors', ...]
  },
  admin: { ... }
}
```

### 5.2 Enhance Layout Components

**Files:** `frontend/src/components/layouts/`

Current layouts are good, add:

- `WithSidebar.jsx` - generic sidebar layout
- `WithHeader.jsx` - generic header layout
- Support for nested layouts

### 5.3 Simplify DashboardLayout

**File:** `frontend/src/pages/dashboard/DashboardLayout.jsx` (86 lines)

Action:

- Extract routing logic to configuration
- Use composition for content rendering
- Support for lazy loading

## Phase 6: State Management

### 6.1 Enhance Store Structure

**File:** `frontend/src/store/store.js`

Action:

- Split store by domain (auth, ui, entities)
- Add middleware for persistence
- Add dev tools integration
- Create selectors in separate file

**New structure:**

```
frontend/src/store/
  ├── index.js
  ├── slices/
  │   ├── auth.slice.js
  │   ├── ui.slice.js
  │   └── entities.slice.js
  ├── selectors/
  │   └── index.js
  └── middleware/
      └── persistence.js
```

### 6.2 Optimize React Query Configuration

**File:** `frontend/src/context/query-provider.jsx`

Action:

- Configure global query settings
- Add mutation defaults
- Configure cache persistence
- Add error handling defaults

## Phase 7: Utilities & Helpers

### 7.1 Create Validation Utilities

**New file:** `frontend/src/lib/validation.utils.js`

Match dengan `backend/src/utils/validation.js`:

- validateRequiredFields
- validateEmail
- validatePassword
- validateRating
- validatePagination
- validateSort

### 7.2 Create Data Transform Utilities

**New file:** `frontend/src/lib/transform.utils.js`

For consistent data transformation:

- normalizeEntityData
- denormalizeEntityData
- transformApiResponse
- transformFormData

### 7.3 Enhance Existing Utils

**File:** `frontend/src/lib/utils.js` & `utils.ts`

Merge TypeScript utils to JavaScript, add:

- Date formatting utilities
- String manipulation
- Array helpers
- Object manipulation

## Phase 8: Error Handling & Loading States

### 8.1 Create Error Boundary System

**Enhance:** `frontend/src/components/ErrorBoundary.jsx`

Add:

- Domain-specific error boundaries
- Error recovery strategies
- Error logging
- User-friendly error messages

### 8.2 Standardize Loading States

**New file:** `frontend/src/components/shared/LoadingState.jsx`

Create consistent loading patterns:

- Skeleton loaders
- Spinner variants
- Progress indicators
- Streaming indicators

### 8.3 Create Notification System

Use Sonner toast consistently:

- Success notifications
- Error notifications
- Info notifications
- Loading notifications with progress

## Phase 9: Performance Optimization

### 9.1 Code Splitting

Action:

- Lazy load pages
- Lazy load heavy components
- Split vendor bundles
- Optimize bundle size

### 9.2 Memoization Strategy

Add:

- useMemo for expensive computations
- useCallback for event handlers
- React.memo for pure components
- Optimize re-renders

### 9.3 Image Optimization

Enhance upload components:

- Image compression
- Lazy loading images
- Responsive images
- Placeholder images

## Phase 10: Documentation & Testing Setup

### 10.1 Code Documentation

Add:

- JSDoc for all functions
- Component prop documentation
- Hook usage examples
- Service documentation

### 10.2 Create Pattern Documentation

**New file:** `frontend/ARCHITECTURE.md`

Document:

- Project structure
- Naming conventions
- Component patterns
- Hook patterns
- Service patterns
- State management patterns

### 10.3 Testing Setup (Foundation)

Setup:

- Vitest configuration
- Testing utilities
- Mock factories
- Test examples for key components

## Implementation Strategy

### Priority Order:

1. **Phase 1-2** (Foundation): Constants + Service Layer - CRITICAL
2. **Phase 3** (Hooks): Standardize data fetching patterns
3. **Phase 4** (Components): Create reusable component library
4. **Phase 5** (Routes): Simplify routing structure
5. **Phase 6-7** (State + Utils): Optimize state and add utilities
6. **Phase 8-9** (Polish): Error handling + performance
7. **Phase 10** (Docs): Documentation for maintainability

### Breaking Changes:

- Service imports akan berubah (from `service.js` to domain-specific)
- Hook imports mungkin berubah (tapi backward compatible)
- Constants structure akan berubah (add migration guide)

### Backward Compatibility:

- Keep old service.js as deprecated during transition
- Create alias exports for smooth migration
- Document all breaking changes

## Success Metrics

✅ Code reduction: ~30% less code through reusability

✅ Consistency: Same patterns across all entities

✅ Maintainability: Clear separation of concerns

✅ Performance: Better caching and optimization

✅ Developer Experience: Easier to add new features

✅ Match backend: Similar architecture patterns

### To-dos

- [ ] Standardize constants structure to match backend patterns and eliminate duplication
- [ ] Create service factory pattern for CRUD operations and split service.js by domain
- [ ] Create generic CRUD hooks factory and refactor entity hooks to use it
- [ ] Create base components library (DataTable, EntityForm, EntityManager)
- [ ] Refactor MasterDataManagement and MovieManagement using base components
- [ ] Create route configuration system and simplify App.jsx routing
- [ ] Split store by domain and enhance React Query configuration
- [ ] Create validation and transform utilities matching backend patterns
- [ ] Standardize error boundaries and loading states across the app
- [ ] Implement code splitting, memoization, and optimization strategies
- [ ] Document architecture patterns and create migration guide