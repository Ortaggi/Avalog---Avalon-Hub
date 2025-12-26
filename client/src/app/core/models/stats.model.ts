/*
 * PlayerStats: Sono le statistiche generali di un giocatore
 * FactionStats: Sono collegate al singolo giocatore e indicano le statistiche per singola fazione
 * RoleStats: Sono collegate al singolo giocatore, per ogni ruolo giocato dal giocatore viene tenuta traccia delle partite vinte, winrate e giocate
 * LeaderboardEntry: Serve per inserire un record dentro la leaderboard in modo da avere dei dati piu` allineati
 * RoleLeaderboardEntry: Stesso concetto della LeaderboardEntry ma estende l'interfaccia con le info del singolo ruolo
 */

// Statistiche generali di un giocatore
export interface PlayerStats {
  userId: string;
  totalMatches: number;
  totalWins: number;
  winRate: number;
  winsByFaction: FactionStats;
  winsByRole: RoleStats[];
  mostPlayedRole: string;
  bestRole: string;
}

// Statistiche per fazione
export interface FactionStats {
  good: {
    played: number;
    wins: number;
    winRate: number;
  };
  evil: {
    played: number;
    wins: number;
    winRate: number;
  };
}

// Statistiche per singolo ruolo
export interface RoleStats {
  roleId: string;
  played: number;
  wins: number;
  winRate: number;
}

// Entry per la leaderboard //TODO: Forse non utile, da capire in futuro
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  totalMatches: number;
  totalWins: number;
  winRate: number;
}

// Leaderboard per ruolo specifico //TODO: Forse non utile, da capire
export interface RoleLeaderboardEntry extends LeaderboardEntry {
  roleId: string;
  rolePlayed: number;
  roleWins: number;
  roleWinRate: number;
}
