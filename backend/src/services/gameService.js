import * as rawgService from './rawgService.js';
import * as rawgMapper from '../mappers/rawgMapper.js';

export const searchGames = async (query, page, limit, ordering) => {
  const rawgData = await rawgService.searchGames(query, page, limit, ordering);
  
  const games = rawgData.results?.map(rawgMapper.mapSearchGame) || [];
  const hasNextPage = !!rawgData.next;

  return {
    games,
    hasNextPage,
  };
};

export const getGameDetails = async (rawgId) => {
  const rawgData = await rawgService.getGameDetails(rawgId);
  return rawgMapper.mapGameDetails(rawgData);
};
