import rawgClient from '../lib/rawgClient.js';
import AppError from '../utils/AppError.js';
import { searchCache, detailsCache, suggestionsCache } from './rawgCache.js';

export const searchGames = async (query, page, limit, ordering, extraParams = {}) => {
  const cacheKey = `search:${query || ''}:${page || 1}:${limit || 20}:${ordering || ''}:${JSON.stringify(extraParams)}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await rawgClient.get('/games', {
      params: {
        search: query,
        page,
        page_size: limit,
        ordering,
        ...extraParams,
      },
    });
    searchCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleRawgError(error);
  }
};

export const getGameDetails = async (rawgId) => {
  const cacheKey = `details:${rawgId}`;
  const cached = detailsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await rawgClient.get(`/games/${rawgId}`);
    detailsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleRawgError(error);
  }
};

export const getGameSeries = async (rawgId) => {
  const cacheKey = `series:${rawgId}`;
  const cached = detailsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await rawgClient.get(`/games/${rawgId}/game-series`);
    detailsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleRawgError(error);
  }
};

export const getGameSuggestions = async (query) => {
  const cacheKey = `suggestions:${query}`;
  const cached = suggestionsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await rawgClient.get('/games', {
      params: {
        search: query,
        page_size: 5,
        ordering: '-added',
      },
    });
    suggestionsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleRawgError(error);
  }
};


const handleRawgError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      throw new AppError('External service authentication failed.', 500);
    }
    if (status === 404) {
      throw new AppError('Game not found.', 404);
    }
    if (status >= 500) {
      throw new AppError('External game database is temporarily unavailable.', 503);
    }
    throw new AppError(data?.detail || 'Error communicating with external game database.', status);
  } else if (error.code === 'ECONNABORTED') {
    throw new AppError('Connection to game database timed out.', 504);
  } else {
    throw new AppError(error.message || 'Network error communicating with external database.', 500);
  }
};
