import { Faction, Role } from '../generated/prisma/enums.js';

export type LeaderboardQuery = {
  minGames?: number;
  faction?: Faction;
  role?: Role;
};

export type LeaderboardItem = {
  userId: string;
  nickname: string | null;
  winRate: number;
  totalGames: number;
};
