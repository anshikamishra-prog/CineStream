export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CineStream';

export const TMDB_IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BROWSE: '/browse',
  MOVIES: '/movies',
  TV: '/tv',
  SEARCH: '/search',
  PROFILES: '/profiles',
  PROFILES_MANAGE: '/profiles/manage',
  MY_LIST: '/my-list',
  FAVORITES: '/favorites',
  HISTORY: '/history',
  ACCOUNT: '/account',
  MEDIA: (type, id) => `/media/${type}/${id}`,
  WATCH: (type, id) => `/watch/${type}/${id}`,
};

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
};

export const QUERY_KEYS = {
  HOME_DATA: ['homeData'],
  MOVIES: (category, page) => ['movies', category, page],
  TV_SHOWS: (category, page) => ['tv', category, page],
  MEDIA_DETAIL: (type, id) => ['media', type, id],
  SEARCH: (query, type) => ['search', query, type],
  MY_LIST: (profileId) => ['myList', profileId],
  FAVORITES: (profileId) => ['favorites', profileId],
  HISTORY: (profileId) => ['history', profileId],
  CONTINUE_WATCHING: (profileId) => ['continueWatching', profileId],
};

export const LOCAL_STORAGE_KEYS = {
  THEME: 'cinestream_theme',
  VOLUME: 'cinestream_volume',
};
