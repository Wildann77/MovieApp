import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";
import Review from "../models/review.model.js";
import Actor from "../models/actor.model.js";
import Director from "../models/director.model.js";
import Writer from "../models/writer.model.js";
import Genre from "../models/genre.model.js";
import mongoose from "mongoose";

/**
 * Admin service functions for system management
 */
export const adminService = {
  /**
   * Get all users with pagination and search
   */
  getAllUsers: async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || '';
    const role = query.role || '';
    const status = query.status || '';

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (status && status !== '') {
      filter.isActive = status === 'active';
    }

    // Execute query with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    // Get statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get new users this month
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      data: users,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      },
      // Statistics
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisMonth
    };
  },

  /**
   * Update user role
   */
  updateUserRole: async (userId, role) => {
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be "user" or "admin"');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  /**
   * Toggle user status (ban/unban)
   */
  toggleUserStatus: async (userId, isActive) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = isActive;
    await user.save();

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      role: user.role
    };
  },

  /**
   * Delete user (admin override)
   */
  deleteUser: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is trying to delete themselves
    // Note: This check should be done in controller with req.user._id
    // But we'll add it here as an extra safety measure
    if (user.role === 'admin') {
      // Count total admin users
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }

    // Delete user's reviews first
    await Review.deleteMany({ user: userId });
    
    // Delete user's movies
    await Movie.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return { message: 'User deleted successfully' };
  },

  /**
   * Get all movies (admin view - bypass ownership)
   */
  getAllMoviesAdmin: async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || '';
    const year = query.year || '';
    const genre = query.genre || '';
    const director = query.director || '';

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (year) {
      filter.year = parseInt(year);
    }
    
    if (genre) {
      filter.genres = new mongoose.Types.ObjectId(genre);
    }
    
    if (director) {
      filter.director = new mongoose.Types.ObjectId(director);
    }

    // Execute query with pagination and population
    const movies = await Movie.find(filter)
      .populate('user', 'username email profilePic')
      .populate('director', 'name photo bio photoUrl')
      .populate('genres', 'name')
      .populate('cast', 'name photo bio photoUrl')
      .populate('writers', 'name photo bio photoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Movie.countDocuments(filter);

    // Get statistics
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    
    // Get new movies this month
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMoviesThisMonth = await Movie.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get average rating
    const ratingStats = await Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;

    return {
      data: movies,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      },
      // Statistics
      totalMovies,
      totalReviews,
      newMoviesThisMonth,
      averageRating
    };
  },

  /**
   * Update any movie (admin override)
   */
  updateAnyMovie: async (movieId, updateData) => {
    // Import movie service functions
    const { movieService } = await import('./movie.service.js');
    
    // Use the existing movie update logic but bypass ownership check
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Process the update data using the same logic as regular movie update
    // but without ownership validation
    const updateFields = {};

    // Process director if provided
    if (updateData.director !== undefined) {
      const { processSingleItemToId } = await import('../utils/index.js');
      updateFields.director = await processSingleItemToId(Director, updateData.director, movie.user);
    }

    // Process writers if provided
    if (updateData.writers !== undefined) {
      const { processItemsToIds } = await import('../utils/index.js');
      updateFields.writers = await processItemsToIds(Writer, updateData.writers, movie.user);
    }

    // Process cast if provided
    if (updateData.cast !== undefined) {
      const { processItemsToIds } = await import('../utils/index.js');
      updateFields.cast = await processItemsToIds(Actor, updateData.cast, movie.user);
    }

    // Process genres if provided
    if (updateData.genres !== undefined) {
      const { processItemsToIds } = await import('../utils/index.js');
      updateFields.genres = await processItemsToIds(Genre, updateData.genres, movie.user);
    }

    // Add other fields that don't need special processing
    const fieldsToUpdate = ['title', 'year', 'description', 'duration', 'poster', 'gallery', 'trailerUrl', 'imdbRating', 'releaseDate'];
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    // Update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('user', 'username email profilePic')
      .populate('director', 'name photo bio photoUrl')
      .populate('genres', 'name')
      .populate('cast', 'name photo bio photoUrl')
      .populate('writers', 'name photo bio photoUrl');

    return updatedMovie;
  },

  /**
   * Create any movie (admin override)
   */
  createAnyMovie: async (movieData, adminUserId) => {
    // Import movie service functions
    const { movieService } = await import('./movie.service.js');
    
    // Use the existing movie creation logic but with admin user
    const createdMovie = await movieService.createMovie(movieData, adminUserId);
    return createdMovie;
  },

  /**
   * Delete any movie (admin override)
   */
  deleteAnyMovie: async (movieId) => {
    // Delete associated reviews first
    await Review.deleteMany({ movie: movieId });
    
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    return { message: 'Movie and associated reviews deleted successfully' };
  },

  /**
   * Get all reviews with pagination and filtering
   */
  getAllReviews: async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || '';
    const reported = query.reported || '';
    const rating = query.rating || '';

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (reported !== '') {
      filter.isReported = reported === 'true';
    }
    
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Execute query with pagination and population
    const reviews = await Review.find(filter)
      .populate('user', 'username email profilePic')
      .populate('movie', 'title year')
      .populate('reportedBy.user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

    // Get statistics
    const totalReviews = await Review.countDocuments();
    const reportedReviews = await Review.countDocuments({ isReported: true });
    
    // Get new reviews this month
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thisMonthReviews = await Review.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get average rating
    const ratingStats = await Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;

    return {
      data: reviews,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
      },
      // Statistics
      totalReviews,
      reportedReviews,
      thisMonthReviews,
      averageRating
    };
  },

  /**
   * Delete any review (admin override)
   */
  deleteAnyReview: async (reviewId) => {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Update movie rating statistics
    await Movie.findById(review.movie).then(movie => {
      if (movie) {
        movie.updateRatingStats();
      }
    });

    return { message: 'Review deleted successfully' };
  },

  /**
   * Generic master data service functions
   */
  createMasterDataService: (Model, modelName) => ({
    getAll: async (query) => {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = query.search || '';

      const filter = {};
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }

      const items = await Model.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Model.countDocuments(filter);

      return {
        [modelName.toLowerCase() + 's']: items, // Add 's' to make it plural
        pagination: {
          currentPage: page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit)
        }
      };
    },

    create: async (data) => {
      const item = new Model(data);
      await item.save();
      return item;
    },

    update: async (id, updateData) => {
      const item = await Model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!item) {
        throw new Error(`${modelName} not found`);
      }

      return item;
    },

    delete: async (id, checkReferences = true) => {
      const item = await Model.findById(id);
      if (!item) {
        throw new Error(`${modelName} not found`);
      }

      if (checkReferences) {
        // Check if the item is referenced in movies
        const referencedMovies = await Movie.find({
          $or: [
            { [modelName.toLowerCase()]: id },
            { [`${modelName.toLowerCase()}s`]: id }
          ]
        });

        if (referencedMovies.length > 0) {
          throw new Error(`Cannot delete ${modelName.toLowerCase()}. It is referenced in ${referencedMovies.length} movie(s).`);
        }
      }

      await Model.findByIdAndDelete(id);
      return { message: `${modelName} deleted successfully` };
    }
  }),

  // Master Data Management - Actors
  getAdminActors: async (query) => {
    const service = adminService.createMasterDataService(Actor, 'Actor');
    return service.getAll(query);
  },

  createAdminActor: async (data, userId) => {
    const service = adminService.createMasterDataService(Actor, 'Actor');
    return service.create({ ...data, createdBy: userId });
  },

  updateAdminActor: async (id, data) => {
    const service = adminService.createMasterDataService(Actor, 'Actor');
    return service.update(id, data);
  },

  deleteAdminActor: async (id) => {
    const service = adminService.createMasterDataService(Actor, 'Actor');
    return service.delete(id);
  },

  // Master Data Management - Directors
  getAdminDirectors: async (query) => {
    const service = adminService.createMasterDataService(Director, 'Director');
    return service.getAll(query);
  },

  createAdminDirector: async (data, userId) => {
    const service = adminService.createMasterDataService(Director, 'Director');
    return service.create({ ...data, createdBy: userId });
  },

  updateAdminDirector: async (id, data) => {
    const service = adminService.createMasterDataService(Director, 'Director');
    return service.update(id, data);
  },

  deleteAdminDirector: async (id) => {
    const service = adminService.createMasterDataService(Director, 'Director');
    return service.delete(id);
  },

  // Master Data Management - Writers
  getAdminWriters: async (query) => {
    const service = adminService.createMasterDataService(Writer, 'Writer');
    return service.getAll(query);
  },

  createAdminWriter: async (data, userId) => {
    const service = adminService.createMasterDataService(Writer, 'Writer');
    return service.create({ ...data, createdBy: userId });
  },

  updateAdminWriter: async (id, data) => {
    const service = adminService.createMasterDataService(Writer, 'Writer');
    return service.update(id, data);
  },

  deleteAdminWriter: async (id) => {
    const service = adminService.createMasterDataService(Writer, 'Writer');
    return service.delete(id);
  },

  // Master Data Management - Genres
  getAdminGenres: async (query) => {
    const service = adminService.createMasterDataService(Genre, 'Genre');
    return service.getAll(query);
  },

  createAdminGenre: async (data, userId) => {
    const service = adminService.createMasterDataService(Genre, 'Genre');
    return service.create({ ...data, createdBy: userId });
  },

  updateAdminGenre: async (id, data) => {
    const service = adminService.createMasterDataService(Genre, 'Genre');
    return service.update(id, data);
  },

  deleteAdminGenre: async (id) => {
    const service = adminService.createMasterDataService(Genre, 'Genre');
    return service.delete(id);
  },

  /**
   * Get system statistics
   */
  getSystemStats: async () => {
    try {
      // Get basic counts
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const adminUsers = await User.countDocuments({ role: 'admin' });
      const totalMovies = await Movie.countDocuments();
      const totalReviews = await Review.countDocuments();

      // Get master data counts
      const totalActors = await Actor.countDocuments();
      const totalDirectors = await Director.countDocuments();
      const totalWriters = await Writer.countDocuments();
      const totalGenres = await Genre.countDocuments();

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      const recentMovies = await Movie.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      const recentReviews = await Review.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      // Get top genres
      const topGenres = await Movie.aggregate([
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $lookup: { from: 'genres', localField: '_id', foreignField: '_id', as: 'genre' } },
        { $unwind: '$genre' },
        { $project: { name: '$genre.name', count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Get top directors
      const topDirectors = await Movie.aggregate([
        { $group: { _id: '$director', count: { $sum: 1 } } },
        { $lookup: { from: 'directors', localField: '_id', foreignField: '_id', as: 'director' } },
        { $unwind: '$director' },
        { $project: { name: '$director.name', count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Get top actors
      const topActors = await Movie.aggregate([
        { $unwind: '$cast' },
        { $group: { _id: '$cast', count: { $sum: 1 } } },
        { $lookup: { from: 'actors', localField: '_id', foreignField: '_id', as: 'actor' } },
        { $unwind: '$actor' },
        { $project: { name: '$actor.name', count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Get average rating
      const ratingStats = await Review.aggregate([
        { $group: { _id: null, averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
      ]);

      return {
        overview: {
          totalUsers,
          activeUsers,
          adminUsers,
          totalMovies,
          totalReviews,
          totalActors,
          totalDirectors,
          totalWriters,
          totalGenres
        },
        recentActivity: {
          recentUsers,
          recentMovies,
          recentReviews
        },
        analytics: {
          topGenres,
          topDirectors,
          topActors,
          averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
          totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch system statistics: ${error.message}`);
    }
  }
};