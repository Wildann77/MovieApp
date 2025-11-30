import User from "../models/user.model.js";
import Movie from "../models/movie.model.js";

/**
 * User service functions
 */
export const userService = {
  /**
   * Get current user profile
   */
  getCurrentUser: async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it's already taken by another user
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
      if (existingUser) {
        throw new Error('Email is already taken by another user');
      }
    }

    // Check if username is being changed and if it's already taken by another user
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findOne({ username: updateData.username, _id: { $ne: userId } });
      if (existingUser) {
        throw new Error('Username is already taken by another user');
      }
    }

    // Update user fields
    const allowedFields = ['username', 'email', 'profilePic'];
    const updateFields = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
  },

  /**
   * Add movie to favorites
   */
  addToFavorites: async (userId, movieId) => {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if movie is already in favorites
    if (user.favorites.includes(movieId)) {
      throw new Error('Movie is already in favorites');
    }

    // Add movie to favorites
    user.favorites.push(movieId);
    await user.save();

    // Populate the favorites with movie details
    await user.populate('favorites');

    return { favorites: user.favorites };
  },

  /**
   * Remove movie from favorites
   */
  removeFromFavorites: async (userId, movieId) => {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if movie is in favorites
    if (!user.favorites.includes(movieId)) {
      throw new Error('Movie is not in favorites');
    }

    // Remove movie from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    await user.save();

    // Populate the favorites with movie details
    await user.populate('favorites');

    return { favorites: user.favorites };
  },

  /**
   * Get user's favorites with filtering and pagination
   */
  getFavorites: async (userId, query) => {
    const { 
      page = 1, 
      limit = 24, 
      genre, 
      year, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = query;

    // Get user with favorites
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Build sort object
    let sortObj = {};
    switch (sortBy) {
      case 'title':
        sortObj.title = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'year':
        sortObj.year = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'averageRating':
      case 'rating':
        sortObj.averageRating = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'createdAt':
      default:
        sortObj.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Use aggregation pipeline for filtering, sorting, and pagination
    const pipeline = [
      { $match: { _id: { $in: user.favorites } } },
      {
        $lookup: {
          from: 'genres',
          localField: 'genres',
          foreignField: '_id',
          as: 'genres'
        }
      },
      {
        $lookup: {
          from: 'directors',
          localField: 'director',
          foreignField: '_id',
          as: 'director'
        }
      },
      {
        $lookup: {
          from: 'writers',
          localField: 'writers',
          foreignField: '_id',
          as: 'writers'
        }
      },
      {
        $lookup: {
          from: 'actors',
          localField: 'cast',
          foreignField: '_id',
          as: 'cast'
        }
      },
      // Apply filters after lookups
      ...(genre && genre !== 'all' ? [{ $match: { 'genres.name': genre } }] : []),
      ...(year && year !== 'all' ? [{ $match: { year: parseInt(year) } }] : []),
      { $sort: sortObj },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNum }
          ],
          meta: [
            { $count: "total" }
          ]
        }
      }
    ];

    const result = await Movie.aggregate(pipeline);
    
    const favorites = result[0]?.data || [];
    const total = result[0]?.meta[0]?.total || 0;

    return {
      favorites,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (userId, movieId) => {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    } else {
      // Add to favorites
      user.favorites.push(movieId);
    }

    await user.save();

    return {
      isFavorite: !isFavorite,
      favoritesCount: user.favorites.length
    };
  }
};
