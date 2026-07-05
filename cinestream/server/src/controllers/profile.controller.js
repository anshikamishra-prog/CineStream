import User from '../models/User.model.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError, Errors } from '../utils/AppError.js';

const MAX_PROFILES = 5;
const MAX_CONTINUE_WATCHING = 20;
const MAX_WATCH_HISTORY = 100;

// ─── Profile Management ──────────────────────────────────────────────────────

/**
 * @route   GET /api/profiles
 * @desc    Get all profiles for the authenticated user
 * @access  Private
 */
export const getProfiles = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('profiles activeProfileId');
    return sendSuccess(res, 200, 'Profiles retrieved', {
      profiles: user.profiles,
      activeProfileId: user.activeProfileId,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/profiles
 * @desc    Create a new profile
 * @access  Private
 */
export const createProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('profiles');

    if (user.profiles.length >= MAX_PROFILES) {
      return next(new AppError(`Maximum of ${MAX_PROFILES} profiles allowed`, 400, 'MAX_PROFILES_REACHED'));
    }

    const { name, avatar = 'default', isKids = false, maturityRating = 'ALL' } = req.body;

    user.profiles.push({ name, avatar, isKids, maturityRating });
    await user.save({ validateBeforeSave: false });

    const newProfile = user.profiles[user.profiles.length - 1];

    return sendSuccess(res, 201, 'Profile created successfully', { profile: newProfile });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   PATCH /api/profiles/:profileId
 * @desc    Update a profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');

    const profile = user.profiles.id(profileId);
    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const { name, avatar, isKids, maturityRating, language } = req.body;

    if (name !== undefined) {
      profile.name = name;
    }
    if (avatar !== undefined) {
      profile.avatar = avatar;
    }
    if (isKids !== undefined) {
      profile.isKids = isKids;
    }
    if (maturityRating !== undefined) {
      profile.maturityRating = maturityRating;
    }
    if (language !== undefined) {
      profile.language = language;
    }

    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Profile updated successfully', { profile });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   DELETE /api/profiles/:profileId
 * @desc    Delete a profile
 * @access  Private
 */
export const deleteProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');

    if (user.profiles.length <= 1) {
      return next(new AppError('Cannot delete the last profile', 400, 'LAST_PROFILE'));
    }

    const profileIndex = user.profiles.findIndex((p) => p._id.toString() === profileId);

    if (profileIndex === -1) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    user.profiles.splice(profileIndex, 1);
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Profile deleted successfully');
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/profiles/:profileId/select
 * @desc    Set the active profile
 * @access  Private
 */
export const selectProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles activeProfileId');

    if (!user.hasProfile(profileId)) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    user.activeProfileId = profileId;
    await user.save({ validateBeforeSave: false });

    const profile = user.profiles.id(profileId);

    return sendSuccess(res, 200, 'Active profile updated', { profile, profileId });
  } catch (error) {
    return next(error);
  }
};

// ─── My List ─────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profiles/:profileId/my-list
 */
export const getMyList = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const sorted = [...profile.myList].sort((a, b) => b.addedAt - a.addedAt);
    return sendSuccess(res, 200, 'My List retrieved', { myList: sorted });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/profiles/:profileId/my-list
 */
export const addToMyList = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { mediaId, mediaType } = req.body;

    if (!mediaId || !mediaType) {
      return next(new AppError('mediaId and mediaType are required', 400, 'MISSING_FIELDS'));
    }

    if (!['movie', 'tv'].includes(mediaType)) {
      return next(new AppError('mediaType must be movie or tv', 400, 'INVALID_MEDIA_TYPE'));
    }

    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const exists = profile.myList.some(
      (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
    );

    if (exists) {
      return sendSuccess(res, 200, 'Already in My List', { added: false });
    }

    profile.myList.push({ mediaId: Number(mediaId), mediaType });
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 201, 'Added to My List', { added: true });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   DELETE /api/profiles/:profileId/my-list/:mediaId
 */
export const removeFromMyList = async (req, res, next) => {
  try {
    const { profileId, mediaId } = req.params;
    const { mediaType } = req.query;

    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const initialLength = profile.myList.length;
    profile.myList = profile.myList.filter(
      (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
    );

    if (profile.myList.length === initialLength) {
      return next(Errors.NOT_FOUND('Item'));
    }

    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Removed from My List', { removed: true });
  } catch (error) {
    return next(error);
  }
};

// ─── Favorites ───────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profiles/:profileId/favorites
 */
export const getFavorites = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const sorted = [...profile.favorites].sort((a, b) => b.addedAt - a.addedAt);
    return sendSuccess(res, 200, 'Favorites retrieved', { favorites: sorted });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/profiles/:profileId/favorites
 */
export const addToFavorites = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { mediaId, mediaType } = req.body;

    if (!mediaId || !mediaType) {
      return next(new AppError('mediaId and mediaType are required', 400, 'MISSING_FIELDS'));
    }

    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const exists = profile.favorites.some(
      (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
    );

    if (exists) {
      return sendSuccess(res, 200, 'Already in Favorites', { added: false });
    }

    profile.favorites.push({ mediaId: Number(mediaId), mediaType });
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 201, 'Added to Favorites', { added: true });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   DELETE /api/profiles/:profileId/favorites/:mediaId
 */
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { profileId, mediaId } = req.params;
    const { mediaType } = req.query;

    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    profile.favorites = profile.favorites.filter(
      (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
    );

    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Removed from Favorites');
  } catch (error) {
    return next(error);
  }
};

// ─── Watch History ────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profiles/:profileId/history
 */
export const getWatchHistory = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const sorted = [...profile.watchHistory].sort((a, b) => b.watchedAt - a.watchedAt);
    return sendSuccess(res, 200, 'Watch history retrieved', { watchHistory: sorted });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   POST /api/profiles/:profileId/history
 */
export const addToWatchHistory = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { mediaId, mediaType, title, posterPath, progress, duration, seasonNumber, episodeNumber } = req.body;

    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    // Update or add to watch history
    const existingIndex = profile.watchHistory.findIndex(
      (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
    );

    const historyEntry = {
      mediaId: Number(mediaId),
      mediaType,
      title,
      posterPath,
      progress,
      duration,
      watchedAt: new Date(),
      seasonNumber,
      episodeNumber,
    };

    if (existingIndex !== -1) {
      profile.watchHistory[existingIndex] = historyEntry;
    } else {
      profile.watchHistory.unshift(historyEntry);

      // Cap history size
      if (profile.watchHistory.length > MAX_WATCH_HISTORY) {
        profile.watchHistory = profile.watchHistory.slice(0, MAX_WATCH_HISTORY);
      }
    }

    // Update continue watching
    const progressValue = Number(progress) || 0;
    if (progressValue > 5 && progressValue < 95) {
      const continueIndex = profile.continueWatching.findIndex(
        (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
      );

      const continueEntry = {
        mediaId: Number(mediaId),
        mediaType,
        title,
        posterPath,
        backdropPath: req.body.backdropPath,
        progress: progressValue,
        duration,
        lastWatched: new Date(),
        seasonNumber,
        episodeNumber,
      };

      if (continueIndex !== -1) {
        profile.continueWatching[continueIndex] = continueEntry;
      } else {
        profile.continueWatching.unshift(continueEntry);
        if (profile.continueWatching.length > MAX_CONTINUE_WATCHING) {
          profile.continueWatching = profile.continueWatching.slice(0, MAX_CONTINUE_WATCHING);
        }
      }
    } else if (progressValue >= 95) {
      // Remove from continue watching if completed
      profile.continueWatching = profile.continueWatching.filter(
        (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
      );
    }

    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Watch history updated');
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   DELETE /api/profiles/:profileId/history
 */
export const clearWatchHistory = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    profile.watchHistory = [];
    await user.save({ validateBeforeSave: false });

    return sendSuccess(res, 200, 'Watch history cleared');
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/profiles/:profileId/continue-watching
 */
export const getContinueWatching = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user._id).select('profiles');
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return next(Errors.NOT_FOUND('Profile'));
    }

    const sorted = [...profile.continueWatching].sort((a, b) => b.lastWatched - a.lastWatched);
    return sendSuccess(res, 200, 'Continue watching retrieved', { continueWatching: sorted });
  } catch (error) {
    return next(error);
  }
};
