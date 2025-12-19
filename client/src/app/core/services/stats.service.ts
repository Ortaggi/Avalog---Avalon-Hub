import { Injectable, inject } from '@angular/core';
import { PlayerStats, FactionStats, RoleStats, LeaderboardEntry, AVALON_ROLES } from '../models';
import { MatchService } from './match.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private matchService = inject(MatchService);
  private userService = inject(UserService);

  async getPlayerStats(userId: string): Promise<PlayerStats> {
    const matches = await this.matchService.getByUserId(userId);

    let totalWins = 0;
    const factionStats: FactionStats = {
      good: { played: 0, wins: 0, winRate: 0 },
      evil: { played: 0, wins: 0, winRate: 0 }
    };
    const roleStatsMap = new Map<string, { played: number; wins: number }>();

    // Inizializzo tutti i ruoli
    AVALON_ROLES.forEach((role) => {
      roleStatsMap.set(role.id, { played: 0, wins: 0 });
    });

    // Calcolo le statistiche
    matches.forEach((match) => {
      const role = this.matchService.getPlayerRole(match, userId);
      if (!role) return;

      const won = this.matchService.didPlayerWin(match, userId);

      // Aggiorno le statistiche fazione
      factionStats[role.faction].played++;
      if (won) {
        factionStats[role.faction].wins++;
        totalWins++;
      }

      // Aggiorno le statistiche ruolo
      const roleStat = roleStatsMap.get(role.id)!;
      roleStat.played++;
      if (won) roleStat.wins++;
    });

    // Calcolo i win rate fazioni
    factionStats.good.winRate =
      factionStats.good.played > 0
        ? Math.round((factionStats.good.wins / factionStats.good.played) * 100)
        : 0;
    factionStats.evil.winRate =
      factionStats.evil.played > 0
        ? Math.round((factionStats.evil.wins / factionStats.evil.played) * 100)
        : 0;

    // Converto i role stats e calcolo win rate
    const roleStats: RoleStats[] = [];
    let mostPlayedRole = '';
    let mostPlayedCount = 0;
    let bestRole = '';
    let bestWinRate = 0;

    roleStatsMap.forEach((stats, roleId) => {
      const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

      roleStats.push({
        roleId,
        played: stats.played,
        wins: stats.wins,
        winRate
      });

      if (stats.played > mostPlayedCount) {
        mostPlayedCount = stats.played;
        mostPlayedRole = roleId;
      }

      // Best role: almeno 2 partite giocate
      if (stats.played >= 2 && winRate > bestWinRate) {
        bestWinRate = winRate;
        bestRole = roleId;
      }
    });

    return {
      userId,
      totalMatches: matches.length,
      totalWins,
      winRate: matches.length > 0 ? Math.round((totalWins / matches.length) * 100) : 0,
      winsByFaction: factionStats,
      winsByRole: roleStats.filter((r) => r.played > 0),
      mostPlayedRole,
      bestRole
    };
  }

  async getLeaderboard(minMatches = 1): Promise<LeaderboardEntry[]> {
    const users = await this.userService.getAll();

    const entries: LeaderboardEntry[] = [];

    for (const user of users) {
      const stats = await this.getPlayerStats(user.id);
      if (stats.totalMatches >= minMatches) {
        entries.push({
          rank: 0,
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          totalMatches: stats.totalMatches,
          totalWins: stats.totalWins,
          winRate: stats.winRate
        });
      }
    }

    // Ordino per win rate, poi per numero partite
    entries.sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.totalMatches - a.totalMatches;
    });

    // Assegno il rank
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }

  async getRoleLeaderboard(roleId: string, minMatches = 1): Promise<LeaderboardEntry[]> {
    const users = await this.userService.getAll();

    const entries: LeaderboardEntry[] = [];

    for (const user of users) {
      const stats = await this.getPlayerStats(user.id);
      const roleStat = stats.winsByRole.find((r) => r.roleId === roleId);

      if (roleStat && roleStat.played >= minMatches) {
        entries.push({
          rank: 0,
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          totalMatches: roleStat.played,
          totalWins: roleStat.wins,
          winRate: roleStat.winRate
        });
      }
    }

    entries.sort((a, b) => {
      if (b.winRate !== a.winRate) return b.winRate - a.winRate;
      return b.totalMatches - a.totalMatches;
    });

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }
}
