import Movie from "../models/movie.model.js";
import Director from "../models/director.model.js";
import Writer from "../models/writer.model.js";
import Actor from "../models/actor.model.js";
import Genre from "../models/genre.model.js";
import { processSingleItemToId, processItemsToIds, validatePagination, validateSort } from "../utils/index.js";

/**
 * Movie service functions
 */
export const movieService = {
  /**
   * Create movie with populated relations
   */
  createMovie: async (movieData, userId) => {
    // Process director
    const directorId = await processSingleItemToId(Director, movieData.director, userId);

    // Process writers
    const writerIds = await processItemsToIds(Writer, movieData.writers, userId);

    // Process cast
    const castIds = await processItemsToIds(Actor, movieData.cast, userId);

    // Process genres
    const genreIds = await processItemsToIds(Genre, movieData.genres, userId);

    // Create movie
    const movie = new Movie({
      ...movieData,
      director: directorId,
      writers: writerIds,
      cast: castIds,
      genres: genreIds,
      gallery: movieData.gallery || [],
      user: userId,
    });

    const createdMovie = await movie.save();
    return await movieService.populateMovie(createdMovie._id);
  },

  /**
   * Update movie with populated relations
   */
  updateMovie: async (movieId, updateData, userId) => {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check ownership
    if (movie.user.toString() !== userId.toString()) {
      throw new Error('You can only edit your own movies');
    }

    const updateFields = {};

    // Process director if provided
    if (updateData.director !== undefined) {
      updateFields.director = await processSingleItemToId(Director, updateData.director, userId);
    }

    // Process writers if provided
    if (updateData.writers !== undefined) {
      updateFields.writers = await processItemsToIds(Writer, updateData.writers, userId);
    }

    // Process cast if provided
    if (updateData.cast !== undefined) {
      updateFields.cast = await processItemsToIds(Actor, updateData.cast, userId);
    }

    // Process genres if provided
    if (updateData.genres !== undefined) {
      updateFields.genres = await processItemsToIds(Genre, updateData.genres, userId);
    }

    // Add other fields
    const allowedFields = ['title', 'year', 'duration', 'poster', 'heroImage', 'trailer', 'description', 'gallery'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updateFields,
      { new: true, runValidators: true }
    );

    return await movieService.populateMovie(updatedMovie._id);
  },

  /**
   * Populate movie with all relations
   */
  populateMovie: async (movieId) => {
    return await Movie.findById(movieId)
      .populate("director", "name photo bio photoUrl")
      .populate("writers", "name photo bio photoUrl")
      .populate("cast", "name photo bio photoUrl")
      .populate("genres", "name")
      .populate("user", "username email profilePic")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "username email profilePic"
        }
      });
  },

  /**
   * Build search filter for movies
   */
  buildMovieSearchFilter: async (search) => {
    if (!search) return {};

    const searchRegex = { $regex: search, $options: 'i' };
    
    // Get actors that match the search term
    const matchingActors = await Actor.find({ 
      name: searchRegex 
    }).select('_id');
    const actorIds = matchingActors.map(actor => actor._id);
    
    return {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { 'cast.name': searchRegex },
        { 'director.name': searchRegex },
        { 'writers.name': searchRegex },
        { cast: { $in: actorIds } }
      ]
    };
  },

  /**
   * Get movies with advanced filtering
   */
  getMovies: async (query) => {
    const { 
      search, 
      genre, 
      year, 
      director, 
      user,
      page = 1, 
      limit = 24, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      random = false
    } = query;

    // Validate pagination
    const maxLimit = 100;
    const { page: validPage, limit: validLimit, skip } = validatePagination({ 
      page, 
      limit: Math.min(parseInt(limit) || 24, maxLimit) 
    });
    
    // Build filter
    const filter = await movieService.buildMovieSearchFilter(search);
    
    // Add additional filters
    if (genre) {
      const genreDoc = await Genre.findOne({ name: { $regex: genre, $options: 'i' } });
      if (genreDoc) {
        filter.genres = genreDoc._id;
      }
    }

    if (year) {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        filter.year = yearNum;
      }
    }

    if (director) {
      const directorDoc = await Director.findOne({ name: { $regex: director, $options: 'i' } });
      if (directorDoc) {
        filter.director = directorDoc._id;
      }
    }

    if (user) {
      filter.user = user;
    }

    // Get total count
    const total = await Movie.countDocuments(filter);

    let movies;
    if (random === 'true' || random === true) {
      // Use aggregation for random sampling
      movies = await movieService.getRandomMovies(filter, validLimit);
    } else {
      // Validate sort
      const { sortOptions } = validateSort(sortBy, sortOrder, [
        'title', 'year', 'createdAt', 'averageRating', 'imdbRating', 'duration'
      ]);

      movies = await Movie.find(filter)
        .populate("director", "name photo bio")
        .populate("writers", "name photo bio")
        .populate("cast", "name photo bio")
        .populate("genres", "name")
        .populate("user", "username email profilePic")
        .sort(sortOptions)
        .skip(skip)
        .limit(validLimit)
        .lean();
    }

    // Build pagination response
    const totalPages = Math.ceil(total / validLimit);
    const pagination = {
      currentPage: validPage,
      totalPages,
      totalItems: total,
      itemsPerPage: validLimit,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
      nextPage: validPage < totalPages ? validPage + 1 : null,
      prevPage: validPage > 1 ? validPage - 1 : null
    };

    return { movies, pagination };
  },

  /**
   * Get random movies using aggregation
   */
  getRandomMovies: async (filter, limit) => {
    const pipeline = [
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
      {
        $lookup: {
          from: "directors",
          localField: "director",
          foreignField: "_id",
          as: "director",
          pipeline: [{ $project: { name: 1, photo: 1, bio: 1 } }]
        }
      },
      {
        $lookup: {
          from: "writers",
          localField: "writers",
          foreignField: "_id",
          as: "writers",
          pipeline: [{ $project: { name: 1, photo: 1, bio: 1 } }]
        }
      },
      {
        $lookup: {
          from: "actors",
          localField: "cast",
          foreignField: "_id",
          as: "cast",
          pipeline: [{ $project: { name: 1, photo: 1, bio: 1 } }]
        }
      },
      {
        $lookup: {
          from: "genres",
          localField: "genres",
          foreignField: "_id",
          as: "genres",
          pipeline: [{ $project: { name: 1 } }]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { username: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          director: { $arrayElemAt: ["$director", 0] },
          user: { $arrayElemAt: ["$user", 0] }
        }
      }
    ];
    
    return await Movie.aggregate(pipeline);
  },

  /**
   * Get movies by actor
   */
  getMoviesByActor: async (actorId, query) => {
    const { page = 1, limit = 10 } = query;
    
    // Check if actor exists
    const actor = await Actor.findById(actorId);
    if (!actor) {
      throw new Error('Actor not found');
    }

    // Validate pagination
    const { page: validPage, limit: validLimit, skip } = validatePagination({ page, limit });

    // Find movies where the actor is in the cast
    const movies = await Movie.find({ cast: actorId })
      .populate("director", "name photo bio")
      .populate("writers", "name photo bio")
      .populate("cast", "name photo bio")
      .populate("genres", "name")
      .populate("user", "username email")
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(validLimit);

    // Get total count for pagination
    const totalMovies = await Movie.countDocuments({ cast: actorId });

    // Build pagination response
    const totalPages = Math.ceil(totalMovies / validLimit);
    const pagination = {
      currentPage: validPage,
      totalPages,
      totalItems: totalMovies,
      itemsPerPage: validLimit,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1
    };

    return { 
      movies, 
      actor: {
        _id: actor._id,
        name: actor.name,
        photo: actor.photo,
        bio: actor.bio
      },
      pagination 
    };
  },

  /**
   * Delete movie with ownership check
   */
  deleteMovie: async (movieId, userId) => {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check ownership
    if (movie.user.toString() !== userId.toString()) {
      throw new Error('You can only delete your own movies');
    }

    await Movie.findByIdAndDelete(movieId);
    return { message: 'Movie deleted successfully' };
  }
};
