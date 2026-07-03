import 'dotenv/config';
import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('Seeding user preferences for existing users...');
  
  const users = await prisma.user.findMany({
    include: {
      preference: true
    }
  });

  const usersWithoutPreference = users.filter(u => !u.preference);

  console.log(`Found ${usersWithoutPreference.length} user(s) without preferences.`);

  let seededCount = 0;
  for (const user of usersWithoutPreference) {
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        theme: 'DARK',
        defaultView: 'CARD'
      }
    });
    seededCount++;
  }

  console.log(`Successfully seeded ${seededCount} user preference record(s).`);
}

main()
  .catch((e) => {
    console.error('Error seeding user preferences:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
