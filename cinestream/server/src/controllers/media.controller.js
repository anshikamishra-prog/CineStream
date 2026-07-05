import * as tmdb from '../services/tmdb.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

/**
 * @route   GET /api/media/home
 * @desc    Fetch all home page data in a single aggregated call
 * @access  Public
 */
export const getHomeData = async (_req, res, next) => {
  try {
    const data = await tmdb.getHomePageData();
    return sendSuccess(res, 200, 'Home data retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/trending
 * @desc    Get trending movies and TV shows
 * @access  Public
 */
export const getTrending = async (req, res, next) => {
  try {
    const { timeWindow = 'day', type = 'all' } = req.query;

    let data;
    if (type === 'movie') {
      data = await tmdb.getTrendingMovies(timeWindow);
    } else if (type === 'tv') {
      data = await tmdb.getTrendingTV(timeWindow);
    } else {
      data = await tmdb.getTrendingAll(timeWindow);
    }

    return sendSuccess(res, 200, 'Trending content retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/movies
 * @desc    Get movies by category
 * @access  Public
 */
export const getMovies = async (req, res, next) => {
  try {
    const { category = 'popular', page = 1, genre } = req.query;

    let data;

    if (genre) {
      data = await tmdb.getMoviesByGenre(genre, page);
    } else {
      const categoryMap = {
        popular: tmdb.getPopularMovies,
        top_rated: tmdb.getTopRatedMovies,
        upcoming: tmdb.getUpcomingMovies,
        now_playing: tmdb.getNowPlayingMovies,
      };

      const fetcher = categoryMap[category];
      if (!fetcher) {
        return next(new AppError(`Invalid category: ${category}`, 400, 'INVALID_CATEGORY'));
      }

      data = await fetcher(page);
    }

    return sendSuccess(res, 200, 'Movies retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/movies/:id
 * @desc    Get movie details with videos, credits, and recommendations
 * @access  Public
 */
export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return next(new AppError('Invalid movie ID', 400, 'INVALID_ID'));
    }

    const data = await tmdb.getMovieDetails(id);
    return sendSuccess(res, 200, 'Movie details retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/movies/:id/trailer
 * @desc    Get the best available trailer for a movie
 * @access  Public
 */
export const getMovieTrailer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videos = await tmdb.getMovieVideos(id);
    const trailer = tmdb.extractTrailer(videos);

    return sendSuccess(res, 200, 'Trailer retrieved', { trailer });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/tv
 * @desc    Get TV shows by category
 * @access  Public
 */
export const getTVShows = async (req, res, next) => {
  try {
    const { category = 'popular', page = 1, genre } = req.query;

    let data;

    if (genre) {
      data = await tmdb.getTVShowsByGenre(genre, page);
    } else {
      const categoryMap = {
        popular: tmdb.getPopularTV,
        top_rated: tmdb.getTopRatedTV,
        on_air: tmdb.getOnAirTV,
      };

      const fetcher = categoryMap[category];
      if (!fetcher) {
        return next(new AppError(`Invalid category: ${category}`, 400, 'INVALID_CATEGORY'));
      }

      data = await fetcher(page);
    }

    return sendSuccess(res, 200, 'TV shows retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/tv/:id
 * @desc    Get TV show details with seasons, credits, and recommendations
 * @access  Public
 */
export const getTVById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return next(new AppError('Invalid TV show ID', 400, 'INVALID_ID'));
    }

    const data = await tmdb.getTVDetails(id);
    return sendSuccess(res, 200, 'TV show details retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/tv/:id/season/:seasonNumber
 * @desc    Get season details for a TV show
 * @access  Public
 */
export const getTVSeason = async (req, res, next) => {
  try {
    const { id, seasonNumber } = req.params;
    const data = await tmdb.getTVSeasonDetails(id, seasonNumber);
    return sendSuccess(res, 200, 'Season details retrieved', data);
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/tv/:id/trailer
 * @desc    Get the best available trailer for a TV show
 * @access  Public
 */
export const getTVTrailer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videos = await tmdb.getTVVideos(id);
    const trailer = tmdb.extractTrailer(videos);

    return sendSuccess(res, 200, 'Trailer retrieved', { trailer });
  } catch (error) {
    return next(error);
  }
};

/**
 * @route   GET /api/media/genres
 * @desc    Get all available genres for movies and TV
 * @access  Public
 */
export const getGenres = async (_req, res, next) => {
  try {
    const [movieGenres, tvGenres] = await Promise.all([
      tmdb.getMovieGenres(),
      tmdb.getTVGenres(),
    ]);

    return sendSuccess(res, 200, 'Genres retrieved', {
      movieGenres: movieGenres.genres,
      tvGenres: tvGenres.genres,
    });
  } catch (error) {
    return next(error);
  }
};
