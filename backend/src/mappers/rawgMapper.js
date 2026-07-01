const extractPlatforms = (rawGame) => {
  return rawGame.parent_platforms?.map(p => p.platform.name) || 
         rawGame.platforms?.map(p => p.platform.name) || [];
};

export const mapSearchGame = (rawGame) => {
  return {
    rawgId: rawGame.id,
    slug: rawGame.slug,
    title: rawGame.name,
    coverImage: rawGame.background_image || null,
    platforms: extractPlatforms(rawGame),
    rating: rawGame.rating || 0,
    releaseDate: rawGame.released || null,
  };
};

export const mapGameDetails = (rawGame) => {
  // Prefer description_raw, otherwise strip HTML from description
  let description = rawGame.description_raw || '';
  if (!description && rawGame.description) {
    description = rawGame.description.replace(/<[^>]*>/g, '').trim();
  }

  return {
    rawgId: rawGame.id,
    slug: rawGame.slug,
    title: rawGame.name,
    coverImage: rawGame.background_image || null,
    description: description,
    platforms: extractPlatforms(rawGame),
    rating: rawGame.rating || 0,
    releaseDate: rawGame.released || null,
    developers: rawGame.developers?.map(d => d.name) || [],
    publishers: rawGame.publishers?.map(p => p.name) || [],
    genres: rawGame.genres?.map(g => g.name) || [],
    metacritic: rawGame.metacritic || null,
    website: rawGame.website || null,
    playtime: rawGame.playtime || 0,
    esrbRating: rawGame.esrb_rating?.name || null,
    stores: rawGame.stores?.map(s => s.store.name) || [],
  };
};
