<!-- b2f5fadd-f97a-4e5e-8e71-05f06c874794 334ab238-b4c4-4a20-859b-0e06c765d5eb -->
# Frontend Clean Architecture Refactor

## Tujuan

Membuat kode frontend lebih clean, konsisten, dinamis, terstruktur, dan reusable dengan memisahkan logic dari rendering components tanpa merusak fungsionalitas existing.

## Analisis Kode yang Perlu Direfactor

### Duplicated Code Found:

1. **Master Data Forms** (1,495 lines total duplicated):

   - ActorForm.jsx (415 lines) - 90% sama dengan DirectorForm
   - DirectorForm.jsx (415 lines) - 90% sama dengan ActorForm  
   - GenreForm.jsx (330 lines) - 85% sama tapi tanpa photo upload
   - WriterForm.jsx (335 lines) - 85% sama dengan GenreForm

2. **Movie Forms** (720 lines total):

   - MovieCreateForm.jsx (340 lines) - banyak duplikasi dengan MovieEditForm
   - MovieEditForm.jsx (380 lines) - banyak duplikasi dengan MovieCreateForm
   - Sudah ada separation: BasicInfoTab, MediaTab, DetailsTab (GOOD!)

3. **Auth Forms** (280 lines total):

   - LoginForm.jsx (138 lines) - pattern sama dengan SignupForm
   - SignupForm.jsx (142 lines) - pattern sama dengan LoginForm

4. **Shared Patterns**:

   - Form field rendering (berulang di banyak tempat)
   - Search + List pattern (di semua master data forms)
   - Upload + Preview pattern (di ActorForm, DirectorForm, MovieForms)
   - CRUD operations logic (create, update, delete patterns)

## Strategi Refactoring

### 1. Create Generic Master Data Management System

**Problem**: ActorForm, DirectorForm, GenreForm, WriterForm memiliki 90% kode yang sama

**Solution**: Buat generic reusable components:

- `src/components/dashboard/master-data/MasterDataLayout.jsx` - Generic layout wrapper
- `src/components/dashboard/master-data/MasterDataForm.jsx` - Generic form container
- `src/components/dashboard/master-data/MasterDataList.jsx` - Generic list with search
- `src/components/dashboard/master-data/config/` - Configuration files untuk setiap entity
- `src/hooks/forms/useMasterDataForm.js` - Generic form logic hook

**Config Structure**:

```javascript
// config/actorConfig.js
export const actorConfig = {
  entityName: 'actor',
  entityNamePlural: 'actors',
  displayName: 'Actor',
  displayNamePlural: 'Actors',
  icon: IconUsers,
  hasPhoto: true,
  photoEndpoint: 'actorPhoto',
  fields: [
    { name: 'name', type: 'text', label: 'Actor Name', required: true, placeholder: 'Enter actor name' },
    { name: 'bio', type: 'textarea', label: 'Biography', required: true, minLength: 10, placeholder: 'Enter actor biography...' }
  ],
  validationSchema: actorSchema,
  hooks: {
    useList: useActors,
    useCreate: useCreateActor,
    useUpdate: useUpdateActor,
    useDelete: useDeleteActor
  }
}
```

### 2. Create Generic Movie Form System  

**Problem**: MovieCreateForm dan MovieEditForm memiliki banyak duplikasi

**Solution**: Extract shared logic:

- `src/components/dashboard/movie-form/MovieFormLayout.jsx` - Wrapper untuk create/edit
- `src/hooks/forms/useMovieForm.js` - Shared form logic (search, selections, etc)
- Keep existing tabs (BasicInfoTab, MediaTab, DetailsTab) - sudah bagus!

### 3. Create Reusable Form Components

**Problem**: Form fields scattered dan tidak konsisten

**Solution**:

- `src/components/forms/FormInput.jsx` - Input dengan label, error, icon
- `src/components/forms/FormTextarea.jsx` - Textarea dengan label, error
- `src/components/forms/FormUpload.jsx` - Upload component dengan preview
- `src/components/forms/FormSelect.jsx` - Select/dropdown component
- `src/components/forms/FormMultiSelect.jsx` - Multi-select component
- `src/components/forms/FormActions.jsx` - Form action buttons (submit, reset, delete)
- `src/components/forms/FormSection.jsx` - Form section wrapper
- `src/components/forms/FormTabs.jsx` - Reusable tabs wrapper

### 4. Create Reusable List Components

**Problem**: List rendering duplicated di banyak tempat

**Solution**:

- `src/components/lists/ListContainer.jsx` - Container dengan search
- `src/components/lists/ListItem.jsx` - Generic list item dengan avatar/icon
- `src/components/lists/ListHeader.jsx` - List header dengan actions
- `src/components/lists/EmptyState.jsx` - Empty state component
- `src/components/lists/SearchBar.jsx` - Consistent search input

### 5. Create Reusable Layout Components

**Problem**: Layout patterns berulang

**Solution**:

- `src/components/layouts/PageLayout.jsx` - Generic page layout dengan header
- `src/components/layouts/PageHeader.jsx` - Enhanced page header dengan badges
- `src/components/layouts/TwoColumnLayout.jsx` - Two column layout (list + form)
- `src/components/layouts/CardSection.jsx` - Card section wrapper
- `src/components/layouts/FormCard.jsx` - Card khusus untuk forms

### 6. Extract Business Logic to Custom Hooks

**Problem**: Business logic mixed dengan rendering

**Solution**:

- `src/hooks/forms/useFormManager.js` - Generic form state management
- `src/hooks/forms/useEntityCRUD.js` - Generic CRUD operations
- `src/hooks/forms/useMovieForm.js` - Movie-specific form logic
- `src/hooks/ui/useSearch.js` - Search functionality dengan debouncing
- `src/hooks/ui/useSelection.js` - Selection management (single/multi)
- `src/hooks/ui/useConfirmDialog.js` - Confirmation dialog hook
- `src/hooks/ui/useImageUpload.js` - Image upload logic (enhance existing)

### 7. Improve Shared Components

**Problem**: Shared components kurang lengkap

**Solution**: Enhance existing dan add new:

- Enhance `FormField.jsx` untuk support more types
- Add `ConfirmDialog.jsx` untuk replace window.confirm
- Add `PhotoPreview.jsx` untuk photo upload preview
- Add `AvatarUpload.jsx` untuk avatar dengan upload button
- Enhance `LoadingSpinner.jsx` dengan more variants
- Enhance `ErrorState.jsx` dengan more options

### 8. Create Configuration-Driven System

**Problem**: Hardcoded values dan tidak flexible

**Solution**:

- `src/config/entities/` - Entity configurations (actor, director, genre, writer)
- `src/config/forms/fieldTypes.js` - Field type definitions
- `src/config/ui/icons.js` - Icon mappings
- `src/config/validation/schemas.js` - Centralized validation schemas

## Implementation Steps

### Phase 1: Foundation (Core Reusable Components)

1. Create form components (`FormInput`, `FormTextarea`, `FormUpload`, `FormSelect`, `FormMultiSelect`, `FormActions`, `FormSection`, `FormTabs`)
2. Create list components (`ListContainer`, `ListItem`, `ListHeader`, `EmptyState`, `SearchBar`)
3. Create layout components (`PageLayout`, `PageHeader`, `TwoColumnLayout`, `CardSection`, `FormCard`)
4. Create utility hooks (`useFormManager`, `useSearch`, `useSelection`, `useConfirmDialog`)
5. Create shared UI components (`ConfirmDialog`, `PhotoPreview`, `AvatarUpload`)

### Phase 2: Master Data System

1. Create entity configuration system dengan config files
2. Create `useMasterDataForm.js` hook (generic CRUD logic)
3. Create `MasterDataLayout.jsx` (generic layout)
4. Create `MasterDataForm.jsx` (generic form using new form components)
5. Create `MasterDataList.jsx` (generic list using new list components)
6. Create entity configs (actorConfig, directorConfig, genreConfig, writerConfig)

### Phase 3: Refactor Master Data Forms

1. Refactor `ActorForm.jsx` to use `MasterDataLayout` with `actorConfig`
2. Refactor `DirectorForm.jsx` to use `MasterDataLayout` with `directorConfig`
3. Refactor `GenreForm.jsx` to use `MasterDataLayout` with `genreConfig`
4. Refactor `WriterForm.jsx` to use `MasterDataLayout` with `writerConfig`

### Phase 4: Refactor Movie Forms

1. Create `useMovieForm.js` hook (shared movie form logic)
2. Create `MovieFormLayout.jsx` (wrapper for create/edit)
3. Refactor `MovieCreateForm.jsx` to use new shared components
4. Refactor `MovieEditForm.jsx` to use new shared components

### Phase 5: Enhance Other Components (Optional)

1. Extract common patterns from auth forms
2. Improve `UserProfileForm.jsx` to use new shared components
3. Standardize error handling across all forms

### Phase 6: Testing & Validation

1. Test all CRUD operations (Create, Read, Update, Delete)
2. Test search functionality dengan debouncing
3. Test photo upload (for Actor/Director)
4. Test movie form (create & edit)
5. Verify no functionality broken
6. Check responsive design
7. Test error states dan loading states

## File Structure After Refactoring

```
src/
├── components/
│   ├── dashboard/
│   │   ├── master-data/
│   │   │   ├── MasterDataLayout.jsx (NEW - 150 lines)
│   │   │   ├── MasterDataForm.jsx (NEW - 200 lines)
│   │   │   ├── MasterDataList.jsx (NEW - 150 lines)
│   │   │   ├── config/
│   │   │   │   ├── actorConfig.js (NEW - 30 lines)
│   │   │   │   ├── directorConfig.js (NEW - 30 lines)
│   │   │   │   ├── genreConfig.js (NEW - 25 lines)
│   │   │   │   └── writerConfig.js (NEW - 25 lines)
│   │   │   └── index.js (NEW)
│   │   ├── movie-form/
│   │   │   ├── MovieFormLayout.jsx (NEW - 100 lines)
│   │   │   └── index.js (NEW)
│   │   ├── ActorForm.jsx (REFACTORED - ~15 lines vs 415)
│   │   ├── DirectorForm.jsx (REFACTORED - ~15 lines vs 415)
│   │   ├── GenreForm.jsx (REFACTORED - ~15 lines vs 330)
│   │   ├── WriterForm.jsx (REFACTORED - ~15 lines vs 335)
│   │   ├── MovieCreateForm.jsx (REFACTORED - ~150 lines vs 340)
│   │   └── MovieEditForm.jsx (REFACTORED - ~150 lines vs 380)
│   ├── forms/ (NEW)
│   │   ├── FormInput.jsx (80 lines)
│   │   ├── FormTextarea.jsx (70 lines)
│   │   ├── FormUpload.jsx (120 lines)
│   │   ├── FormSelect.jsx (90 lines)
│   │   ├── FormMultiSelect.jsx (100 lines)
│   │   ├── FormActions.jsx (60 lines)
│   │   ├── FormSection.jsx (40 lines)
│   │   ├── FormTabs.jsx (80 lines)
│   │   └── index.js
│   ├── lists/ (NEW)
│   │   ├── ListContainer.jsx (80 lines)
│   │   ├── ListItem.jsx (100 lines)
│   │   ├── ListHeader.jsx (60 lines)
│   │   ├── EmptyState.jsx (50 lines)
│   │   ├── SearchBar.jsx (50 lines)
│   │   └── index.js
│   ├── layouts/ (NEW)
│   │   ├── PageLayout.jsx (80 lines)
│   │   ├── PageHeader.jsx (90 lines)
│   │   ├── TwoColumnLayout.jsx (70 lines)
│   │   ├── CardSection.jsx (50 lines)
│   │   ├── FormCard.jsx (60 lines)
│   │   └── index.js
│   └── shared/
│       ├── ConfirmDialog.jsx (NEW - 80 lines)
│       ├── PhotoPreview.jsx (NEW - 60 lines)
│       ├── AvatarUpload.jsx (NEW - 100 lines)
│       └── ... (existing enhanced)
├── hooks/
│   ├── forms/ (NEW)
│   │   ├── useFormManager.js (100 lines)
│   │   ├── useEntityCRUD.js (80 lines)
│   │   ├── useMasterDataForm.js (150 lines)
│   │   ├── useMovieForm.js (120 lines)
│   │   └── index.js
│   └── ui/ (NEW)
│       ├── useSearch.js (60 lines)
│       ├── useSelection.js (70 lines)
│       ├── useConfirmDialog.js (50 lines)
│       └── index.js
└── config/ (NEW)
    ├── entities/
    │   └── index.js
    ├── forms/
    │   └── fieldTypes.js
    ├── ui/
    │   └── icons.js
    └── validation/
        └── schemas.js
```

## Code Reduction Summary

**Before**:

- Master Data Forms: 1,495 lines (4 files)
- Movie Forms: 720 lines (2 files)
- Auth Forms: 280 lines (2 files)
- **Total**: ~2,495 lines

**After**:

- Master Data System: ~700 lines (generic + configs)
- Master Data Forms: ~60 lines (4 files using generic)
- Movie Form System: ~400 lines (generic + refactored)
- Reusable Components: ~1,200 lines (forms, lists, layouts)
- **Total**: ~2,360 lines

**Net Result**:

- ~135 lines reduction in total code
- **BUT**: ~1,435 lines of duplicated code eliminated
- **AND**: Much better maintainability, consistency, and scalability
- **PLUS**: Easy to add new entities (just add config file ~30 lines)

## Benefits

1. **Code Reduction**: ~1,435 lines duplicated code eliminated (57% reduction in form code)
2. **Maintainability**: Change once, apply everywhere
3. **Consistency**: Same UI/UX across all forms
4. **Scalability**: Easy to add new entities (just add config ~30 lines)
5. **Testability**: Separated logic easier to test
6. **Readability**: Clear separation of concerns (logic vs rendering)
7. **Type Safety**: Better prop validation dengan PropTypes atau TypeScript ready
8. **Performance**: Less re-renders dengan proper memoization
9. **Developer Experience**: Faster development untuk new features

## Example: Before vs After

### Master Data Forms

**Before** (ActorForm.jsx - 415 lines):

```jsx
export default function ActorForm() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActor, setSelectedActor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // ... 400+ lines of code with forms, lists, handlers, etc.
}
```

**After** (ActorForm.jsx - ~15 lines):

```jsx
import { MasterDataLayout } from './master-data';
import { actorConfig } from './master-data/config/actorConfig';

export default function ActorForm() {
  return <MasterDataLayout config={actorConfig} />;
}
```

### Movie Forms

**Before** (MovieCreateForm.jsx - 340 lines):

```jsx
export default function MovieCreateForm({ onSuccess }) {
  const [posterUrl, setPosterUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  // ... lots of search logic, selection handlers, etc.
  // ... 300+ lines of code
}
```

**After** (MovieCreateForm.jsx - ~150 lines):

```jsx
import { MovieFormLayout } from './movie-form';
import { useMovieForm } from '../../hooks/forms/useMovieForm';

export default function MovieCreateForm({ onSuccess }) {
  const movieForm = useMovieForm({ mode: 'create', onSuccess });
  
  return (
    <MovieFormLayout
      mode="create"
      {...movieForm}
    />
  );
}
```

## Notes

- Semua perubahan backward compatible
- Tidak ada breaking changes pada functionality
- Existing tests tetap valid (atau minimal changes)
- Performance sama atau lebih baik (less re-renders, better memoization)
- Mudah untuk rollback jika ada issues (keep old files commented)
- Incremental implementation (bisa deploy per phase)

### To-dos

- [ ] Create reusable form components (FormInput, FormTextarea, FormUpload, FormActions, FormSection)
- [ ] Create reusable list components (ListContainer, ListItem, ListHeader, EmptyState)
- [ ] Create reusable layout components (PageLayout, TwoColumnLayout, CardSection)
- [ ] Create utility hooks (useFormManager, useSearch, useSelection, useConfirmDialog)
- [ ] Create entity configuration files (actorConfig, directorConfig, genreConfig, writerConfig)
- [ ] Create MasterDataLayout component (generic layout wrapper)
- [ ] Create MasterDataForm component (generic form using new form components)
- [ ] Create MasterDataList component (generic list using new list components)
- [ ] Refactor ActorForm.jsx to use MasterDataLayout with actorConfig
- [ ] Refactor DirectorForm.jsx to use MasterDataLayout with directorConfig
- [ ] Refactor GenreForm.jsx to use MasterDataLayout with genreConfig
- [ ] Refactor WriterForm.jsx to use MasterDataLayout with writerConfig
- [ ] Test all CRUD operations, search, upload, and verify no functionality broken