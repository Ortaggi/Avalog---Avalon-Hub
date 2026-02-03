import { GameDetailResponseType, GameFiltersType, GameRequestType, GameUpdateRequestType } from '../dtos/game.js';
import { prisma } from '../lib/prisma.js';

export async function getGames(filters: GameFiltersType) {
  const queryFilters: any = {};
  if (filters?.startDate || filters?.endDate) {
    queryFilters.playedAt = {
      ...(filters.startDate && { gte: new Date(filters.startDate) }),
      ...(filters.endDate && { lte: new Date(filters.endDate) }),
    };
  }

  if (filters?.result) queryFilters.result = filters.result;
  if (filters?.winType) queryFilters.winType = filters.winType;
  const games = await prisma.game.findMany({
    select: {
      id: true,
      groupId: true,
      result: true,
      winType: true,
      notes: true,
      playedAt: true,
    },
    where: queryFilters,
  });

  return games.map((game) => ({
    ...game,
    playedAt: game.playedAt.toISOString(),
  }));
}

export async function createGame(data: GameRequestType) {
  return prisma.game.create({
    data: {
      groupId: data.groupId,
      result: data.result,
      winType: data.winType,
      notes: data.notes,
      participants: {
        create: data.participants.map((p) => ({
          userId: p.userId,
          role: p.role,
          faction: p.faction,
        })),
      },
    },
    include: {
      participants: true,
    },
  });
}

export async function getGameById(gameId: string): Promise<GameDetailResponseType> {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      },
    },
  });

  return {
    ...game,
    playedAt: game.playedAt.toISOString(),
    participants: game.participants.map((p) => ({
      ...p,
      nickname: p.user.nickname,
    })),
  };
}

export async function updateGame(
  gameId: string,
  data: GameUpdateRequestType,
) {
  const { participants, ...gameData } = data;

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: gameData,
  });

  if (participants) {
    await prisma.gameParticipant.deleteMany({ where: { gameId } });

    await prisma.gameParticipant.createMany({
      data: participants.map((p) => ({
        gameId,
        userId: p.userId,
        role: p.role,
        faction: p.faction,
      })),
    });
  }

  return updatedGame;
}

export async function deleteGame(gameId: string) {
  await prisma.gameParticipant.deleteMany({ where: { gameId } });
  return prisma.game.delete({ where: { id: gameId } });
}
