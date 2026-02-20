import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

const users = [
  { nickname: 'fantonucci', password: '72yC23TPvUzl', email: 'fabio.antonucci@laserromae.it' },
  { nickname: 'dciangola', password: 'qyHNUR920Nhi', email: 'dario.ciangola@alfameg.it' },
  { nickname: 'dgettatelli', password: 'fj6OknHkC8C6', email: 'diego.gettatelli@alfameg.it' },
  { nickname: 'gmanco', password: 'cn5hRd93b2k1', email: 'gianluca.manco@alfameg.it' },
  { nickname: 'gagnelli', password: 'se7g39YCWHPm', email: 'giulia.agnelli@alfameg.it' },
  { nickname: 'faloise', password: '23i0OA2Vse9k', email: 'fabio.aloise@alfameg.it' },
  { nickname: 'mmasci', password: '0EaQ70FsirJl', email: 'michela.masci@alfameg.it' },
  { nickname: 'fcafiero', password: 'Ms8YB805tvcE', email: 'federico.cafiero@laserromae.it' },
  { nickname: 'acolarossi', password: 'AYJ5x834Yusu', email: 'andrea.colarossi@laserromae.it' },
  { nickname: 'tcarlini', password: '3V41aDlziuwb', email: 'tommaso.carlini@alfameg.it' },
  { nickname: 'amartino', password: 'Qr45oylB8wBk', email: 'angelo.martino@alfameg.it' },
  { nickname: 'mdelzotto', password: '81a8Lku2exXK', email: 'micaela.delzotto@laserromae.it' },
  { nickname: 'ltolotti', password: 'sp29rNLS4P28', email: 'leonardo.tolotti@laserromae.it' },
];

async function main() {
  console.log('Seeding database...');

  // Create users
  const createdUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        nickname: user.nickname,
        statistics: {
          create: {},
        },
      },
    });
    createdUsers.push(created);
    console.log(`Created user: ${user.nickname} (${user.email})`);
  }

  // Create group "Avalon Team"
  const group = await prisma.group.create({
    data: {
      name: 'Avalon Team',
    },
  });
  console.log(`Created group: ${group.name}`);

  // Add all users to the group (dgettatelli as ADMIN)
  for (const user of createdUsers) {
    const role = user.nickname === 'dgettatelli' ? 'ADMIN' : 'MEMBER';
    await prisma.membership.create({
      data: {
        userId: user.id,
        groupId: group.id,
        role,
      },
    });
    console.log(`Added ${user.nickname} to group ${group.name} as ${role}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
