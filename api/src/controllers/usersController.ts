import { prisma } from '../lib/prisma.js';

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nickname: true,
      avatarUrl: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      avatarUrl: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: { nickname?: string; avatarUrl?: string },
) {
  await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });
}
