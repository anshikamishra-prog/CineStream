import axios from 'axios';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/AppError.js';

const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Simple in-memory cache to reduce API calls
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key, data) => {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
};

// Axios instance for TMDB
const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('TMDB API error:', {
      status: error.response?.status,
      message: error.response?.data?.status_message || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      throw new AppError('TMDB API authentication failed. Check your API key.', 500, 'TMDB_AUTH_ERROR');
    }

    if (error.response?.status === 404) {
      throw new AppError('Media content not found', 404, 'MEDIA_NOT_FOUND');
    }

    if (error.code === 'ECONNABORTED') {
      throw new AppError('TMDB API request timed out', 504, 'TMDB_TIMEOUT');
    }

    throw new AppError('Failed to fetch media data', 502, 'TMDB_ERROR');
  }
);

/**
 * Makes a cached request to the TMDB API.
 */
const fetchFromTMDB = async (endpoint, params = {}) => {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  const { data } = await tmdbClient.get(endpoint, { params });
  setCache(cacheKey, data);
  return data;
};

// ─── Image Helpers ────────────────────────────────────────────────────────────
export const getImageUrl = (path, size = 'original') => {
  if (!path) {
    return null;
  }
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// ─── Movies ──────────────────────────────────────────────────────────────────
export const getTrendingMovies = (timeWindow = 'week') =>
  fetchFromTMDB(`/trending/movie/${timeWindow}`);

export const getPopularMovies = (page = 1) =>
  fetchFromTMDB('/movie/popular', { page });

export const getTopRatedMovies = (page = 1) =>
  fetchFromTMDB('/movie/top_rated', { page });

export const getUpcomingMovies = (page = 1) =>
  fetchFromTMDB('/movie/upcoming', { page });

export const getNowPlayingMovies = (page = 1) =>
  fetchFromTMDB('/movie/now_playing', { page });

export const getMovieDetails = (movieId) =>
  fetchFromTMDB(`/movie/${movieId}`, {
    append_to_response: 'videos,credits,similar,recommendations,images,external_ids',
  });

export const getMoviesByGenre = (genreId, page = 1) =>
  fetchFromTMDB('/discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
    include_adult: false,
  });

// ─── TV Shows ─────────────────────────────────────────────────────────────────
export const getTrendingTV = (timeWindow = 'week') =>
  fetchFromTMDB(`/trending/tv/${timeWindow}`);

export const getPopularTV = (page = 1) =>
  fetchFromTMDB('/tv/popular', { page });

export const getTopRatedTV = (page = 1) =>
  fetchFromTMDB('/tv/top_rated', { page });

export const getOnAirTV = (page = 1) =>
  fetchFromTMDB('/tv/on_the_air', { page });

export const getTVDetails = (tvId) =>
  fetchFromTMDB(`/tv/${tvId}`, {
    append_to_response: 'videos,credits,similar,recommendations,images,external_ids,content_ratings',
  });

export const getTVSeasonDetails = (tvId, seasonNumber) =>
  fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);

export const getTVShowsByGenre = (genreId, page = 1) =>
  fetchFromTMDB('/discover/tv', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
    include_adult: false,
  });

// ─── Genres ──────────────────────────────────────────────────────────────────
export const getMovieGenres = () => fetchFromTMDB('/genre/movie/list');

export const getTVGenres = () => fetchFromTMDB('/genre/tv/list');

// ─── Search ──────────────────────────────────────────────────────────────────
export const searchMulti = (query, page = 1) =>
  fetchFromTMDB('/search/multi', { query, page, include_adult: false });

export const searchMovies = (query, page = 1) =>
  fetchFromTMDB('/search/movie', { query, page, include_adult: false });

export const searchTV = (query, page = 1) =>
  fetchFromTMDB('/search/tv', { query, page, include_adult: false });

// ─── Trending ─────────────────────────────────────────────────────────────────
export const getTrendingAll = (timeWindow = 'day') =>
  fetchFromTMDB(`/trending/all/${timeWindow}`);

// ─── Videos/Trailers ─────────────────────────────────────────────────────────
export const getMovieVideos = (movieId) =>
  fetchFromTMDB(`/movie/${movieId}/videos`);

export const getTVVideos = (tvId) =>
  fetchFromTMDB(`/tv/${tvId}/videos`);

/**
 * Extracts the best trailer from a videos response.
 */
export const extractTrailer = (videos) => {
  if (!videos?.results?.length) {
    return null;
  }

  const results = videos.results;

  // Priority: Official Trailer → Trailer → Teaser → Clip
  const priority = ['Official Trailer', 'Trailer', 'Teaser', 'Clip'];

  for (const type of priority) {
    const found = results.find(
      (v) => v.site === 'YouTube' && v.type === (type === 'Official Trailer' ? 'Trailer' : type) &&
        (type !== 'Official Trailer' || v.name.toLowerCase().includes('official'))
    );
    if (found) {
      return found;
    }
  }

  // Fallback to first YouTube video
  return results.find((v) => v.site === 'YouTube') || null;
};

// ─── People ───────────────────────────────────────────────────────────────────
export const getPersonDetails = (personId) =>
  fetchFromTMDB(`/person/${personId}`, {
    append_to_response: 'movie_credits,tv_credits,images',
  });

// ─── Home Page Data Aggregation ───────────────────────────────────────────────
export const getHomePageData = async () => {
  const [
    trending,
    popularMovies,
    topRatedMovies,
    popularTV,
    topRatedTV,
    nowPlaying,
    movieGenres,
  ] = await Promise.all([
    getTrendingAll('day'),
    getPopularMovies(),
    getTopRatedMovies(),
    getPopularTV(),
    getTopRatedTV(),
    getNowPlayingMovies(),
    getMovieGenres(),
  ]);

  return {
    trending: trending.results,
    popularMovies: popularMovies.results,
    topRatedMovies: topRatedMovies.results,
    popularTV: popularTV.results,
    topRatedTV: topRatedTV.results,
    nowPlaying: nowPlaying.results,
    movieGenres: movieGenres.genres,
    hero: trending.results[0] || null,
  };
};
