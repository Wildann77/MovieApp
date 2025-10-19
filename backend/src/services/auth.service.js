import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.middleware.js";

/**
 * Auth service functions
 */
export const authService = {
  /**
   * Register new user
   */
  signup: async (userData) => {
    const { username, email, password } = userData;

    // Check if user already exists (case insensitive)
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Return user data without password
    return {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token
    };
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const { email, password } = credentials;

    // Find user (case insensitive email search)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data without password
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token
    };
  },

  /**
   * Logout user (client-side token removal)
   */
  logout: async () => {
    return { message: 'Logged out successfully' };
  }
};
