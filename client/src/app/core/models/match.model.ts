import { Faction } from './role.model';

export type VictoryType = 'missions' | 'assassination';

// Serve per associare il ruolo di un giocatore per ogni partita
export interface PlayerMatch {
  idPlayer: string;
  idRole: string;
}

export interface Match {
  id: string;
  groupId: string;
  date: Date;
  players: PlayerMatch[];
  winningFaction: Faction;
  victoryType: VictoryType;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}
