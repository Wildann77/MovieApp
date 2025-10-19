import { responseFactory } from "../utils/response.js";

/**
 * Middleware to require admin role
 * Must be used after protect middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = (req, res, next) => {
    try {
        // Check if user is authenticated (should be set by protect middleware)
        if (!req.user) {
            return responseFactory.unauthorized(res, "Authentication required");
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return responseFactory.forbidden(res, "Admin access required");
        }

        // Check if user is active
        if (!req.user.isActive) {
            return responseFactory.forbidden(res, "Account is deactivated");
        }

        next();
    } catch (error) {
        return responseFactory.internalError(res, "Admin verification failed");
    }
};