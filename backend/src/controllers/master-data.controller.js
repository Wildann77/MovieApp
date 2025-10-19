import Director from "../models/director.model.js";
import Actor from "../models/actor.model.js";
import Genre from "../models/genre.model.js";
import Writer from "../models/writer.model.js";
import { createMasterDataService } from "../services/crud.service.js";
import { responseFactory, asyncHandler, validatePagination, buildSearchFilter, buildPaginationResponse } from "../utils/index.js";

// Create service instances
const directorService = createMasterDataService(Director);
const actorService = createMasterDataService(Actor);
const genreService = createMasterDataService(Genre);
const writerService = createMasterDataService(Writer);

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

// Get all master data in one request (user's own data)
export const getAllMasterData = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
        return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const [directors, actors, genres, writers] = await Promise.all([
        Director.find({ createdBy: userId }).sort({ name: 1 }).populate('createdBy', 'username email'),
        Actor.find({ createdBy: userId }).sort({ name: 1 }).populate('createdBy', 'username email'),
        Genre.find({ createdBy: userId }).sort({ name: 1 }).populate('createdBy', 'username email'),
        Writer.find({ createdBy: userId }).sort({ name: 1 }).populate('createdBy', 'username email')
    ]);

    const masterData = {
        directors,
        actors,
        genres,
        writers
    };

    return responseFactory.success(res, 200, 'Master data fetched successfully', masterData);
});

// Get all global master data (all users' data) for dashboard use
export const getGlobalMasterData = asyncHandler(async (req, res) => {
    // This endpoint is accessible to all authenticated users for dashboard use
    const [directors, actors, genres, writers] = await Promise.all([
        Director.find({}).sort({ name: 1 }).populate('createdBy', 'username email'),
        Actor.find({}).sort({ name: 1 }).populate('createdBy', 'username email'),
        Genre.find({}).sort({ name: 1 }).populate('createdBy', 'username email'),
        Writer.find({}).sort({ name: 1 }).populate('createdBy', 'username email')
    ]);

    const masterData = {
        directors,
        actors,
        genres,
        writers
    };

    return responseFactory.success(res, 200, 'Global master data fetched successfully', masterData);
});

// Get casts (actors) for dropdown (user's own actors)
export const getCasts = actorService.getAllSimple;

// Get public casts for home page (all actors, no authentication required)
export const getPublicCasts = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 12 } = req.query;
    
    // Validate pagination
    const { page: validPage, limit: validLimit, skip } = validatePagination({ page, limit });
    
    // Build filter
    const filter = buildSearchFilter(search, ['name']);
    
    // Get total count
    const total = await Actor.countDocuments(filter);
    
    // Get records
    const records = await Actor.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(validLimit)
      .populate('createdBy', 'username email');
    
    // Build response
    const response = buildPaginationResponse(records, validPage, validLimit, total);
    
    return responseFactory.success(res, 200, 'Public casts fetched successfully', response.data, response.pagination);
});

// Get public single actor by ID (no authentication required)
export const getPublicActorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return responseFactory.badRequest(res, 'Actor ID is required');
    }
    
    const actor = await Actor.findById(id).populate('createdBy', 'username email');
    
    if (!actor) {
        return responseFactory.notFound(res, 'Actor not found');
    }
    
    return responseFactory.success(res, 200, 'Actor fetched successfully', actor);
});