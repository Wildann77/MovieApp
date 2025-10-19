import express from 'express';
import { protect } from '../middleware/verifyToken.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllMoviesAdmin,
  createAnyMovie,
  updateAnyMovie,
  deleteAnyMovie,
  getAllReviews,
  deleteAnyReview,
  getSystemStats,
  // Master Data - Actors
  getAdminActors,
  createAdminActor,
  updateAdminActor,
  deleteAdminActor,
  // Master Data - Directors
  getAdminDirectors,
  createAdminDirector,
  updateAdminDirector,
  deleteAdminDirector,
  // Master Data - Writers
  getAdminWriters,
  createAdminWriter,
  updateAdminWriter,
  deleteAdminWriter,
  // Master Data - Genres
  getAdminGenres,
  createAdminGenre,
  updateAdminGenre,
  deleteAdminGenre
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protect and requireAdmin middleware to all routes
router.use(protect, requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Movie management routes
router.get('/movies', getAllMoviesAdmin);
router.post('/movies', createAnyMovie);
router.put('/movies/:id', updateAnyMovie);
router.delete('/movies/:id', deleteAnyMovie);

// Review management routes
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteAnyReview);

// System statistics
router.get('/stats', getSystemStats);

// Master Data Management Routes
// Actors
router.get('/master-data/actors', getAdminActors);
router.post('/master-data/actors', createAdminActor);
router.put('/master-data/actors/:id', updateAdminActor);
router.delete('/master-data/actors/:id', deleteAdminActor);

// Directors
router.get('/master-data/directors', getAdminDirectors);
router.post('/master-data/directors', createAdminDirector);
router.put('/master-data/directors/:id', updateAdminDirector);
router.delete('/master-data/directors/:id', deleteAdminDirector);

// Writers
router.get('/master-data/writers', getAdminWriters);
router.post('/master-data/writers', createAdminWriter);
router.put('/master-data/writers/:id', updateAdminWriter);
router.delete('/master-data/writers/:id', deleteAdminWriter);

// Genres
router.get('/master-data/genres', getAdminGenres);
router.post('/master-data/genres', createAdminGenre);
router.put('/master-data/genres/:id', updateAdminGenre);
router.delete('/master-data/genres/:id', deleteAdminGenre);

export default router;

