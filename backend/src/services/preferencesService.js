import prisma from '../lib/prisma.js';

/**
 * Find or create preferences for a given user.
 * Returns only client-safe fields: theme and defaultView.
 */
export const findOrCreatePreferences = async (userId) => {
  let preference = await prisma.userPreference.findUnique({
    where: { userId }
  });

  if (!preference) {
    preference = await prisma.userPreference.create({
      data: {
        userId,
        theme: 'DARK',
        defaultView: 'CARD'
      }
    });
  }

  return {
    theme: preference.theme,
    defaultView: preference.defaultView
  };
};

/**
 * Upsert or update preferences for a given user.
 * Returns only client-safe fields: theme and defaultView.
 */
export const updatePreferences = async (userId, updates) => {
  const preference = await prisma.userPreference.upsert({
    where: { userId },
    update: updates,
    create: {
      userId,
      theme: updates.theme || 'DARK',
      defaultView: updates.defaultView || 'CARD'
    }
  });

  return {
    theme: preference.theme,
    defaultView: preference.defaultView
  };
};
