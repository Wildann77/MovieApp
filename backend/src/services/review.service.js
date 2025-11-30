import Review from "../models/review.model.js";
import Movie from "../models/movie.model.js";

/**
 * Review service functions
 */
export const reviewService = {
  /**
   * Create review for a movie
   */
  createReview: async (reviewData, movieId, userId) => {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ 
      movie: movieId, 
      user: userId 
    });
    
    if (existingReview) {
      throw new Error('You have already reviewed this movie');
    }

    // Create review
    const review = new Review({
      movie: movieId,
      user: userId,
      rating: Number(reviewData.rating),
      comment: reviewData.comment || ''
    });

    const savedReview = await review.save();

    // Update movie rating statistics
    await movie.updateRatingStats();

    // Populate review for response
    return await Review.findById(savedReview._id)
      .populate('user', 'username email')
      .populate('movie', 'title');
  },

  /**
   * Get reviews for a movie with pagination
   */
  getMovieReviews: async (movieId, query) => {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'username email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ movie: movieId });

    return {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Get user's review for a specific movie
   */
  getUserMovieReview: async (movieId, userId) => {
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    const review = await Review.findOne({ 
      movie: movieId, 
      user: userId 
    }).populate('user', 'username email');

    return review;
  },

  /**
   * Update review
   */
  updateReview: async (reviewId, updateData, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      throw new Error('You can only edit your own reviews');
    }

    // Update fields
    if (updateData.rating !== undefined) {
      review.rating = Number(updateData.rating);
    }

    if (updateData.comment !== undefined) {
      review.comment = updateData.comment;
    }

    await review.save();

    // Update movie rating statistics
    const movie = await Movie.findById(review.movie);
    await movie.updateRatingStats();

    return await Review.findById(reviewId)
      .populate('user', 'username email')
      .populate('movie', 'title');
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Check ownership
    if (review.user.toString() !== userId.toString()) {
      throw new Error('You can only delete your own reviews');
    }

    const movieId = review.movie;
    await Review.findByIdAndDelete(reviewId);

    // Update movie rating statistics
    const movie = await Movie.findById(movieId);
    await movie.updateRatingStats();

    return { message: 'Review deleted successfully' };
  },

  /**
   * Toggle like/unlike review
   */
  toggleReviewLike: async (reviewId, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const likeIndex = review.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      review.likes.splice(likeIndex, 1);
      await review.save();
      return { 
        liked: false,
        likeCount: review.likes.length 
      };
    } else {
      // Like
      review.likes.push(userId);
      await review.save();
      return { 
        liked: true,
        likeCount: review.likes.length 
      };
    }
  },

  /**
   * Get user's all reviews
   */
  getUserReviews: async (userId, query) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ user: userId })
      .populate('movie', 'title poster year')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: userId });

    return {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Report a review
   */
  reportReview: async (reviewId, userId, reason) => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user is trying to report their own review
    if (review.user.toString() === userId.toString()) {
      throw new Error('You cannot report your own review');
    }

    // Check if user already reported this review
    const existingReport = review.reportedBy.find(report => 
      report.user.toString() === userId.toString()
    );

    if (existingReport) {
      throw new Error('You have already reported this review');
    }

    // Add report
    review.reportedBy.push({
      user: userId,
      reason: reason,
      reportedAt: new Date()
    });

    // Set isReported to true if this is the first report
    if (!review.isReported) {
      review.isReported = true;
      review.reportReason = reason;
    }

    await review.save();

    return {
      isReported: review.isReported,
      reportCount: review.reportedBy.length,
      message: 'Review reported successfully'
    };
  }
};
