import { userService } from "../services/user.service.js";
import { responseFactory, asyncHandler, isValidEmail } from "../utils/index.js";

export const getCurrentUserController = asyncHandler(async (req, res) => {
    try {
        const user = await userService.getCurrentUser(req.user._id);
        return responseFactory.success(res, 200, "User fetched successfully", user);
    } catch (error) {
        if (error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

export const updateUserProfileController = asyncHandler(async (req, res) => {
    const { username, email, profilePic } = req.body;

    // Validate email format if provided
    if (email && !isValidEmail(email)) {
        return responseFactory.badRequest(res, "Invalid email format");
    }

    try {
        const updatedUser = await userService.updateUserProfile(req.user._id, { username, email, profilePic });
        return responseFactory.success(res, 200, "Profile updated successfully", updatedUser);
    } catch (error) {
        if (error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('already taken')) {
            return responseFactory.badRequest(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

export const addToFavoritesController = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const result = await userService.addToFavorites(req.user._id, movieId);
        return responseFactory.success(res, 200, "Movie added to favorites successfully", result);
    } catch (error) {
        if (error.message === 'Movie not found' || error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('already in favorites')) {
            return responseFactory.badRequest(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

export const removeFromFavoritesController = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const result = await userService.removeFromFavorites(req.user._id, movieId);
        return responseFactory.success(res, 200, "Movie removed from favorites successfully", result);
    } catch (error) {
        if (error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        if (error.message.includes('not in favorites')) {
            return responseFactory.badRequest(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

export const getFavoritesController = asyncHandler(async (req, res) => {
    try {
        const result = await userService.getFavorites(req.user._id, req.query);
        return responseFactory.success(res, 200, "Favorites fetched successfully", result.favorites, result.pagination);
    } catch (error) {
        if (error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});

export const toggleFavoriteController = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;

    try {
        const result = await userService.toggleFavorite(req.user._id, movieId);
        const message = result.isFavorite ? "Movie added to favorites" : "Movie removed from favorites";
        return responseFactory.success(res, 200, message, result);
    } catch (error) {
        if (error.message === 'Movie not found' || error.message === 'User not found') {
            return responseFactory.notFound(res, error.message);
        }
        return responseFactory.badRequest(res, error.message);
    }
});