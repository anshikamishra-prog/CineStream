import { Router } from 'express';
import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  selectProfile,
  getMyList,
  addToMyList,
  removeFromMyList,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getWatchHistory,
  addToWatchHistory,
  clearWatchHistory,
  getContinueWatching,
} from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProfileValidator,
  updateProfileValidator,
  profileIdValidator,
} from '../validators/profile.validators.js';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// Profile CRUD
router.get('/', getProfiles);
router.post('/', createProfileValidator, validate, createProfile);
router.patch('/:profileId', updateProfileValidator, validate, updateProfile);
router.delete('/:profileId', profileIdValidator, validate, deleteProfile);
router.post('/:profileId/select', profileIdValidator, validate, selectProfile);

// My List
router.get('/:profileId/my-list', getMyList);
router.post('/:profileId/my-list', addToMyList);
router.delete('/:profileId/my-list/:mediaId', removeFromMyList);

// Favorites
router.get('/:profileId/favorites', getFavorites);
router.post('/:profileId/favorites', addToFavorites);
router.delete('/:profileId/favorites/:mediaId', removeFromFavorites);

// Watch History
router.get('/:profileId/history', getWatchHistory);
router.post('/:profileId/history', addToWatchHistory);
router.delete('/:profileId/history', clearWatchHistory);

// Continue Watching
router.get('/:profileId/continue-watching', getContinueWatching);

export default router;
