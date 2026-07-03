export const mapLibraryEntry = (entry) => {
  if (!entry) return null;
  return {
    id: entry.id,
    status: entry.status,
    progress: entry.progress,
    playTimeMinutes: entry.playTimeMinutes,
    lastProgressUpdate: entry.lastProgressUpdate,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    game: entry.game ? {
      rawgId: entry.game.rawgId,
      slug: entry.game.slug,
      title: entry.game.title,
      coverImage: entry.game.coverImage,
      platforms: entry.game.platforms,
      rating: entry.game.rating,
      releaseDate: entry.game.releaseDate instanceof Date ? entry.game.releaseDate.toISOString().split('T')[0] : (entry.game.releaseDate || null)
    } : null
  };
};
