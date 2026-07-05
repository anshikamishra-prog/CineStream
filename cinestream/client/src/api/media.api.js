import apiClient from './apiClient.js';

export const mediaApi = {
  getHomeData: async () => {
    const response = await apiClient.get('/media/home');
    return response.data;
  },

  getTrending: async ({ type = 'all', timeWindow = 'day' } = {}) => {
    const response = await apiClient.get('/media/trending', {
      params: { type, timeWindow },
    });
    return response.data;
  },

  getMovies: async ({ category = 'popular', page = 1, genre } = {}) => {
    const response = await apiClient.get('/media/movies', {
      params: { category, page, genre },
    });
    return response.data;
  },

  getMovieById: async (id) => {
    const response = await apiClient.get(`/media/movies/${id}`);
    return response.data;
  },

  getMovieTrailer: async (id) => {
    const response = await apiClient.get(`/media/movies/${id}/trailer`);
    return response.data;
  },

  getTVShows: async ({ category = 'popular', page = 1, genre } = {}) => {
    const response = await apiClient.get('/media/tv', {
      params: { category, page, genre },
    });
    return response.data;
  },

  getTVById: async (id) => {
    const response = await apiClient.get(`/media/tv/${id}`);
    return response.data;
  },

  getTVSeason: async (id, seasonNumber) => {
    const response = await apiClient.get(`/media/tv/${id}/season/${seasonNumber}`);
    return response.data;
  },

  getTVTrailer: async (id) => {
    const response = await apiClient.get(`/media/tv/${id}/trailer`);
    return response.data;
  },

  getGenres: async () => {
    const response = await apiClient.get('/media/genres');
    return response.data;
  },
};
