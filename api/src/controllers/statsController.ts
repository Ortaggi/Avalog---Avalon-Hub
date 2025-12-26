import { prisma } from '../lib/prisma.js';
import { LeaderboardItem, LeaderboardQuery } from '../types/stats.js';

export async function getUserStats(userId: string) {
  const stats = await prisma.userStatistics.findUniqueOrThrow({
    where: { userId },
  });
  return stats;
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
