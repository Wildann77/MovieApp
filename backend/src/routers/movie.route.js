import express from "express";
import { createMovie, getMovies, getMovieById, getMoviesByActor, updateMovie, deleteMovie } from "../controllers/movie.controller.js";
import { protect } from "../middleware/verifyToken.js";

const router = express.Router();

// Movie routes
router.get("/all", getMovies); // GET all movies with pagination and filters
router.get("/actor/:actorId", getMoviesByActor); // GET movies by actor ID
router.get("/:id", getMovieById); // GET single movie by ID
router.post("/create", protect, createMovie); // CREATE movie (protected)
router.put("/:id", protect, updateMovie); // UPDATE movie (protected, owner only)
router.delete("/:id", protect, deleteMovie); // DELETE movie (protected, owner only)
// Note: Review routes moved to /api/reviews

export default router;
