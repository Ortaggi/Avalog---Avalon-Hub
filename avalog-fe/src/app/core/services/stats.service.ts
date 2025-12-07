import { Injectable, inject } from '@angular/core';
import {
  AVALON_ROLES,
  FactionStats,
  LeaderboardEntry,
  PlayerStats,
  Role,
  RoleStats
} from '../models';
import { MatchService } from './match.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private userService = inject(UserService);
  private matchService = inject(MatchService);

  //TODO: Da capire quanta logica di calcolo delle statistiche rimarra` qui.. probabilmente poca ✍️(◔◡◔)

  // Statistiche personali
  getPlayerStats(userId: string): PlayerStats {
    //Recupero i match del giocatore
    const matches = this.matchService.getByUserId(userId);

    let totalWins = 0;
    const factionStats: FactionStats = {
      good: { played: 0, wins: 0, winRate: 0 },
      evil: { played: 0, wins: 0, winRate: 0 }
    };

    // Mi serve per mettere in correlazione i ruoli e le vittorie
    const roleStatsMap = new Map<string, { played: number; wins: number }>();
    AVALON_ROLES.forEach((role: Role) => {
      roleStatsMap.set(role.id, { played: 0, wins: 0 });
    });

    // Comincio il calcolo delle statistiche
    matches.forEach((match) => {
      const role = this.matchService.getPlayerRole(match, userId);
      if (!role) {
        return;
      }

      const won = this.matchService.didPlayerWin(match, userId);

      // Statistiche fazione
      factionStats[role.faction].played++;
      if (won) {
        factionStats[role.faction].wins++;
        totalWins++;
      }

      //Statistiche del ruolo
      roleStatsMap.get(role.id)!.played++;
      if (won) {
        roleStatsMap.get(role.id)!.wins++;
      }
    });

    //Calcolo i win rate
    factionStats.good.winRate =
      factionStats.good.played > 0
        ? Math.round((factionStats.good.wins / factionStats.good.played) * 100)
        : 0;
    factionStats.evil.winRate =
      factionStats.evil.played > 0
        ? Math.round((factionStats.evil.wins / factionStats.evil.played) * 100)
        : 0;

    //Calcolo i winrate e aggiungo qualche dato
    const roleStats: RoleStats[] = [];
    // Most Played Role
    let mpr = '';
    // Most Played Count (quante volte ho giocato il mpr)
    let mpc = 0;
    // Best role
    let bestRole = '';
    let bestWinRate = 0;

    // TODO: Da capire perche riconosce l'ordine dei parametri che inserisco... (＃°Д°)
    roleStatsMap.forEach((stats, roleId) => {
      const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

      roleStats.push({
        roleId: roleId,
        played: stats.played,
        wins: stats.wins,
        winRate: winRate
      });

      //Aggiorno il mpc
      if (stats.played > mpc) {
        mpc = stats.played;
        mpr = roleId;
      }

      if (winRate > bestWinRate) {
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
      mostPlayedRole: mpr,
      bestRole
    };
  }

  // Statistiche generali
  getLeaderboard(): LeaderboardEntry[] {
    const users = this.userService.getAll();

    const entries: LeaderboardEntry[] = users
      .map((user) => {
        const stats = this.getPlayerStats(user.id);
        return {
          rank: 0,
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          totalMatches: stats.totalMatches,
          totalWins: stats.totalWins,
          winRate: stats.winRate
        };
      })
      .sort((a, b) => {
        // Sorto prima per win rate,
        // nel caso sia uguale do la priorita a quello con piu partite giocate
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.totalMatches - a.totalMatches;
      });

    // Assegno il rank una volta fatta la classifica
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }

  getRoleLeaderboard(roleId: string): LeaderboardEntry[] {
    const users = this.userService.getAll();

    const entries: LeaderboardEntry[] = users
      .map((user) => {
        const stats = this.getPlayerStats(user.id);
        const roleStat = stats.winsByRole.find((rs: RoleStats) => rs.roleId === roleId);

        return {
          rank: 0,
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          totalMatches: roleStat?.played || 0,
          totalWins: roleStat?.wins || 0,
          winRate: roleStat?.winRate || 0
        };
      })
      .sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        return b.totalMatches - a.totalMatches;
      });

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }
}
