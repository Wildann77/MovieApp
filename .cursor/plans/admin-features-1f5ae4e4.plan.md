<!-- 1f5ae4e4-e440-4f2d-b28e-7363f151f9c7 80a7f6ae-c3d4-4238-b29f-d25986788369 -->
# Admin Features Implementation Plan

## Phase 1: Backend Foundation

### 1.1 Update User Model

**File:** `backend/src/models/user.model.js`

- Add `role` field (enum: 'user', 'admin', default: 'user')
- User model already has `isActive` and `lastLogin` fields

### 1.2 Create Admin Middleware

**File:** `backend/src/middleware/requireAdmin.js` (new)

- Create middleware to check if user has admin role
- Use existing `protect` middleware pattern from `verifyToken.js`

### 1.3 Create Admin Service

**File:** `backend/src/services/admin.service.js` (new)

- `getAllUsers(query)` - Get all users with pagination/search
- `updateUserRole(userId, role)` - Change user role
- `toggleUserStatus(userId)` - Ban/unban users
- `getAllMoviesAdmin(query)` - Get all movies (bypass ownership)
- `updateAnyMovie(movieId, updateData)` - Edit any movie
- `deleteAnyMovie(movieId)` - Delete any movie
- `getSystemStats()` - Dashboard statistics

### 1.4 Create Admin Controller

**File:** `backend/src/controllers/admin.controller.js` (new)

- Implement controllers for all admin service methods
- Follow existing pattern with `asyncHandler` and `responseFactory`

### 1.5 Create Admin Routes

**File:** `backend/src/routers/admin.route.js` (new)

- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Toggle user status
- `GET /api/admin/movies` - Get all movies
- `PUT /api/admin/movies/:id` - Update any movie
- `DELETE /api/admin/movies/:id` - Delete any movie
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/reviews/:id` - Delete any review
- `GET /api/admin/stats` - Get system statistics

### 1.6 Register Admin Routes

**File:** `backend/src/index.js`

- Import and register admin routes with `/api/admin` prefix

## Phase 2: Frontend Foundation

### 2.1 Create Admin Route Guard

**File:** `frontend/src/common/AdminRoute.jsx` (new)

- Check if user has admin role
- Redirect non-admin users to home page

### 2.2 Create Admin Hooks

**Files:**

- `frontend/src/hooks/useAdminUsers.js` (new) - Fetch/manage users
- `frontend/src/hooks/useAdminMovies.js` (new) - Fetch all movies
- `frontend/src/hooks/useAdminStats.js` (new) - Fetch statistics
- `frontend/src/hooks/useAdminReviews.js` (new) - Fetch/moderate reviews

### 2.3 Create Admin API Services

**File:** `frontend/src/lib/service.js`

- Add admin API functions for all endpoints

## Phase 3: Admin Dashboard UI

### 3.1 Admin Dashboard Layout

**File:** `frontend/src/components/admin/AdminDashboard.jsx` (new)

- Main admin dashboard container
- Sidebar navigation for admin sections
- Similar structure to existing `DashboardLayout.jsx`

### 3.2 Admin Sidebar

**File:** `frontend/src/components/admin/AdminSidebar.jsx` (new)

- Navigation items: Dashboard, Users, Movies, Reviews
- Use Tabler icons consistent with existing design

### 3.3 System Statistics Dashboard

**File:** `frontend/src/components/admin/SystemStats.jsx` (new)

- Display cards with key metrics (total users, movies, reviews)
- Activity charts using Recharts
- Recent activity feed

### 3.4 User Management Component

**File:** `frontend/src/components/admin/UserManagement.jsx` (new)

- Table showing all users with columns: username, email, role, status, join date, last login
- Actions: Change role, Ban/Unban
- Search and filter functionality
- Pagination

### 3.5 Movie Management Component

**File:** `frontend/src/components/admin/MovieManagement.jsx` (new)

- Table showing all movies from all users
- Columns: title, year, director, user, rating, created date
- Actions: Edit, Delete
- Search and filter by genre, year, director
- Pagination

### 3.6 Review Moderation Component

**File:** `frontend/src/components/admin/ReviewModeration.jsx` (new)

- Table showing all reviews
- Filter by reported status
- Actions: Delete review
- Show movie and user info

## Phase 4: Integration & Routes

### 4.1 Update App Routes

**File:** `frontend/src/App.jsx`

- Add admin routes under `/admin/*`
- Wrap with `AdminRoute` guard

### 4.2 Update Navbar

**File:** `frontend/src/components/Navbar.jsx`

- Add "Admin Panel" link for admin users
- Show based on user role

### 4.3 Update Dashboard Sidebar

**File:** `frontend/src/components/dashboard/app-sidebar.jsx`

- Add "Admin Panel" link for admin users (if in regular dashboard)

## Phase 5: Testing & Polish

### 5.1 Test Admin Features

- Test role-based access control
- Test all CRUD operations
- Test pagination and filters
- Test error handling

### 5.2 UI Polish

- Ensure consistent styling with existing design
- Add loading states
- Add error states
- Add success notifications using Sonner

## Key Implementation Details

### Backend Patterns to Follow:

```javascript
// Service pattern
export const adminService = {
  getAllUsers: async (query) => { /* implementation */ }
};

// Controller pattern
export const getAllUsersController = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  return responseFactory.success(res, 200, 'Users fetched', result);
});

// Route pattern
router.get('/users', protect, requireAdmin, getAllUsersController);
```

### Frontend Patterns to Follow:

```javascript
// Hook pattern
export const useAdminUsers = (params) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => AdminAPI.getUsers(params)
  });
};

// Component pattern - use existing Shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner'; // For notifications
```

### Security Considerations:

- All admin routes protected with `protect` + `requireAdmin` middleware
- Frontend checks user role before showing admin UI
- Backend always validates admin role on every request
- No sensitive data exposed in error messages

### To-dos

- [ ] Add role field to User model (enum: user/admin, default: user)
- [ ] Create requireAdmin middleware to check admin role
- [ ] Create admin service with methods for user/movie/review management and stats
- [ ] Create admin controller implementing all admin operations
- [ ] Create admin routes file and register in index.js
- [ ] Create AdminRoute component to protect admin pages
- [ ] Create custom hooks for admin data fetching (users, movies, stats, reviews)
- [ ] Add admin API functions to service.js
- [ ] Create AdminDashboard layout component with sidebar navigation
- [ ] Create SystemStats component with metrics cards and charts
- [ ] Create UserManagement component with table, search, and actions
- [ ] Create MovieManagement component for admin movie control
- [ ] Create ReviewModeration component for review management
- [ ] Update App.jsx with admin routes and update Navbar with admin link
- [ ] Test all admin features, add loading/error states, and polish UI