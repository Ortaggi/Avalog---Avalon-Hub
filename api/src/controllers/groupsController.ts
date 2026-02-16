import { GroupRequestType } from '../dtos/group.js';
import { prisma } from '../lib/prisma.js';
import { AddMemberInput } from '../types/groups.js';

export async function getGroups() {
  return prisma.group.findMany({
    select: { id: true, name: true },
  });
}

export async function getGroupsByUserId(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return memberships.map((m) => m.group);
}

export async function createGroup(data: GroupRequestType) {
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
  const group = await prisma.group.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      memberships: {
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
      },
    },
  });

  const members = group.memberships.map((m) => ({
    id: m.user.id,
    email: m.user.email,
    nickname: m.user.nickname,
    role: m.role,
  }));

  const admin = members.find((m) => m.role === 'ADMIN');

  if (!admin) {
    throw new Error('Group has no admin');
  }

  return {
    id: group.id,
    name: group.name,
    adminId: admin.id,
    members,
  };
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
