import { prisma } from '../lib/prisma.js';
import { CreateGameInput } from '../types/games.js';

export async function getGames() {
  const games = await prisma.game.findMany({
    select: {
      id: true,
      groupId: true,
      result: true,
      winType: true,
      notes: true,
      playedAt: true,
    },
  });

  return games.map((game) => ({
    ...game,
    playedAt: game.playedAt.toISOString(),
  }));
}

export async function createGame(data: CreateGameInput) {
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

export async function getGameById(gameId: string) {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: {
      participants: true,
    },
  });
  return { ...game, playedAt: game.playedAt.toISOString() };
}

export async function updateGame(
  gameId: string,
  data: Partial<CreateGameInput>,
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
