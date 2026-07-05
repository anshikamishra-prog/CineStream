import User from '../models/User.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/jwt.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError, Errors } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(Errors.CONFLICT('An account with this email already exists'));
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store hashed refresh token in DB for rotation
    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, refreshToken);

    logger.info(`New user registered: ${email}`);

    return sendSuccess(
      res,
      201,
      'Account created successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profiles: user.profiles,
          subscription: user.subscription,
        },
        accessToken,
      }
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return tokens
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select('+password +refreshToken');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 403, 'ACCOUNT_INACTIVE'));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User logged in: ${email}`);

    return sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profiles: user.profiles,
        activeProfileId: user.activeProfileId,
        subscription: user.subscription,
      },
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Log out user and invalidate refresh token
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: '' } },
      { new: true }
    );

    clearRefreshTokenCookie(res);

    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Issue a new access token using a valid refresh token
 * @access  Public (uses cookie)
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return next(new AppError('Refresh token not found', 401, 'NO_REFRESH_TOKEN'));
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      clearRefreshTokenCookie(res);
      return next(new AppError('Invalid or reused refresh token', 401, 'INVALID_REFRESH_TOKEN'));
    }

    if (!user.isActive) {
      return next(new AppError('Account has been deactivated', 403, 'ACCOUNT_INACTIVE'));
    }

    // Rotate the refresh token for security
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, newRefreshToken);

    return sendSuccess(res, 200, 'Token refreshed', { accessToken: newAccessToken });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(Errors.NOT_FOUND('User'));
    }

    return sendSuccess(res, 200, 'User retrieved successfully', { user });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change authenticated user's password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 400, 'INCORRECT_PASSWORD'));
    }

    user.password = newPassword;
    await user.save();

    // Invalidate all sessions by clearing refresh token
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    clearRefreshTokenCookie(res);

    logger.info(`Password changed for user: ${user.email}`);

    return sendSuccess(res, 200, 'Password changed successfully. Please log in again.');
  } catch (error) {
    return next(error);
  }
};
