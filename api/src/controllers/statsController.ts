import { prisma } from '../lib/prisma.js';
import { RoleType } from '../dtos/stats.js';
import { LeaderboardItem, LeaderboardQuery } from '../types/stats.js';

export async function getUserStats(userId: string) {
  const participations = await prisma.gameParticipant.findMany({
    where: { userId },
    include: {
      game: {
        select: {
          result: true,
        },
      },
    },
  });

  let wins = 0;
  let goodWins = 0;
  let evilWins = 0;

  const roleStats = new Map<string, { played: number; wins: number }>();

  for (const p of participations) {
    const isGood = p.faction === 'GOOD';
    const isEvil = p.faction === 'EVIL';
    const gameResult = p.game.result;

    let won = false;
    if (isGood && gameResult === 'GOOD_WIN') won = true;
    if (isEvil && gameResult === 'EVIL_WIN') won = true;

    if (won) {
      wins++;
      if (isGood) goodWins++;
      if (isEvil) evilWins++;
    }

    if (p.role) {
      const current = roleStats.get(p.role) || { played: 0, wins: 0 };
      current.played++;
      if (won) current.wins++;
      roleStats.set(p.role, current);
    }
  }

  let mostPlayedRole: RoleType | null = null;
  let maxPlayed = 0;

  for (const [role, stats] of roleStats.entries()) {
    if (stats.played > maxPlayed) {
      maxPlayed = stats.played;
      mostPlayedRole = role as RoleType;
    }
  }

  let bestRole: RoleType | null = null;
  let maxWinRate = -1;
  let maxWinRatePlayed = 0;

  for (const [role, stats] of roleStats.entries()) {
    const winRate = stats.wins / stats.played;
    if (winRate > maxWinRate) {
      maxWinRate = winRate;
      bestRole = role as RoleType;
      maxWinRatePlayed = stats.played;
    } else if (winRate === maxWinRate) {
      // Tie-breaker: prefer role with more games played
      if (stats.played > maxWinRatePlayed) {
        bestRole = role as RoleType;
        maxWinRatePlayed = stats.played;
      }
    }
  }

  return {
    totalGames: participations.length,
    wins,
    goodWins,
    evilWins,
    mostPlayedRole,
    bestRole,
  };
}

export async function getLeaderboard(
  query: LeaderboardQuery,
): Promise<LeaderboardItem[]> {
  const { minGames = 0 } = query;

  const stats = await prisma.userStatistics.findMany({
    where: { totalGames: { gte: minGames } },
    include: { user: true },
  });

  const leaderboard: LeaderboardItem[] = stats.map((s) => ({
    userId: s.userId,
    nickname: s.user.nickname,
    winRate: s.totalGames > 0 ? s.wins / s.totalGames : 0,
    totalGames: s.totalGames,
  }));

  leaderboard.sort((a, b) => b.winRate - a.winRate);

  return leaderboard;
}
