import prisma from '../lib/prisma.js';
import * as gameService from './gameService.js';
import * as libraryMapper from '../mappers/libraryMapper.js';
import AppError from '../utils/AppError.js';

export const getLibrary = async (userId) => {
  const entries = await prisma.libraryEntry.findMany({
    where: { userId },
    include: { game: true },
    orderBy: { updatedAt: 'desc' }
  });
  return entries.map(libraryMapper.mapLibraryEntry);
};

export const getEntryDetails = async (id, userId) => {
  const entry = await prisma.libraryEntry.findFirst({
    where: { id, userId },
    include: { game: true }
  });

  if (!entry) {
    throw new AppError('Library entry not found.', 404);
  }

  return libraryMapper.mapLibraryEntry(entry);
};

export const addGame = async (userId, rawgId, status) => {
  // 1. Check if the user already has this game in library
  const existingEntry = await prisma.libraryEntry.findFirst({
    where: {
      userId,
      game: { rawgId }
    }
  });

  if (existingEntry) {
    throw new AppError('Game already exists in your library.', 409);
  }

  // 2. Resolve or fetch game details
  let gameRecord = await prisma.game.findUnique({
    where: { rawgId }
  });

  let gameDetails = null;
  if (!gameRecord) {
    // Fetch details from RAWG via gameService
    gameDetails = await gameService.getGameDetails(rawgId);
  }

  // 3. Create LibraryEntry atomically using connectOrCreate for Game
  try {
    const entry = await prisma.libraryEntry.create({
      data: {
        user: { connect: { id: userId } },
        game: {
          connectOrCreate: {
            where: { rawgId },
            create: {
              rawgId,
              slug: gameRecord ? gameRecord.slug : gameDetails.slug,
              title: gameRecord ? gameRecord.title : gameDetails.title,
              coverImage: gameRecord ? gameRecord.coverImage : gameDetails.coverImage,
              description: gameRecord ? gameRecord.description : gameDetails.description,
              platforms: gameRecord ? gameRecord.platforms : gameDetails.platforms,
              rating: gameRecord ? gameRecord.rating : gameDetails.rating,
              releaseDate: gameRecord 
                ? gameRecord.releaseDate 
                : (gameDetails.releaseDate ? new Date(gameDetails.releaseDate) : null)
            }
          }
        },
        status
      },
      include: { game: true }
    });

    return libraryMapper.mapLibraryEntry(entry);
  } catch (error) {
    // Handle database constraint exceptions
    if (error.code === 'P2002') {
      throw new AppError('Game already exists in your library.', 409);
    }
    throw error;
  }
};

export const updateEntry = async (id, userId, updates) => {
  const existing = await prisma.libraryEntry.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    throw new AppError('Library entry not found.', 404);
  }

  const updateData = {};
  let progressChanged = false;

  if (updates.status !== undefined) {
    updateData.status = updates.status;
  }

  if (updates.progress !== undefined && updates.progress !== existing.progress) {
    updateData.progress = updates.progress;
    progressChanged = true;
  }

  if (updates.playTimeMinutes !== undefined && updates.playTimeMinutes !== existing.playTimeMinutes) {
    updateData.playTimeMinutes = updates.playTimeMinutes;
    progressChanged = true;
  }

  if (progressChanged) {
    updateData.lastProgressUpdate = new Date();
  }

  const updatedEntry = await prisma.libraryEntry.update({
    where: { id },
    data: updateData,
    include: { game: true }
  });

  return libraryMapper.mapLibraryEntry(updatedEntry);
};

export const deleteEntry = async (id, userId) => {
  const existing = await prisma.libraryEntry.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    throw new AppError('Library entry not found.', 404);
  }

  await prisma.libraryEntry.delete({
    where: { id }
  });

  return { message: 'Game removed from library successfully.' };
};
