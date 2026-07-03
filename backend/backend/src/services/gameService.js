import * as rawgService from './rawgService.js';
import * as rawgMapper from '../mappers/rawgMapper.js';
import { expandAlias } from '../utils/searchAliases.js';
import { rankResults } from '../utils/searchRanking.js';
import prisma from '../lib/prisma.js';

export const searchGames = async (query, page, limit, ordering, filters = {}, userId = null) => {
  // 1. Expand gamer aliases (e.g. gta -> grand theft auto)
  const expandedQuery = expandAlias(query);

  // 2. Determine raw RAWG API ordering parameter
  let rawgOrdering = '';
  if (ordering === 'rating') rawgOrdering = '-rating';
  else if (ordering === 'popularity') rawgOrdering = '-added';
  else if (ordering === 'newest') rawgOrdering = '-released';
  else if (ordering === 'oldest') rawgOrdering = 'released';
  else if (ordering === 'alphabetical') rawgOrdering = 'name';

  // 3. Query external RAWG API
  const rawgData = await rawgService.searchGames(expandedQuery, page, limit, rawgOrdering);
  const hasNextPage = !!rawgData.next;

  // 4. Map raw results to design structure
  let games = rawgData.results?.map(rawgMapper.mapSearchGame) || [];

  // 5. Score and filter by Relevance Threshold (score >= 25)
  // We rank using the user's original query string to match their typed criteria
  let rankedGames = rankResults(query, games);

  // 6. Fetch user library if authenticated to set installed status
  let libraryEntries = [];
  if (userId) {
    libraryEntries = await prisma.libraryEntry.findMany({
      where: { userId },
      include: { game: true }
    });
  }

  const libraryMap = new Map(libraryEntries.map(e => [e.game.rawgId, e]));
  const processedGames = rankedGames.map(game => {
    const entry = libraryMap.get(game.rawgId);
    return {
      ...game,
      playStatus: entry ? entry.status : null,
      installed: !!entry
    };
  });

  // 7. Apply smart filters
  let filteredGames = processedGames;

  if (filters.genre) {
    const filterGenre = filters.genre.toLowerCase();
    filteredGames = filteredGames.filter(game =>
      game.genres?.some(g => g.toLowerCase().includes(filterGenre))
    );
  }

  if (filters.platform) {
    const filterPlatform = filters.platform.toLowerCase();
    filteredGames = filteredGames.filter(game =>
      game.platforms?.some(p => p.toLowerCase().includes(filterPlatform))
    );
  }

  if (filters.year) {
    filteredGames = filteredGames.filter(game => {
      if (!game.releaseDate) return false;
      const releaseYear = new Date(game.releaseDate).getFullYear();
      return releaseYear === filters.year;
    });
  }

  if (filters.rating) {
    filteredGames = filteredGames.filter(game => game.rating >= filters.rating);
  }

  if (filters.developer) {
    const filterDev = filters.developer.toLowerCase();
    filteredGames = filteredGames.filter(game =>
      game.developers?.some(d => d.toLowerCase().includes(filterDev))
    );
  }

  if (filters.publisher) {
    const filterPub = filters.publisher.toLowerCase();
    filteredGames = filteredGames.filter(game =>
      game.publishers?.some(p => p.toLowerCase().includes(filterPub))
    );
  }

  if (filters.playStatus) {
    filteredGames = filteredGames.filter(game => game.playStatus === filters.playStatus);
  }

  if (filters.installed) {
    if (filters.installed === 'installed') {
      filteredGames = filteredGames.filter(game => game.installed === true);
    } else if (filters.installed === 'not_installed') {
      filteredGames = filteredGames.filter(game => game.installed === false);
    }
  }

  // 8. Apply local sort if not relevance (relevance is already sorted by searchScore descending)
  if (ordering && ordering !== 'relevance') {
    filteredGames.sort((a, b) => {
      switch (ordering) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.added || 0) - (a.added || 0);
        case 'newest':
          return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
        case 'oldest':
          return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
  }

  return {
    games: filteredGames,
    hasNextPage
  };
};

export const getSearchSuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const rawgData = await rawgService.getGameSuggestions(query);
  return rawgData.results?.map(rawgMapper.mapSearchGame) || [];
};

export const getGameDetails = async (rawgId) => {
  const rawgData = await rawgService.getGameDetails(rawgId);
  return rawgMapper.mapGameDetails(rawgData);
};

