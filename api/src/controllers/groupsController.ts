import { prisma } from '../lib/prisma.js';
import { AddMemberInput, CreateGroupInput } from '../types/groups.js';

export async function getGroups() {
  return prisma.group.findMany({
    select: { id: true, name: true },
  });
}

export async function createGroup(data: CreateGroupInput) {
  return prisma.group.create({
    data: {
      name: data.name,
      memberships: {
        create: {
          userId: data.adminId,
          role: 'ADMIN',
        },
      },
    },
  });
}

export async function getGroupById(id: string) {
  return prisma.group.findUniqueOrThrow({
    where: { id },
    select: { id: true, name: true },
  });
}

export async function updateGroup(groupId: string, name: string) {
  return prisma.group.update({
    where: { id: groupId },
    data: { name },
  });
}

export async function deleteGroup(groupId: string) {
  await prisma.membership.deleteMany({ where: { groupId } });

  return prisma.group.delete({
    where: { id: groupId },
  });
}

export async function addMember(groupId: string, data: AddMemberInput) {
  return prisma.membership.create({
    data: {
      groupId,
      userId: data.userId,
      role: data.role ?? 'MEMBER',
    },
  });
}

export async function removeMember(groupId: string, userId: string) {
  return prisma.membership.deleteMany({
    where: { groupId, userId },
  });
}

export async function listMembers(groupId: string) {
  return prisma.membership
    .findMany({
      where: { groupId },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
          },
        },
        role: true,
      },
    })
    .then((memberships) =>
      memberships.map((m) => ({
        id: m.user.id,
        email: m.user.email,
        nickname: m.user.nickname,
        role: m.role,
      })),
    );
}
