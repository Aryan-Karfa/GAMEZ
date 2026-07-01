import prisma from '../lib/prisma.js';
import * as libraryMapper from '../mappers/libraryMapper.js';

export const getDashboardSummary = async (userId) => {
  const [
    totalGames,
    playing,
    toPlay,
    completed,
    discontinued,
    recentlyUpdatedRaw,
    recentAdditionsRaw
  ] = await Promise.all([
    prisma.libraryEntry.count({ where: { userId } }),
    prisma.libraryEntry.count({ where: { userId, status: 'PLAYING' } }),
    prisma.libraryEntry.count({ where: { userId, status: 'TO_PLAY' } }),
    prisma.libraryEntry.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.libraryEntry.count({ where: { userId, status: 'DISCONTINUED' } }),
    prisma.libraryEntry.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { game: true }
    }),
    prisma.libraryEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { game: true }
    })
  ]);

  const completionRate = totalGames > 0 ? Number(((completed / totalGames) * 100).toFixed(1)) : 0;

  return {
    stats: {
      totalGames,
      playing,
      toPlay,
      completed,
      discontinued,
      completionRate
    },
    recentlyUpdated: recentlyUpdatedRaw.map(libraryMapper.mapLibraryEntry),
    recentAdditions: recentAdditionsRaw.map(libraryMapper.mapLibraryEntry)
  };
};

export const getContinuePlaying = async (userId) => {
  const continuePlayingRaw = await prisma.libraryEntry.findMany({
    where: { userId, status: 'PLAYING' },
    orderBy: { lastProgressUpdate: 'desc' },
    include: { game: true }
  });

  return continuePlayingRaw.map(libraryMapper.mapLibraryEntry);
};
