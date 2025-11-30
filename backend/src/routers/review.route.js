import express from "express";
import { protect } from "../middleware/verifyToken.js";
import {
    createReview,
    getMovieReviews,
    getUserMovieReview,
    updateReview,
    deleteReview,
    toggleReviewLike,
    getUserReviews,
    reportReview
} from "../controllers/review.controller.js";

const router = express.Router();

// Public routes
router.get("/movie/:movieId", getMovieReviews); // GET reviews for a movie

// Protected routes (require authentication)
router.use(protect);

// Review CRUD operations
router.post("/movie/:movieId", createReview); // POST create review for movie
router.get("/movie/:movieId/user", getUserMovieReview); // GET user's review for movie
router.put("/:reviewId", updateReview); // PUT update review
router.delete("/:reviewId", deleteReview); // DELETE review

// Review interactions
router.post("/:reviewId/like", toggleReviewLike); // POST like/unlike review
router.post("/:reviewId/report", reportReview); // POST report review

// User reviews
router.get("/user/reviews", getUserReviews); // GET user's all reviews

export default router;
