import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log('Resetting database...');

  // Delete in order to respect foreign key constraints
  console.log('Deleting game participants...');
  await prisma.gameParticipant.deleteMany();

  console.log('Deleting games...');
  await prisma.game.deleteMany();

  console.log('Deleting user achievements...');
  await prisma.userAchievement.deleteMany();

  console.log('Deleting achievements...');
  await prisma.achievement.deleteMany();

  console.log('Deleting user statistics...');
  await prisma.userStatistics.deleteMany();

  console.log('Deleting memberships...');
  await prisma.membership.deleteMany();

  console.log('Deleting groups...');
  await prisma.group.deleteMany();

  console.log('Deleting users...');
  await prisma.user.deleteMany();

  console.log('Database reset completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
