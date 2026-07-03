import prisma from '../lib/prisma.js';
import * as rawgService from './rawgService.js';
import * as rawgMapper from '../mappers/rawgMapper.js';
import { recommendationCache } from './rawgCache.js';

/**
 * Personalization engine generating dashboard recommendations based on the user's library preferences.
 */
export const getRecommendations = async (userId) => {
  const cacheKey = `recommendations:${userId}`;
  const cached = recommendationCache.get(cacheKey);
  if (cached) return cached;

  // 1. Fetch user's library entries
  const libraryEntries = await prisma.libraryEntry.findMany({
    where: { userId },
    include: { game: true }
  });

  const libraryRawgIds = new Set(libraryEntries.map(e => e.game.rawgId));

  // 2. Fetch detailed library games from RAWG (up to 10 most recent) to construct user preference profile
  const libraryDetails = await Promise.all(
    libraryEntries.slice(0, 10).map(async (entry) => {
      try {
        return await rawgService.getGameDetails(entry.game.rawgId);
      } catch (err) {
        return null;
      }
    })
  );
  const activeDetails = libraryDetails.filter(Boolean);

  // Compute genre, developer, and tag frequencies
  const genreCounts = {};
  const developerCounts = {};
  const tagCounts = {};

  activeDetails.forEach(game => {
    const entry = libraryEntries.find(e => e.game.rawgId === game.rawgId);
    let weight = 1;
    if (entry) {
      if (entry.status === 'PLAYING') weight = 3;
      else if (entry.status === 'COMPLETED') weight = 2;
    }

    game.genres?.forEach(g => {
      genreCounts[g.slug] = (genreCounts[g.slug] || 0) + weight;
    });
    game.developers?.forEach(d => {
      developerCounts[d.slug] = (developerCounts[d.slug] || 0) + weight;
    });
    game.tags?.forEach(t => {
      tagCounts[t.slug] = (tagCounts[t.slug] || 0) + weight;
    });
  });

  const getTopKeys = (counts, limit = 3) => {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, limit);
  };

  const topGenres = getTopKeys(genreCounts, 3);
  const topDevelopers = getTopKeys(developerCounts, 3);
  const topTags = getTopKeys(tagCounts, 10);

  // Helper to map RAWG results and exclude games already in the user's library
  const cleanAndMap = (rawgResults) => {
    if (!rawgResults || !Array.isArray(rawgResults)) return [];
    return rawgResults
      .map(rawgMapper.mapSearchGame)
      .filter(game => !libraryRawgIds.has(game.rawgId));
  };

  // Date constants for Recent & Upcoming queries
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const eighteenMonthsAgo = new Date();
  eighteenMonthsAgo.setMonth(today.getMonth() - 18);
  const eighteenMonthsAgoStr = eighteenMonthsAgo.toISOString().split('T')[0];

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const futureLimit = new Date();
  futureLimit.setFullYear(today.getFullYear() + 2);
  const futureLimitStr = futureLimit.toISOString().split('T')[0];

  // 3. Fetch default/global modules in parallel
  const [
    rawTrending,
    rawRecent,
    rawUpcoming,
    rawFavorites,
  ] = await Promise.all([
    rawgService.searchGames('', 1, 12, '-added'),
    rawgService.searchGames('', 1, 12, '-released', { dates: `${eighteenMonthsAgoStr},${todayStr}` }),
    rawgService.searchGames('', 1, 12, 'released', { dates: `${tomorrowStr},${futureLimitStr}` }),
    rawgService.searchGames('', 1, 12, '-rating'),
  ]);

  const trendingNow = cleanAndMap(rawTrending?.results);
  const recentlyReleased = cleanAndMap(rawRecent?.results);
  const upcomingReleases = cleanAndMap(rawUpcoming?.results);
  const communityFavorites = cleanAndMap(rawFavorites?.results);

  // Hidden Gems: Highly rated but low added/popularity counts
  const rawRatingList = await rawgService.searchGames('', 1, 40, '-rating');
  const hiddenGems = (rawRatingList?.results || [])
    .map(rawgMapper.mapSearchGame)
    .filter(g => !libraryRawgIds.has(g.rawgId) && g.rating >= 4.0 && (g.added || 0) < 5000 && (g.added || 0) > 10)
    .slice(0, 12);

  // Continue Your Journey: Similar to playing games
  let continueYourJourney = [];
  const playingGames = libraryEntries
    .filter(e => e.status === 'PLAYING')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (playingGames.length > 0) {
    const topPlaying = playingGames[0];
    try {
      const series = await rawgService.getGameSeries(topPlaying.game.rawgId);
      continueYourJourney = cleanAndMap(series?.results);
    } catch (e) {
      const topPlayingDetails = activeDetails.find(d => d.rawgId === topPlaying.game.rawgId);
      if (topPlayingDetails?.genres?.length > 0) {
        const gen = topPlayingDetails.genres[0].slug;
        const res = await rawgService.searchGames('', 1, 12, '-added', { genres: gen });
        continueYourJourney = cleanAndMap(res?.results);
      }
    }
  }
  if (continueYourJourney.length === 0) {
    // Fallback: popular action titles
    const res = await rawgService.searchGames('', 1, 12, '-added', { genres: 'action' });
    continueYourJourney = cleanAndMap(res?.results);
  }

  // Because You Played: Similar to completed titles
  let becauseYouPlayed = [];
  const completedGames = libraryEntries
    .filter(e => e.status === 'COMPLETED')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (completedGames.length > 0) {
    const topCompleted = completedGames[0];
    try {
      const series = await rawgService.getGameSeries(topCompleted.game.rawgId);
      becauseYouPlayed = cleanAndMap(series?.results);
    } catch (e) {
      const topCompletedDetails = activeDetails.find(d => d.rawgId === topCompleted.game.rawgId);
      if (topCompletedDetails?.genres?.length > 0) {
        const gen = topCompletedDetails.genres[0].slug;
        const res = await rawgService.searchGames('', 1, 12, '-rating', { genres: gen });
        becauseYouPlayed = cleanAndMap(res?.results);
      }
    }
  }
  if (becauseYouPlayed.length === 0) {
    // Fallback: popular rpg titles
    const res = await rawgService.searchGames('', 1, 12, '-added', { genres: 'role-playing-games-rpg' });
    becauseYouPlayed = cleanAndMap(res?.results);
  }

  // Same Studio
  let sameStudio = [];
  if (topDevelopers.length > 0) {
    const dev = topDevelopers[0];
    const res = await rawgService.searchGames('', 1, 12, '-rating', { developers: dev });
    sameStudio = cleanAndMap(res?.results);
  } else {
    // Fallback: Valve Corporation
    const res = await rawgService.searchGames('', 1, 12, '-rating', { developers: 'valve-corporation' });
    sameStudio = cleanAndMap(res?.results);
  }

  // Same Genre
  let sameGenre = [];
  if (topGenres.length > 0) {
    const gen = topGenres[0];
    const res = await rawgService.searchGames('', 1, 12, '-added', { genres: gen });
    sameGenre = cleanAndMap(res?.results);
  } else {
    // Fallback: RPG
    const res = await rawgService.searchGames('', 1, 12, '-added', { genres: 'role-playing-games-rpg' });
    sameGenre = cleanAndMap(res?.results);
  }

  // 4. Recommended For You: Combine all candidates and run profile matching scoring
  const candidatePool = new Map();
  const allCandidates = [
    ...trendingNow,
    ...recentlyReleased,
    ...communityFavorites,
    ...continueYourJourney,
    ...becauseYouPlayed,
    ...sameStudio,
    ...sameGenre
  ];

  allCandidates.forEach(game => {
    candidatePool.set(game.rawgId, game);
  });

  const recommendedForYou = Array.from(candidatePool.values())
    .map(game => {
      let score = 0;
      // Genre Match (+15 per match)
      game.genres?.forEach(g => {
        const normGenre = g.toLowerCase().replace(/\s+/g, '-');
        if (topGenres.includes(normGenre)) score += 15;
      });
      // Studio Match (+25 per match)
      game.developers?.forEach(d => {
        const normDev = d.toLowerCase().replace(/\s+/g, '-');
        if (topDevelopers.includes(normDev)) score += 25;
      });
      // Rating Match
      score += (game.rating || 0) * 2;
      // Popularity Match
      score += Math.min(5, (game.added || 0) * 0.0001);

      return { ...game, recommendationScore: score };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 12);

  const result = {
    recommendedForYou,
    becauseYouPlayed: becauseYouPlayed.slice(0, 12),
    continueYourJourney: continueYourJourney.slice(0, 12),
    trendingNow: trendingNow.slice(0, 12),
    recentlyReleased: recentlyReleased.slice(0, 12),
    hiddenGems: hiddenGems.slice(0, 12),
    upcomingReleases: upcomingReleases.slice(0, 12),
    communityFavorites: communityFavorites.slice(0, 12),
    sameStudio: sameStudio.slice(0, 12),
    sameGenre: sameGenre.slice(0, 12),
  };

  recommendationCache.set(cacheKey, result);
  return result;
};
