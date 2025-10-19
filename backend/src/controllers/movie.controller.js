import { movieService } from "../services/movie.service.js";
import { responseFactory, asyncHandler, validateRequiredFields } from "../utils/index.js";

// CREATE Movie
export const createMovie = asyncHandler(async (req, res) => {
  const { title, year, director } = req.body;

  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['title', 'year', 'director']);
  if (!requiredValidation.isValid) {
    return responseFactory.badRequest(res, requiredValidation.message);
  }

  try {
    const createdMovie = await movieService.createMovie(req.body, req.user._id);
    return responseFactory.created(res, 'Movie created successfully', createdMovie);
  } catch (error) {
    return responseFactory.badRequest(res, error.message);
  }
});

// GET all Movies with search, filter, pagination
export const getMovies = asyncHandler(async (req, res) => {
  try {
    const { movies, pagination } = await movieService.getMovies(req.query);
    return responseFactory.success(res, 200, 'Movies fetched successfully', movies, pagination);
  } catch (error) {
    return responseFactory.badRequest(res, error.message);
  }
});

// GET single Movie
export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await movieService.populateMovie(req.params.id);

  if (!movie) {
    return responseFactory.notFound(res, "Movie not found");
  }

  return responseFactory.success(res, 200, 'Movie fetched successfully', movie);
});

// GET Movies by Actor
export const getMoviesByActor = asyncHandler(async (req, res) => {
  try {
    const result = await movieService.getMoviesByActor(req.params.actorId, req.query);
    return responseFactory.success(res, 200, 'Movies by actor fetched successfully', result);
  } catch (error) {
    if (error.message === 'Actor not found') {
      return responseFactory.notFound(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});

// UPDATE Movie (owner only)
export const updateMovie = asyncHandler(async (req, res) => {
  try {
    const updatedMovie = await movieService.updateMovie(req.params.id, req.body, req.user._id);
    return responseFactory.success(res, 200, 'Movie updated successfully', updatedMovie);
  } catch (error) {
    if (error.message === 'Movie not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('You can only edit')) {
      return responseFactory.forbidden(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});

// DELETE Movie (owner only)
export const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const result = await movieService.deleteMovie(req.params.id, req.user._id);
    return responseFactory.success(res, 200, result.message);
  } catch (error) {
    if (error.message === 'Movie not found') {
      return responseFactory.notFound(res, error.message);
    }
    if (error.message.includes('You can only delete')) {
      return responseFactory.forbidden(res, error.message);
    }
    return responseFactory.badRequest(res, error.message);
  }
});