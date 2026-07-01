import api from './api.js';

export const searchGames = async (query, page = 1, limit = 20, ordering = '-rating') => {
  const res = await api.get('/games/search', {
    params: { q: query, page, limit, ordering }
  });
  return res.data;
};

export const getGameDetails = async (rawgId) => {
  const res = await api.get(`/games/${rawgId}`);
  return res.data;
};
