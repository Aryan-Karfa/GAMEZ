import api from './api.js';

export const searchGames = async (query, page = 1, limit = 20, ordering = 'relevance', filters = {}, options = {}) => {
  const res = await api.get('/games/search', {
    params: {
      q: query,
      page,
      limit,
      ordering,
      ...filters
    },
    ...options
  });
  return res.data;
};

export const getSearchSuggestions = async (query, options = {}) => {
  const res = await api.get('/games/suggestions', {
    params: { q: query },
    ...options
  });
  return res.data;
};

export const getGameDetails = async (rawgId) => {
  const res = await api.get(`/games/${rawgId}`);
  return res.data;
};
