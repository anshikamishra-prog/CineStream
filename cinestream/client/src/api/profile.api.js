import apiClient from './apiClient.js';

export const profileApi = {
  getProfiles: async () => {
    const response = await apiClient.get('/profiles');
    return response.data;
  },

  createProfile: async (data) => {
    const response = await apiClient.post('/profiles', data);
    return response.data;
  },

  updateProfile: async (profileId, data) => {
    const response = await apiClient.patch(`/profiles/${profileId}`, data);
    return response.data;
  },

  deleteProfile: async (profileId) => {
    const response = await apiClient.delete(`/profiles/${profileId}`);
    return response.data;
  },

  selectProfile: async (profileId) => {
    const response = await apiClient.post(`/profiles/${profileId}/select`);
    return response.data;
  },

  // My List
  getMyList: async (profileId) => {
    const response = await apiClient.get(`/profiles/${profileId}/my-list`);
    return response.data;
  },

  addToMyList: async (profileId, data) => {
    const response = await apiClient.post(`/profiles/${profileId}/my-list`, data);
    return response.data;
  },

  removeFromMyList: async (profileId, mediaId, mediaType) => {
    const response = await apiClient.delete(`/profiles/${profileId}/my-list/${mediaId}`, {
      params: { mediaType },
    });
    return response.data;
  },

  // Favorites
  getFavorites: async (profileId) => {
    const response = await apiClient.get(`/profiles/${profileId}/favorites`);
    return response.data;
  },

  addToFavorites: async (profileId, data) => {
    const response = await apiClient.post(`/profiles/${profileId}/favorites`, data);
    return response.data;
  },

  removeFromFavorites: async (profileId, mediaId, mediaType) => {
    const response = await apiClient.delete(`/profiles/${profileId}/favorites/${mediaId}`, {
      params: { mediaType },
    });
    return response.data;
  },

  // Watch History
  getWatchHistory: async (profileId) => {
    const response = await apiClient.get(`/profiles/${profileId}/history`);
    return response.data;
  },

  addToWatchHistory: async (profileId, data) => {
    const response = await apiClient.post(`/profiles/${profileId}/history`, data);
    return response.data;
  },

  clearWatchHistory: async (profileId) => {
    const response = await apiClient.delete(`/profiles/${profileId}/history`);
    return response.data;
  },

  // Continue Watching
  getContinueWatching: async (profileId) => {
    const response = await apiClient.get(`/profiles/${profileId}/continue-watching`);
    return response.data;
  },
};
