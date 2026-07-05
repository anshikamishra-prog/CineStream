import User from '../models/User.model.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { Errors } from '../utils/AppError.js';

/**
 * @route   GET /api/users/me
 * @desc    Get full current user document
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(Errors.NOT_FOUND('User'));
    }

    return sendSuccess(res, 200, 'User retrieved', { user });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user's basic info (name only)
 * @access  Private
 */
export const updateCurrentUser = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Prevent password update through this route
    const allowedUpdates = { name };
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Account updated successfully', { user });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   DELETE /api/users/me
 * @desc    Deactivate current user's account
 * @access  Private
 */
export const deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      refreshToken: undefined,
    });

    res.clearCookie('refreshToken');

    return sendSuccess(res, 200, 'Account deactivated successfully');
  } catch (error) {
    return next(error);
  }
};
