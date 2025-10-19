import express from "express";
import { protect } from "../middleware/verifyToken.js";
import {
    // Director routes
    getDirectors,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector,
    
    // Actor routes
    getActors,
    getActorById,
    createActor,
    updateActor,
    deleteActor,
    
    // Genre routes
    getGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
    
    // Writer routes
    getWriters,
    getWriterById,
    createWriter,
    updateWriter,
    deleteWriter,
    
    // Combined routes
    getAllMasterData,
    getGlobalMasterData,
    getCasts,
    getPublicCasts,
    getPublicActorById
} from "../controllers/master-data.controller.js";

const router = express.Router();

// Combined master data routes
router.get("/", protect, getAllMasterData); // GET all master data in one request (user's own) (protected)
router.get("/global", protect, getGlobalMasterData); // GET all global master data (all users) (protected)
router.get("/casts", protect, getCasts); // GET all actors for dropdown (user's own) (protected)
router.get("/public/casts", getPublicCasts); // GET all actors for public pages (no auth required)
router.get("/public/actors/:id", getPublicActorById); // GET single actor by ID (no auth required)

// Director routes
router.get("/directors", protect, getDirectors); // GET all directors with pagination (protected)
router.get("/directors/:id", protect, getDirectorById); // GET single director (protected)
router.post("/directors", protect, createDirector); // CREATE director (protected)
router.put("/directors/:id", protect, updateDirector); // UPDATE director (protected)
router.delete("/directors/:id", protect, deleteDirector); // DELETE director (protected)

// Actor routes
router.get("/actors", protect, getActors); // GET all actors with pagination (protected)
router.get("/actors/:id", protect, getActorById); // GET single actor (protected)
router.post("/actors", protect, createActor); // CREATE actor (protected)
router.put("/actors/:id", protect, updateActor); // UPDATE actor (protected)
router.delete("/actors/:id", protect, deleteActor); // DELETE actor (protected)

// Genre routes
router.get("/genres", protect, getGenres); // GET all genres with pagination (protected)
router.get("/genres/:id", protect, getGenreById); // GET single genre (protected)
router.post("/genres", protect, createGenre); // CREATE genre (protected)
router.put("/genres/:id", protect, updateGenre); // UPDATE genre (protected)
router.delete("/genres/:id", protect, deleteGenre); // DELETE genre (protected)

// Writer routes
router.get("/writers", protect, getWriters); // GET all writers with pagination (protected)
router.get("/writers/:id", protect, getWriterById); // GET single writer (protected)
router.post("/writers", protect, createWriter); // CREATE writer (protected)
router.put("/writers/:id", protect, updateWriter); // UPDATE writer (protected)
router.delete("/writers/:id", protect, deleteWriter); // DELETE writer (protected)

export default router;
