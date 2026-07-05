import { Router } from 'express';
import {
  getHomeData,
  getTrending,
  getMovies,
  getMovieById,
  getMovieTrailer,
  getTVShows,
  getTVById,
  getTVSeason,
  getTVTrailer,
  getGenres,
} from '../controllers/media.controller.js';

const router = Router();

// Home data aggregation
router.get('/home', getHomeData);

// Trending
router.get('/trending', getTrending);

// Genres
router.get('/genres', getGenres);

// Movies
router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);
router.get('/movies/:id/trailer', getMovieTrailer);

// TV Shows
router.get('/tv', getTVShows);
router.get('/tv/:id', getTVById);
router.get('/tv/:id/season/:seasonNumber', getTVSeason);
router.get('/tv/:id/trailer', getTVTrailer);

export default router;
