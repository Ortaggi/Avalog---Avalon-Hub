import { Faction } from './roles';

export type VictoryType = 'missions' | 'assassination';

// Serve per associare il ruolo di un giocatore per ogni partita
export interface PlayerGame {
  idPlayer: string;
  idRole: string;
}

export interface Game {
  id: string;
  groupId: string;
  date: Date;
  players: PlayerGame[];
  winningFaction: Faction;
  victoryType: VictoryType;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}
