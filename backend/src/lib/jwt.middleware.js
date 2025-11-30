import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../utils/constants.js";

/**
 * Generate JWT token for user
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
export const generateToken = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to generate token');
  }
  
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const decodeToken = (token) => {
  if (!token) {
    throw new Error('Token is required');
  }
  
  return jwt.decode(token);
};
