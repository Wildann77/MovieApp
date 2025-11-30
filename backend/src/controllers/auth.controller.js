import { authService } from "../services/auth.service.js";
import { responseFactory, asyncHandler, validateRequiredFields, validatePassword, isValidEmail } from "../utils/index.js";

/**
 * Signup user
 */
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['username', 'email', 'password']);
  if (!requiredValidation.isValid) {
      return responseFactory.badRequest(res, requiredValidation.message);
  }

  // Validate email format
  if (!isValidEmail(email)) {
      return responseFactory.badRequest(res, 'Invalid email format');
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
      return responseFactory.badRequest(res, passwordValidation.message);
  }

  try {
      const userResponse = await authService.signup({ username, email, password });
      return responseFactory.created(res, 'User created successfully', userResponse);
  } catch (error) {
      return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Login user
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  const requiredValidation = validateRequiredFields(req.body, ['email', 'password']);
  if (!requiredValidation.isValid) {
      return responseFactory.badRequest(res, requiredValidation.message);
  }

  // Validate email format
  if (!isValidEmail(email)) {
      return responseFactory.badRequest(res, 'Invalid email format');
  }

  try {
      const userResponse = await authService.login({ email, password });
      return responseFactory.success(res, 200, 'Login successful', userResponse);
  } catch (error) {
      return responseFactory.badRequest(res, error.message);
  }
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout();
  return responseFactory.success(res, 200, result.message);
});