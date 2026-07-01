import 'dotenv/config';
import prisma from '../src/lib/prisma.js';

async function verify() {
  console.log('--- STARTING SCHEMA VERIFICATION ---');

  // 1. Verify UserPreference Seeding
  const users = await prisma.user.findMany({
    include: { preference: true }
  });
  console.log(`[VERIFY] Total users in DB: ${users.length}`);
  for (const user of users) {
    if (!user.preference) {
      throw new Error(`User ${user.username} lacks a UserPreference record!`);
    }
    console.log(`[VERIFY] User "${user.username}" has preference theme: ${user.preference.theme}, view: ${user.preference.defaultView}`);
  }

  // Pick or create a test user
  let testUser = users[0];
  if (!testUser) {
    console.log('[VERIFY] No user found, creating a test user...');
    testUser = await prisma.user.create({
      data: {
        username: 'verify_test_user',
        email: 'verify@example.com',
        passwordHash: 'dummy_hash',
        preference: {
          create: {
            theme: 'DARK',
            defaultView: 'CARD'
          }
        }
      },
      include: { preference: true }
    });
    console.log(`[VERIFY] Created test user: ${testUser.username}`);
  }

  // 2. Verify Game Creation
  console.log('[VERIFY] Creating test game...');
  const testGame = await prisma.game.create({
    data: {
      rawgId: 9999999,
      slug: 'test-verification-game',
      title: 'Verification Game',
      platforms: ['PC', 'PS5'],
      rating: 4.8,
      releaseDate: new Date('2026-06-30')
    }
  });
  console.log(`[VERIFY] Created test game: "${testGame.title}" with ID: ${testGame.id}`);

  // 3. Verify LibraryEntry Creation
  console.log('[VERIFY] Creating library entry...');
  const entry = await prisma.libraryEntry.create({
    data: {
      userId: testUser.id,
      gameId: testGame.id,
      status: 'PLAYING',
      progress: 50,
      playTimeMinutes: 120
    }
  });
  console.log(`[VERIFY] Created library entry: ID: ${entry.id}, status: ${entry.status}, playTime: ${entry.playTimeMinutes}`);

  // 4. Verify Composite Unique Constraint (userId + gameId)
  console.log('[VERIFY] Testing composite unique constraint...');
  try {
    await prisma.libraryEntry.create({
      data: {
        userId: testUser.id,
        gameId: testGame.id,
        status: 'TO_PLAY'
      }
    });
    throw new Error('Composite unique constraint failed! Duplicate entry was created.');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('[VERIFY] Success: Duplicate entry correctly blocked by unique constraint (Prisma Error P2002).');
    } else {
      throw error;
    }
  }

  // 5. Verify Cascade Delete on Game
  console.log('[VERIFY] Testing cascade delete on Game deletion...');
  await prisma.game.delete({
    where: { id: testGame.id }
  });
  const checkEntryAfterGameDelete = await prisma.libraryEntry.findUnique({
    where: { id: entry.id }
  });
  if (checkEntryAfterGameDelete) {
    throw new Error('Cascade delete failed! LibraryEntry still exists after Game was deleted.');
  }
  console.log('[VERIFY] Success: LibraryEntry was cascade deleted when Game was deleted.');

  // 6. Verify Cascade Delete on User
  // Let's create a temporary user for this to avoid deleting the main user
  console.log('[VERIFY] Testing cascade delete on User deletion...');
  const tempUser = await prisma.user.create({
    data: {
      username: 'temp_cascade_user',
      email: 'temp_cascade@example.com',
      passwordHash: 'dummy_hash',
      preference: {
        create: {
          theme: 'DARK',
          defaultView: 'CARD'
        }
      }
    },
    include: { preference: true }
  });
  const tempGame = await prisma.game.create({
    data: {
      rawgId: 8888888,
      slug: 'temp-game',
      title: 'Temp Game',
      platforms: ['Switch']
    }
  });
  const tempEntry = await prisma.libraryEntry.create({
    data: {
      userId: tempUser.id,
      gameId: tempGame.id,
      status: 'TO_PLAY'
    }
  });

  // Delete temp user
  await prisma.user.delete({
    where: { id: tempUser.id }
  });

  // Check if preference and entry are deleted
  const checkPref = await prisma.userPreference.findUnique({
    where: { userId: tempUser.id }
  });
  const checkEnt = await prisma.libraryEntry.findUnique({
    where: { id: tempEntry.id }
  });

  if (checkPref || checkEnt) {
    throw new Error(`Cascade delete failed! Remaining records: preference=${!!checkPref}, entry=${!!checkEnt}`);
  }
  console.log('[VERIFY] Success: UserPreference and LibraryEntry were cascade deleted when User was deleted.');

  // Clean up temp game
  await prisma.game.delete({
    where: { id: tempGame.id }
  });

  // If we created a test user (meaning the db was empty), let's clean it up
  if (testUser.username === 'verify_test_user') {
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('[VERIFY] Cleaned up verification test user.');
  }

  console.log('--- ALL SCHEMA VERIFICATIONS PASSED SUCCESSFULLY ---');
}

verify()
  .catch((e) => {
    console.error('[VERIFY] Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
