import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import User from '../models/User.model.js';

/**
 * Middleware to protect routes that require authentication.
 * Extracts and validates the Bearer token from the Authorization header.
 */
export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication token is missing', 401, 'NO_TOKEN'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new AppError('Authentication token is malformed', 401, 'INVALID_TOKEN'));
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return next(new AppError('User no longer exists', 401, 'USER_NOT_FOUND'));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403, 'ACCOUNT_INACTIVE'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware to optionally authenticate a user.
 * Does not block the request if no token is present.
 */
export const optionalAuthenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (user && user.isActive) {
      req.user = user;
    }

    return next();
  } catch {
    // Silently continue without authentication
    return next();
  }
};

/**
 * Middleware factory to restrict access based on user roles.
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN')
      );
    }

    return next();
  };
};
