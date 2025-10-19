<!-- 59738b94-3405-4f85-8e66-b7ca5e543370 51c6c7a1-076a-49ae-a536-ec9b10871a17 -->
# Admin Master Data Management with System Data & User Master Data

## Overview

Add admin master data management where:

- **System Data**: All existing master data becomes "System Data" - usable by everyone, only admin can edit/delete
- **User Master Data**: Users can CREATE their own master data and edit/delete ONLY what they created
- **Movies**: Users can only edit/delete movies they created (already enforced)
- **Admin Override**: Admin can view, edit, and delete ALL master data and movies
- **Enhanced Charts**: Show master data usage analytics with system vs user data breakdown
- **No Breaking Changes**: Existing functionality preserved

## Phase 1: Database Migration & Model Updates

### 0. Database Migration Script

**File:** `backend/scripts/migrateMasterDataSystemData.js` (NEW FILE)

Run BEFORE any code changes to prepare existing data:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';
import Actor from '../src/models/actor.model.js';
import Genre from '../src/models/genre.model.js';
import Director from '../src/models/director.model.js';
import Writer from '../src/models/writer.model.js';

dotenv.config();

const migrateToSystemData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create admin user
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found. Please create admin first.');
      process.exit(1);
    }

    console.log(`Using admin user: ${adminUser.username} (${adminUser._id})`);

    // Mark all existing master data as system data
    const collections = [
      { Model: Actor, name: 'Actors' },
      { Model: Genre, name: 'Genres' },
      { Model: Director, name: 'Directors' },
      { Model: Writer, name: 'Writers' }
    ];

    for (const { Model, name } of collections) {
      // Add createdBy and isSystemData to existing records
      const result = await Model.updateMany(
        { 
          $or: [
            { createdBy: { $exists: false } },
            { isSystemData: { $exists: false } }
          ]
        },
        { 
          $set: { 
            createdBy: adminUser._id,
            isSystemData: true 
          } 
        }
      );
      console.log(`✅ Updated ${result.modifiedCount} ${name} as system data`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📝 All existing master data is now marked as system data');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateToSystemData();
```

**Run command:** `node backend/scripts/migrateMasterDataSystemData.js`

### 1. Update Master Data Models

Add `createdBy` and `isSystemData` fields to track ownership and system data.

**File:** `backend/src/models/actor.model.js`

```javascript
import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Actor name is required'],
        trim: true,
        unique: true
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    photo: { 
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isSystemData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for default photo
actorSchema.virtual('photoUrl').get(function() {
    return this.photo || `https://ui-avatars.com/api/?name=${this.name}&background=random`;
});

// Indexes for performance
actorSchema.index({ createdBy: 1 });
actorSchema.index({ isSystemData: 1 });

const Actor = mongoose.model("Actor", actorSchema);
export default Actor;
```

**File:** `backend/src/models/genre.model.js`

```javascript
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Genre name is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isSystemData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
genreSchema.index({ createdBy: 1 });
genreSchema.index({ isSystemData: 1 });

const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
```

**File:** `backend/src/models/director.model.js`

```javascript
import mongoose from "mongoose";

const directorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Director name is required'],
        trim: true,
        unique: true
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    photo: { 
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isSystemData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for default photo
directorSchema.virtual('photoUrl').get(function() {
    return this.photo || `https://ui-avatars.com/api/?name=${this.name}&background=random`;
});

// Indexes for performance
directorSchema.index({ createdBy: 1 });
directorSchema.index({ isSystemData: 1 });

const Director = mongoose.model("Director", directorSchema);
export default Director;
```

**File:** `backend/src/models/writer.model.js`

```javascript
import mongoose from "mongoose";

const writerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Writer name is required'],
        trim: true,
        unique: true
    },
    bio: { 
        type: String,
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    dateOfBirth: {
        type: Date
    },
    nationality: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isSystemData: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
writerSchema.index({ createdBy: 1 });
writerSchema.index({ isSystemData: 1 });

const Writer = mongoose.model("Writer", writerSchema);
export default Writer;
```

## Phase 2: Backend - Services & Controllers

### 2. Update Master Data Controllers

**File:** `backend/src/controllers/master-data.controller.js`

Update existing create functions to include `createdBy`:

```javascript
import Director from "../models/director.model.js";
import Actor from "../models/actor.model.js";
import Genre from "../models/genre.model.js";
import Writer from "../models/writer.model.js";
import { createMasterDataService } from "../services/crud.service.js";
import { responseFactory, asyncHandler } from "../utils/index.js";

// Create service instances with ownership validation
const createOwnershipService = (Model) => {
  const baseService = createMasterDataService(Model);
  
  return {
    ...baseService,
    create: asyncHandler(async (req, res) => {
      const data = { ...req.body, createdBy: req.user._id, isSystemData: false };
      const record = new Model(data);
      const savedRecord = await record.save();
      return responseFactory.created(res, `${Model.modelName} created successfully`, savedRecord);
    }),
    update: asyncHandler(async (req, res) => {
      const record = await Model.findById(req.params.id);
      
      if (!record) {
        return responseFactory.notFound(res, `${Model.modelName} not found`);
      }
      
      // Check ownership - only allow edit if user created it OR user is admin
      if (record.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return responseFactory.forbidden(res, 'You can only edit master data you created');
      }
      
      const updatedRecord = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      return responseFactory.success(res, 200, `${Model.modelName} updated successfully`, updatedRecord);
    }),
    delete: asyncHandler(async (req, res) => {
      const record = await Model.findById(req.params.id);
      
      if (!record) {
        return responseFactory.notFound(res, `${Model.modelName} not found`);
      }
      
      // Check ownership - only allow delete if user created it OR user is admin
      if (record.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return responseFactory.forbidden(res, 'You can only delete master data you created');
      }
      
      await Model.findByIdAndDelete(req.params.id);
      return responseFactory.success(res, 200, `${Model.modelName} deleted successfully`);
    })
  };
};

// Create services with ownership checks
const directorService = createOwnershipService(Director);
const actorService = createOwnershipService(Actor);
const genreService = createOwnershipService(Genre);
const writerService = createOwnershipService(Writer);

// Director controllers
export const getDirectors = directorService.getAll;
export const getDirectorById = directorService.getById;
export const createDirector = directorService.create;
export const updateDirector = directorService.update;
export const deleteDirector = directorService.delete;

// Actor controllers
export const getActors = actorService.getAll;
export const getActorById = actorService.getById;
export const createActor = actorService.create;
export const updateActor = actorService.update;
export const deleteActor = actorService.delete;

// Genre controllers
export const getGenres = genreService.getAll;
export const getGenreById = genreService.getById;
export const createGenre = genreService.create;
export const updateGenre = genreService.update;
export const deleteGenre = genreService.delete;

// Writer controllers
export const getWriters = writerService.getAll;
export const getWriterById = writerService.getById;
export const createWriter = writerService.create;
export const updateWriter = writerService.update;
export const deleteWriter = writerService.delete;

// Get all master data in one request
export const getAllMasterData = asyncHandler(async (req, res) => {
    const [directors, actors, genres, writers] = await Promise.all([
        Director.find().sort({ name: 1 }),
        Actor.find().sort({ name: 1 }),
        Genre.find().sort({ name: 1 }),
        Writer.find().sort({ name: 1 })
    ]);

    const masterData = {
        directors,
        actors,
        genres,
        writers
    };

    return responseFactory.success(res, 200, 'Master data fetched successfully', masterData);
});

// Get casts (actors) for dropdown
export const getCasts = actorService.getAllSimple;
```

### 3. Admin Service - Master Data Management

**File:** `backend/src/services/admin.service.js`

Add these methods to existing `adminService` object (before closing `}`):

```javascript
/**
 * Get all master data items (admin sees everything, users see system + their own)
 */
getAllMasterData: async (query, user) => {
  const { type, page = 1, limit = 50, search = '' } = query;
  const skip = (page - 1) * limit;
  
  const Director = (await import('../models/director.model.js')).default;
  const Actor = (await import('../models/actor.model.js')).default;
  const Genre = (await import('../models/genre.model.js')).default;
  const Writer = (await import('../models/writer.model.js')).default;
  
  const models = {
    actors: Actor,
    genres: Genre,
    directors: Director,
    writers: Writer
  };
  
  let filter = search ? { name: { $regex: search, $options: 'i' } } : {};
  
  // If user is not admin, only show system data + their own data
  if (user && user.role !== 'admin') {
    filter.$or = [
      { isSystemData: true },
      { createdBy: user._id }
    ];
  }
  
  if (type && models[type]) {
    const Model = models[type];
    const items = await Model.find(filter)
      .populate('createdBy', 'username email')
      .sort({ isSystemData: -1, name: 1 }) // System data first, then alphabetical
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Model.countDocuments(filter);
    
    return {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  // Return counts for all types
  const [actorsCount, genresCount, directorsCount, writersCount] = await Promise.all([
    Actor.countDocuments(filter),
    Genre.countDocuments(filter),
    Director.countDocuments(filter),
    Writer.countDocuments(filter)
  ]);
  
  return {
    counts: {
      actors: actorsCount,
      genres: genresCount,
      directors: directorsCount,
      writers: writersCount
    }
  };
},

/**
 * Update master data item (admin can update all, users only their own)
 */
updateMasterDataItem: async (type, id, updateData, user) => {
  const Director = (await import('../models/director.model.js')).default;
  const Actor = (await import('../models/actor.model.js')).default;
  const Genre = (await import('../models/genre.model.js')).default;
  const Writer = (await import('../models/writer.model.js')).default;
  
  const models = {
    actors: Actor,
    genres: Genre,
    directors: Director,
    writers: Writer
  };
  
  const Model = models[type];
  if (!Model) {
    throw new Error('Invalid master data type');
  }
  
  const item = await Model.findById(id);
  if (!item) {
    throw new Error(`${type.slice(0, -1)} not found`);
  }
  
  // Check ownership if not admin
  if (user.role !== 'admin' && item.createdBy.toString() !== user._id.toString()) {
    throw new Error('You can only edit master data you created');
  }
  
  const updatedItem = await Model.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('createdBy', 'username email');
  
  return updatedItem;
},

/**
 * Delete master data item with usage check (admin can delete all, users only their own)
 */
deleteMasterDataItem: async (type, id, user) => {
  const Director = (await import('../models/director.model.js')).default;
  const Actor = (await import('../models/actor.model.js')).default;
  const Genre = (await import('../models/genre.model.js')).default;
  const Writer = (await import('../models/writer.model.js')).default;
  
  const models = {
    actors: { Model: Actor, field: 'cast' },
    genres: { Model: Genre, field: 'genres' },
    directors: { Model: Director, field: 'director' },
    writers: { Model: Writer, field: 'writers' }
  };
  
  const modelData = models[type];
  if (!modelData) {
    throw new Error('Invalid master data type');
  }
  
  const item = await modelData.Model.findById(id);
  if (!item) {
    throw new Error(`${type.slice(0, -1)} not found`);
  }
  
  // Check ownership if not admin
  if (user.role !== 'admin' && item.createdBy.toString() !== user._id.toString()) {
    throw new Error('You can only delete master data you created');
  }
  
  // Check if used in movies
  const isUsed = await Movie.findOne({ [modelData.field]: id });
  if (isUsed) {
    throw new Error(`Cannot delete ${type.slice(0, -1)}. It is being used in one or more movies.`);
  }
  
  await modelData.Model.findByIdAndDelete(id);
  return { message: `${type.slice(0, -1)} deleted successfully` };
},

/**
 * Get enhanced statistics with master data analytics
 */
getEnhancedStats: async () => {
  const Director = (await import('../models/director.model.js')).default;
  const Actor = (await import('../models/actor.model.js')).default;
  const Genre = (await import('../models/genre.model.js')).default;
  const Writer = (await import('../models/writer.model.js')).default;
  
  // Get basic counts
  const [actorsCount, genresCount, directorsCount, writersCount] = await Promise.all([
    Actor.countDocuments(),
    Genre.countDocuments(),
    Director.countDocuments(),
    Writer.countDocuments()
  ]);
  
  // Count system vs user-created data
  const [systemActors, systemGenres, systemDirectors, systemWriters] = await Promise.all([
    Actor.countDocuments({ isSystemData: true }),
    Genre.countDocuments({ isSystemData: true }),
    Director.countDocuments({ isSystemData: true }),
    Writer.countDocuments({ isSystemData: true })
  ]);
  
  // Get top actors usage
  const topActors = await Movie.aggregate([
    { $unwind: '$cast' },
    { $group: { _id: '$cast', count: { $sum: 1 } } },
    { $lookup: { from: 'actors', localField: '_id', foreignField: '_id', as: 'actor' } },
    { $unwind: '$actor' },
    { $project: { name: '$actor.name', count: 1, isSystemData: '$actor.isSystemData' } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  // Get top writers usage
  const topWriters = await Movie.aggregate([
    { $unwind: '$writers' },
    { $group: { _id: '$writers', count: { $sum: 1 } } },
    { $lookup: { from: 'writers', localField: '_id', foreignField: '_id', as: 'writer' } },
    { $unwind: '$writer' },
    { $project: { name: '$writer.name', count: 1, isSystemData: '$writer.isSystemData' } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  return {
    masterData: {
      counts: {
        actors: actorsCount,
        genres: genresCount,
        directors: directorsCount,
        writers: writersCount
      },
      systemData: {
        actors: systemActors,
        genres: systemGenres,
        directors: systemDirectors,
        writers: systemWriters
      },
      topActors,
      topWriters
    }
  };
}
```

### 4. Admin Controller - Master Data Endpoints

**File:** `backend/src/controllers/admin.controller.js`

Add these controller functions at the end (before the last line):

```javascript
/**
 * Get master data items (filtered by role)
 */
export const getMasterDataItems = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAllMasterData(req.query, req.user);
    return responseFactory.success(res, 200, 'Master data fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Update master data item (ownership check)
 */
export const updateMasterDataItem = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const updateData = req.body;

  try {
    const item = await adminService.updateMasterDataItem(type, id, updateData, req.user);
    return responseFactory.success(res, 200, `${type.slice(0, -1)} updated successfully`, item);
  } catch (error) {
    if (error.message.includes('not found')) {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('only edit')) {
      return responseFactory.forbidden(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Delete master data item (ownership check)
 */
export const deleteMasterDataItem = asyncHandler(async (req, res) => {
  const { type, id } = req.params;

  try {
    const result = await adminService.deleteMasterDataItem(type, id, req.user);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message.includes('not found')) {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('only delete')) {
      return responseFactory.forbidden(res, error.message);
    }
    if (error.message.includes('being used')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Get enhanced statistics with master data
 */
export const getEnhancedStats = asyncHandler(async (req, res) => {
  try {
    const [basicStats, enhancedStats] = await Promise.all([
      adminService.getSystemStats(),
      adminService.getEnhancedStats()
    ]);
    
    const combinedStats = {
      ...basicStats,
      ...enhancedStats
    };
    
    return responseFactory.success(res, 200, 'Enhanced statistics fetched successfully', combinedStats);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});
```

### 5. Admin Routes - Add Master Data Endpoints

**File:** `backend/src/routers/admin.route.js`

Update imports and add routes:

```javascript
// Update imports at the top
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllMoviesAdmin,
  updateAnyMovie,
  deleteAnyMovie,
  getAllReviews,
  deleteAnyReview,
  getSystemStats,
  getMasterDataItems,
  updateMasterDataItem,
  deleteMasterDataItem,
  getEnhancedStats
} from '../controllers/admin.controller.js';

// Add after existing routes (before export default router):

// Master data management routes (protected - admin only sees all, users see their own)
router.get('/master-data', getMasterDataItems);
router.put('/master-data/:type/:id', updateMasterDataItem);
router.delete('/master-data/:type/:id', deleteMasterDataItem);

// Enhanced statistics route
router.get('/stats/enhanced', getEnhancedStats);
```

## Phase 3: Frontend - Services & Hooks

### 6. Admin Service Functions

**File:** `frontend/src/lib/service.js`

Add at the end of the file:

```javascript
// ===== ADMIN MASTER DATA =====
export const getAdminMasterData = async (params = {}) => {
  const response = await API.get('/admin/master-data', { params });
  return response.data;
};

export const updateAdminMasterDataItem = async (type, id, data) => {
  const response = await API.put(`/admin/master-data/${type}/${id}`, data);
  return response.data;
};

export const deleteAdminMasterDataItem = async (type, id) => {
  const response = await API.delete(`/admin/master-data/${type}/${id}`);
  return response.data;
};

export const getEnhancedAdminStats = async () => {
  const response = await API.get('/admin/stats/enhanced');
  return response.data;
};
```

### 7. Admin Master Data Hook

**File:** `frontend/src/hooks/useAdminMasterData.js` (NEW FILE)

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminMasterData, 
  updateAdminMasterDataItem, 
  deleteAdminMasterDataItem 
} from '../lib/service';

export const useAdminMasterData = (type, params = {}) => {
  return useQuery({
    queryKey: ['admin-master-data', type, params],
    queryFn: () => getAdminMasterData({ type, ...params }),
    staleTime: 1000 * 60 * 5,
    enabled: !!type
  });
};

export const useUpdateAdminMasterData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, id, data }) => updateAdminMasterDataItem(type, id, data),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries(['admin-master-data', type]);
      queryClient.invalidateQueries(['admin-stats']);
    }
  });
};

export const useDeleteAdminMasterData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ type, id }) => deleteAdminMasterDataItem(type, id),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries(['admin-master-data', type]);
      queryClient.invalidateQueries(['admin-stats']);
    }
  });
};
```

### 8. Update Admin Stats Hook

**File:** `frontend/src/hooks/useAdminStats.js`

Replace existing content with:

```javascript
import { useQuery } from "@tanstack/react-query";
import { getEnhancedAdminStats } from "../lib/service";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => {
      console.log("🔍 Fetching enhanced admin stats...");
      return getEnhancedAdminStats();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error?.response?.status === 403 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    }
  });
};
```

## Phase 4: Frontend - Admin Components

### 9. Admin Master Data Component

**File:** `frontend/src/components/admin/AdminMasterData.jsx` (NEW FILE)

Create a comprehensive component that shows system data vs user data with proper permissions.

```javascript
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { 
  IconUsers, 
  IconTag, 
  IconVideo, 
  IconPencil,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconSearch,
  IconShield,
  IconLock
} from '@tabler/icons-react';
import { useAdminMasterData, useUpdateAdminMasterData, useDeleteAdminMasterData } from '../../hooks/useAdminMasterData';
import { useAuthContext } from '../../context/auth-provider';
import { toast } from 'sonner';

const TABS = [
  { value: 'actors', label: 'Actors', icon: IconUsers },
  { value: 'genres', label: 'Genres', icon: IconTag },
  { value: 'directors', label: 'Directors', icon: IconVideo },
  { value: 'writers', label: 'Writers', icon: IconPencil }
];

export default function AdminMasterData() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('actors');
  const [search, setSearch] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  const { data, isLoading } = useAdminMasterData(activeTab, { search });
  const updateMutation = useUpdateAdminMasterData();
  const deleteMutation = useDeleteAdminMasterData();

  const handleEdit = (item) => {
    setEditDialog({ open: true, item });
  };

  const handleDelete = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      name: formData.get('name'),
      bio: formData.get('bio')
    };

    try {
      await updateMutation.mutateAsync({
        type: activeTab,
        id: editDialog.item._id,
        data: updateData
      });
      toast.success(`${activeTab.slice(0, -1)} updated successfully`);
      setEditDialog({ open: false, item: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        type: activeTab,
        id: deleteDialog.item._id
      });
      toast.success(`${activeTab.slice(0, -1)} deleted successfully`);
      setDeleteDialog({ open: false, item: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete. Item may be in use.');
    }
  };

  const canEdit = (item) => {
    return user?.role === 'admin' || item.createdBy._id === user?._id;
  };

  const canDelete = (item) => {
    return user?.role === 'admin' || item.createdBy._id === user?._id;
  };

  const items = data?.items || [];
  const stats = data?.counts || {};

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Master Data Management</h2>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'admin' 
            ? 'Manage all system-wide master data'
            : 'View system data and manage your own master data'
          }
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {TABS.map((tab) => (
          <Card key={tab.value}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{tab.label}</CardTitle>
              <tab.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats[tab.value] || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Manage Items</CardTitle>
              <CardDescription>
                System data (read-only for users) and your own master data
              </CardDescription>
            </div>
            <div className="relative w-64">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <IconLoader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {tab.label.toLowerCase()} found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => {
                      const isOwner = item.createdBy._id === user?._id;
                      const canEditItem = canEdit(item);
                      const canDeleteItem = canDelete(item);
                      
                      return (
                        <div 
                          key={item._id} 
                          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent ${
                            item.isSystemData ? 'bg-muted/30' : isOwner ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.isSystemData && (
                                <Badge variant="secondary" className="text-xs">
                                  <IconShield className="h-3 w-3 mr-1" />
                                  System
                                </Badge>
                              )}
                              {isOwner && !item.isSystemData && (
                                <Badge variant="default" className="text-xs">
                                  Yours
                                </Badge>
                              )}
                              {!canEditItem && !canDeleteItem && (
                                <IconLock className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            {item.bio && (
                              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {item.bio}
                              </div>
                            )}
                            {item.createdBy && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Created by: {item.createdBy.username}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {canEditItem && (
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <IconEdit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDeleteItem && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(item)}
                                className="text-destructive hover:text-destructive"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, item: null })}>
        <DialogContent>
          <form onSubmit={handleSaveEdit}>
            <DialogHeader>
              <DialogTitle>Edit {activeTab.slice(0, -1)}</DialogTitle>
              <DialogDescription>Update the information below</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editDialog.item?.name} required />
              </div>
              {activeTab !== 'genres' && (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" defaultValue={editDialog.item?.bio} rows={4} />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialog({ open: false, item: null })}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDialog.item?.name}". This action cannot be undone.
              {deleteDialog.item?.isSystemData && (
                <span className="block mt-2 font-medium text-orange-600">
                  Warning: This is system data used by all users!
                </span>
              )}
              If this item is used in any movies, deletion will fail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteMutation.isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

### 10. Update Admin Dashboard

**File:** `frontend/src/components/admin/AdminDashboard.jsx`

```javascript
// Add import at the top
import AdminMasterData from "./AdminMasterData";

// Update renderContent function to include master-data case:
const renderContent = () => {
  switch (activeTab) {
    case "dashboard":
      return <SystemStats />;
    case "master-data":
      return <AdminMasterData />;
    case "users":
      return <UserManagement />;
    case "movies":
      return <MovieManagement />;
    case "reviews":
      return <ReviewModeration />;
    default:
      return (
        <div className="px-4 lg:px-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Select an option from the sidebar to manage the system.</p>
        </div>
      );
  }
};
```

### 11. Update Admin Sidebar

**File:** `frontend/src/components/admin/AdminSidebar.jsx`

```javascript
// Add import at the top
import { IconDatabase } from "@tabler/icons-react";

// Update navMain array in the data object:
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: IconDashboard,
    },
    {
      title: "Master Data",
      url: "#master-data",
      icon: IconDatabase,
    },
    {
      title: "User Management",
      url: "#users",
      icon: IconUsers,
    },
    {
      title: "Movie Management",
      url: "#movies",
      icon: IconMovie,
    },
    {
      title: "Review Moderation",
      url: "#reviews",
      icon: IconMessageCircle,
    },
  ],
  // ... rest unchanged
};
```

### 12. Update SystemStats Component

**File:** `frontend/src/components/admin/SystemStats.jsx`

Add these imports at the top:

```javascript
import { IconDatabase, IconPencil } from '@tabler/icons-react';
```

Add new chart sections after existing charts (around line 365, after Rating Statistics):

```javascript
{/* Master Data Charts */}
<div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mt-4 sm:mt-6">
  {/* Top Actors Chart */}
  <Card>
    <CardHeader className="pb-3 sm:pb-6">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
        <IconUsers className="h-4 w-4 sm:h-5 sm:w-5" />
        Top Actors Usage
      </CardTitle>
      <CardDescription className="text-xs sm:text-sm">Most frequently used actors</CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-48 sm:h-64 w-full" />
      ) : stats?.masterData?.topActors?.length > 0 ? (
        <div className="space-y-3">
          {stats.masterData.topActors.map((actor, index) => (
            <div key={actor._id || index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{actor.name}</span>
                {actor.isSystemData && (
                  <Badge variant="secondary" className="text-xs">System</Badge>
                )}
              </div>
              <Badge variant="secondary">{actor.count} movies</Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No actor data available</p>
      )}
    </CardContent>
  </Card>

  {/* Top Writers Chart */}
  <Card>
    <CardHeader className="pb-3 sm:pb-6">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
        <IconPencil className="h-4 w-4 sm:h-5 sm:w-5" />
        Top Writers Usage
      </CardTitle>
      <CardDescription className="text-xs sm:text-sm">Most frequently used writers</CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-48 sm:h-64 w-full" />
      ) : stats?.masterData?.topWriters?.length > 0 ? (
        <div className="space-y-3">
          {stats.masterData.topWriters.map((writer, index) => (
            <div key={writer._id || index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{writer.name}</span>
                {writer.isSystemData && (
                  <Badge variant="secondary" className="text-xs">System</Badge>
                )}
              </div>
              <Badge variant="secondary">{writer.count} movies</Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No writer data available</p>
      )}
    </CardContent>
  </Card>
</div>

{/* Master Data Statistics */}
<div className="mt-4 sm:mt-6">
  <Card>
    <CardHeader className="pb-3 sm:pb-6">
      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
        <IconDatabase className="h-4 w-4 sm:h-5 sm:w-5" />
        Master Data Overview
      </CardTitle>
      <CardDescription className="text-xs sm:text-sm">Total master data items in database</CardDescription>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
          <Skeleton className="h-16 sm:h-20 w-full" />
          <Skeleton className="h-16 sm:h-20 w-full" />
          <Skeleton className="h-16 sm:h-20 w-full" />
          <Skeleton className="h-16 sm:h-20 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats?.masterData?.counts?.actors || 0}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Actors</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ({stats?.masterData?.systemData?.actors || 0} system)
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {stats?.masterData?.counts?.genres || 0}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Genres</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ({stats?.masterData?.systemData?.genres || 0} system)
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                {stats?.masterData?.counts?.directors || 0}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Directors</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ({stats?.masterData?.systemData?.directors || 0} system)
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                {stats?.masterData?.counts?.writers || 0}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Writers</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ({stats?.masterData?.systemData?.writers || 0} system)
              </p>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</div>
```

## Key Features & Safety

### System Data vs User Master Data

1. **System Data** (isSystemData: true)

                                                - All existing master data becomes system data
                                                - Usable by all users in their movies
                                                - Only admin can edit/delete
                                                - Marked with "System" badge

2. **User Master Data** (isSystemData: false)

                                                - Users can create their own master data
                                                - Users can edit/delete ONLY what they created
                                                - Admin can edit/delete all user master data
                                                - Marked with "Yours" badge for creator

### Permission Matrix

| Action | System Data | User's Own Data | Other User's Data |

|--------|------------|-----------------|-------------------|

| **Admin View** | ✅ | ✅ | ✅ |

| **Admin Edit** | ✅ | ✅ | ✅ |

| **Admin Delete** | ✅ | ✅ | ✅ |

| **User View** | ✅ (read-only) | ✅ | ✅ (read-only) |

| **User Edit** | ❌ | ✅ | ❌ |

| **User Delete** | ❌ | ✅ | ❌ |

| **User Use in Movie** | ✅ | ✅ | ✅ |

### Movie Permissions (Unchanged)

- Users can ONLY edit/delete movies they created
- Admin can edit/delete ALL movies
- Already enforced in `movie-data-table.jsx` line 134

### Data Safety

1. **No breaking changes** - existing data preserved and enhanced
2. **Usage validation** - cannot delete master data used in movies
3. **Migration script** - safe migration of existing data
4. **Ownership tracking** - createdBy field tracks who created what
5. **Role-based access** - proper permission checks throughout

### Performance

1. **Indexed fields** - createdBy and isSystemData indexed for fast queries
2. **Optimized queries** - proper filtering and sorting
3. **Pagination** - large datasets handled efficiently

## Testing Checklist

1. ✅ Run migration script and verify all existing data marked as system data
2. ✅ Test admin can view/edit/delete all master data
3. ✅ Test user can view system data but cannot edit/delete
4. ✅ Test user can create their own master data
5. ✅ Test user can edit/delete only their own master data
6. ✅ Test user cannot edit/delete other users' master data
7. ✅ Test system data badge appears correctly
8. ✅ Test "Yours" badge appears for user's own data
9. ✅ Test deletion fails if item is used in movies
10. ✅ Test enhanced stats show correct system vs user data counts
11. ✅ Test users can only edit/delete their own movies (existing functionality)
12. ✅ Test charts render correctly with new data
13. ✅ Test search functionality in master data
14. ✅ Verify no breaking changes to existing movie functionality

## Implementation Order

1. **Run migration script first** - `node backend/scripts/migrateMasterDataSystemData.js`
2. **Update models** - add createdBy and isSystemData fields
3. **Update master data controllers** - add ownership checks
4. **Update admin service** - add master data methods with permission logic
5. **Update admin controller** - add master data endpoints
6. **Update admin routes** - register new routes
7. **Update frontend services** - add API functions
8. **Create hooks** - useAdminMasterData with mutations
9. **Create component** - AdminMasterData with permission UI
10. **Update dashboard** - integrate new component
11. **Update sidebar** - add master data menu item
12. **Update stats** - add master data analytics
13. **Test thoroughly** - run all tests before deploying

### To-dos

- [ ] Add master data management methods to admin.service.js
- [ ] Add master data controller functions to admin.controller.js
- [ ] Add master data routes to admin.route.js
- [ ] Add admin master data API functions to service.js
- [ ] Create useAdminMasterData.js hook
- [ ] Create AdminMasterData.jsx component
- [ ] Update AdminDashboard.jsx to include master data tab
- [ ] Update AdminSidebar.jsx with master data menu item
- [ ] Update useAdminStats.js to use enhanced stats endpoint
- [ ] Update SystemStats.jsx with master data charts