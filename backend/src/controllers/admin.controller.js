import { adminService } from "../services/admin.service.js";
import { responseFactory, asyncHandler, validateRequiredFields } from "../utils/index.js";

/**
 * Get all users with pagination and filtering
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    return responseFactory.success(res, 200, 'Users fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Update user role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['role']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const user = await adminService.updateUserRole(id, role);
    return responseFactory.success(res, 200, 'User role updated successfully', user);
  } catch (error) {
    if (error.message === 'User not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Toggle user status (ban/unban)
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['isActive']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const user = await adminService.toggleUserStatus(id, isActive);
    const action = user.isActive ? 'activated' : 'deactivated';
    return responseFactory.success(res, 200, `User ${action} successfully`, user);
  } catch (error) {
    if (error.message === 'User not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Delete user (admin override)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user._id;

  // Prevent admin from deleting themselves
  if (id === currentUserId.toString()) {
    return responseFactory.badRequest(res, 'Cannot delete your own account');
  }

  try {
    const result = await adminService.deleteUser(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'User not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('Cannot delete')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Get all movies (admin view)
 */
export const getAllMoviesAdmin = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAllMoviesAdmin(req.query);
    return responseFactory.success(res, 200, 'Movies fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Create any movie (admin override)
 */
export const createAnyMovie = asyncHandler(async (req, res) => {
  const { title, year, director } = req.body;

  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['title', 'year', 'director']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const createdMovie = await adminService.createAnyMovie(req.body, req.user._id);
    return responseFactory.created(res, 'Movie created successfully', createdMovie);
  } catch (error) {
    return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Update any movie (admin override)
 */
export const updateAnyMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const movie = await adminService.updateAnyMovie(id, updateData);
    return responseFactory.success(res, 200, 'Movie updated successfully', movie);
  } catch (error) {
    if (error.message === 'Movie not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Delete any movie (admin override)
 */
export const deleteAnyMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAnyMovie(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Movie not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Get all reviews with pagination and filtering
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAllReviews(req.query);
    return responseFactory.success(res, 200, 'Reviews fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Delete any review (admin override)
 */
export const deleteAnyReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAnyReview(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Review not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Get system statistics
 */
export const getSystemStats = asyncHandler(async (req, res) => {
  try {
    const stats = await adminService.getSystemStats();
    return responseFactory.success(res, 200, 'System statistics fetched successfully', stats);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Master Data Management - Actors
 */
export const getAdminActors = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAdminActors(req.query);
    return responseFactory.success(res, 200, 'Actors fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

export const createAdminActor = asyncHandler(async (req, res) => {
  const actorData = req.body;
  
  const requiredValidation = validateRequiredFields(req.body, ['name']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const actor = await adminService.createAdminActor(actorData, req.user._id);
    return responseFactory.success(res, 201, 'Actor created successfully', actor);
  } catch (error) {
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Actor with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const updateAdminActor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const actor = await adminService.updateAdminActor(id, updateData);
    return responseFactory.success(res, 200, 'Actor updated successfully', actor);
  } catch (error) {
    if (error.message === 'Actor not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Actor with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const deleteAdminActor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAdminActor(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Actor not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('Cannot delete')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Master Data Management - Directors
 */
export const getAdminDirectors = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAdminDirectors(req.query);
    return responseFactory.success(res, 200, 'Directors fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

export const createAdminDirector = asyncHandler(async (req, res) => {
  const directorData = req.body;
  
  const requiredValidation = validateRequiredFields(req.body, ['name']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const director = await adminService.createAdminDirector(directorData, req.user._id);
    return responseFactory.success(res, 201, 'Director created successfully', director);
  } catch (error) {
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Director with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const updateAdminDirector = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const director = await adminService.updateAdminDirector(id, updateData);
    return responseFactory.success(res, 200, 'Director updated successfully', director);
  } catch (error) {
    if (error.message === 'Director not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Director with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const deleteAdminDirector = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAdminDirector(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Director not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('Cannot delete')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Master Data Management - Writers
 */
export const getAdminWriters = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAdminWriters(req.query);
    return responseFactory.success(res, 200, 'Writers fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

export const createAdminWriter = asyncHandler(async (req, res) => {
  const writerData = req.body;
  
  const requiredValidation = validateRequiredFields(req.body, ['name']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const writer = await adminService.createAdminWriter(writerData, req.user._id);
    return responseFactory.success(res, 201, 'Writer created successfully', writer);
  } catch (error) {
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Writer with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const updateAdminWriter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const writer = await adminService.updateAdminWriter(id, updateData);
    return responseFactory.success(res, 200, 'Writer updated successfully', writer);
  } catch (error) {
    if (error.message === 'Writer not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Writer with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const deleteAdminWriter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAdminWriter(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Writer not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('Cannot delete')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});

/**
 * Master Data Management - Genres
 */
export const getAdminGenres = asyncHandler(async (req, res) => {
  try {
    const result = await adminService.getAdminGenres(req.query);
    return responseFactory.success(res, 200, 'Genres fetched successfully', result);
  } catch (error) {
    return responseFactory.internalError(res, error.message);
  }
});

export const createAdminGenre = asyncHandler(async (req, res) => {
  const genreData = req.body;
  
  const requiredValidation = validateRequiredFields(req.body, ['name']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const genre = await adminService.createAdminGenre(genreData, req.user._id);
    return responseFactory.success(res, 201, 'Genre created successfully', genre);
  } catch (error) {
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Genre with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const updateAdminGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const genre = await adminService.updateAdminGenre(id, updateData);
    return responseFactory.success(res, 200, 'Genre updated successfully', genre);
  } catch (error) {
    if (error.message === 'Genre not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.code === 11000) {
      return responseFactory.badRequest(res, 'Genre with this name already exists');
    }
    return responseFactory.badRequest(res, error.message);
  }
});

export const deleteAdminGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteAdminGenre(id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Genre not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('Cannot delete')) {
      return responseFactory.badRequest(res, error.message);
    }
    return responseFactory.internalError(res, error.message);
  }
});
