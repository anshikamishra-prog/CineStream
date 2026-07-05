import apiClient from './apiClient.js';

export const searchApi = {
  search: async ({ query, type = 'multi', page = 1 }) => {
    const response = await apiClient.get('/search', {
      params: { query, type, page },
    });
    return response.data;
  },
};
