import { normalize, stripSuffixes } from './queryNormalizer.js';

/**
 * Calculates a search relevance score for a game based on the search query.
 */
export const calculateScore = (query, game) => {
  if (!query || !game || !game.title) return 0;

  let score = 0;

  const rawTitle = game.title.trim();
  const rawQuery = query.trim();

  // Normalize query & title
  const normQuery = normalize(rawQuery);
  const cleanQuery = stripSuffixes(normQuery);

  const normTitle = normalize(rawTitle);
  const cleanTitle = stripSuffixes(normTitle);

  // 1. Exact Title Match: +100
  if (rawTitle.toLowerCase() === rawQuery.toLowerCase()) {
    score += 100;
  }
  // 2. Normalized Exact Match: +90
  else if (normTitle === normQuery || cleanTitle === cleanQuery) {
    score += 90;
  }
  // 3. Starts With Query: +75
  else if (normTitle.startsWith(normQuery) || cleanTitle.startsWith(cleanQuery)) {
    score += 75;
  }
  // 4. Contains Full Query: +60
  else if (normTitle.includes(normQuery) || cleanTitle.includes(cleanQuery)) {
    score += 60;
  }

  // 5. Contains Every Token: +50
  const queryTokens = normQuery.split(' ').filter(Boolean);

  if (queryTokens.length > 0) {
    const hasEveryToken = queryTokens.every(token => normTitle.includes(token));
    if (hasEveryToken) {
      score += 50;
    }

    // 6. Per Matching Token: +15
    let matchingTokensCount = 0;
    queryTokens.forEach(token => {
      if (normTitle.includes(token)) {
        matchingTokensCount++;
      }
    });
    score += matchingTokensCount * 15;
  }

  // 7. Developer Match: +10
  if (game.developers && Array.isArray(game.developers)) {
    const hasDevMatch = game.developers.some(dev => {
      const normDev = normalize(dev);
      return normDev.includes(normQuery) || (queryTokens.length > 0 && queryTokens.some(token => normDev.includes(token)));
    });
    if (hasDevMatch) score += 10;
  }

  // 8. Publisher Match: +10
  if (game.publishers && Array.isArray(game.publishers)) {
    const hasPubMatch = game.publishers.some(pub => {
      const normPub = normalize(pub);
      return normPub.includes(normQuery) || (queryTokens.length > 0 && queryTokens.some(token => normPub.includes(token)));
    });
    if (hasPubMatch) score += 10;
  }

  // 9. Genre Match: +5
  if (game.genres && Array.isArray(game.genres)) {
    const hasGenreMatch = game.genres.some(genre => {
      const normGenre = normalize(genre);
      return normGenre.includes(normQuery) || (queryTokens.length > 0 && queryTokens.some(token => normGenre.includes(token)));
    });
    if (hasGenreMatch) score += 5;
  }

  // 10. Rating Bonus: rating * 2
  if (typeof game.rating === 'number') {
    score += game.rating * 2;
  }

  // 11. Popularity Bonus: small weighted score (added count capped at 20000 -> +10)
  if (typeof game.added === 'number') {
    score += Math.min(10, game.added * 0.0005);
  }

  // 12. Recent Release Bonus: small weighted score
  if (game.releaseDate) {
    const releaseYear = new Date(game.releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (releaseYear && !isNaN(releaseYear)) {
      const diff = currentYear - releaseYear;
      if (diff >= 0) {
        score += Math.max(0, 5 - diff * 0.25); // +5 for current year, decreases by 0.25 per year back
      }
    }
  }

  return score;
};

/**
 * Scores, filters by threshold, and ranks raw search results.
 */
export const rankResults = (query, results) => {
  if (!results || !Array.isArray(results)) return [];

  return results
    .map(game => {
      const score = calculateScore(query, game);
      return { ...game, searchScore: score };
    })
    .filter(game => game.searchScore >= 25)
    .sort((a, b) => b.searchScore - a.searchScore);
};
