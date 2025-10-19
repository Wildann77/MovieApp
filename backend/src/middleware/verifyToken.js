import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { responseFactory } from "../utils/response.js";

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and adds user to request object
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Check for token in cookies
        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return responseFactory.unauthorized(res, "Access denied. No token provided.");
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return responseFactory.unauthorized(res, "Token is valid but user no longer exists.");
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return responseFactory.unauthorized(res, "Invalid token.");
        }
        if (error.name === 'TokenExpiredError') {
            return responseFactory.unauthorized(res, "Token expired.");
        }
        return responseFactory.unauthorized(res, "Token verification failed.");
    }
};

/**
 * Optional authentication middleware
 * Adds user to request if token is valid, but doesn't block if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};
