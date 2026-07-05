import * as tmdb from '../services/tmdb.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

/**
 * @route   GET /api/search
 * @desc    Search across movies, TV shows, and people
 * @access  Public
 */
export const search = async (req, res, next) => {
  try {
    const { query, type = 'multi', page = 1 } = req.query;

    if (!query || query.trim().length < 1) {
      return next(new AppError('Search query is required', 400, 'MISSING_QUERY'));
    }

    if (query.trim().length < 2) {
      return next(new AppError('Search query must be at least 2 characters', 400, 'QUERY_TOO_SHORT'));
    }

    let data;
    const trimmedQuery = query.trim();

    switch (type) {
      case 'movie':
        data = await tmdb.searchMovies(trimmedQuery, page);
        break;
      case 'tv':
        data = await tmdb.searchTV(trimmedQuery, page);
        break;
      case 'multi':
      default:
        data = await tmdb.searchMulti(trimmedQuery, page);
        break;
    }

    // Filter out results with no poster or backdrop and adult content
    const filteredResults = data.results.filter(
      (item) =>
        !item.adult &&
        (item.poster_path || item.backdrop_path || item.profile_path)
    );

    return sendSuccess(res, 200, 'Search results retrieved', {
      ...data,
      results: filteredResults,
    });
  } catch (error) {
    return next(error);
  }
};
