import { reviewService } from "../services/review.service.js";
import { responseFactory, asyncHandler, validateRequiredFields, validateRating } from "../utils/index.js";

// CREATE Review
export const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const movieId = req.params.movieId;

    // Validate required fields
    const requiredValidation = validateRequiredFields(req.body, ['rating']);
    if (!requiredValidation.isValid) {
        return responseFactory.badRequest(res, requiredValidation.message);
    }

    // Validate rating
    const ratingValidation = validateRating(rating);
    if (!ratingValidation.isValid) {
        return responseFactory.badRequest(res, ratingValidation.message);
    }

    try {
        const review = await reviewService.createReview({ rating, comment }, movieId, req.user._id);
        return responseFactory.created(res, 'Review created successfully', review);
    } catch (error) {
        if (error.message === 'Movie not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('already reviewed')) {
            return responseFactory.badRequest(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// GET Reviews for a Movie
export const getMovieReviews = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const result = await reviewService.getMovieReviews(movieId, req.query);
        return responseFactory.success(res, 200, 'Reviews fetched successfully', result);
    } catch (error) {
        if (error.message === 'Movie not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// GET User's Review for a Movie
export const getUserMovieReview = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const review = await reviewService.getUserMovieReview(movieId, req.user._id);
        
        if (!review) {
            return responseFactory.success(res, 200, 'No review found', null);
        }

        return responseFactory.success(res, 200, 'Review fetched successfully', review);
    } catch (error) {
        if (error.message === 'Movie not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// UPDATE Review (owner only)
export const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;

    try {
        const updatedReview = await reviewService.updateReview(reviewId, { rating, comment }, req.user._id);
        return responseFactory.success(res, 200, 'Review updated successfully', updatedReview);
    } catch (error) {
        if (error.message === 'Review not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('You can only edit')) {
            return responseFactory.forbidden(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// DELETE Review (owner only)
export const deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        const result = await reviewService.deleteReview(reviewId, req.user._id);
        return responseFactory.success(res, 200, result.message);
    } catch (error) {
        if (error.message === 'Review not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('You can only delete')) {
            return responseFactory.forbidden(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// LIKE/UNLIKE Review
export const toggleReviewLike = asyncHandler(async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        const result = await reviewService.toggleReviewLike(reviewId, req.user._id);
        const message = result.liked ? 'Review liked successfully' : 'Review unliked successfully';
        return responseFactory.success(res, 200, message, result);
    } catch (error) {
        if (error.message === 'Review not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

// GET User's Reviews
export const getUserReviews = asyncHandler(async (req, res) => {
    try {
        const result = await reviewService.getUserReviews(req.user._id, req.query);
        return responseFactory.success(res, 200, 'User reviews fetched successfully', result);
    } catch (error) {
        return responseFactory.badRequest(res, error.message);
    }
});

// REPORT Review
export const reportReview = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const reviewId = req.params.reviewId;

    // Validate required fields
    const requiredValidation = validateRequiredFields(req.body, ['reason']);
    if (!requiredValidation.isValid) {
        return responseFactory.badRequest(res, requiredValidation.message);
    }

    try {
        const result = await reviewService.reportReview(reviewId, req.user._id, reason);
        return responseFactory.success(res, 200, 'Review reported successfully', result);
    } catch (error) {
        if (error.message === 'Review not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('already reported')) {
            return responseFactory.badRequest(res, error.message);
        }
        if (error.message.includes('cannot report')) {
            return responseFactory.badRequest(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});