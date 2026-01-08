export type VictoryType = 'THREE_MISSIONS' | 'ASSASSINATION';
export type GameResultType = 'GOOD_WIN' | 'EVIL_WIN';
export type GameRolesType =
  | 'MERLIN'
  | 'PERCIVAL'
  | 'GOOD_SIMPLE'
  | 'ASSASSIN'
  | 'MORGANA'
  | 'MORDRED'
  | 'OBERON'
  | 'EVIL_SIMPLE';
export type GameFactionType = 'GOOD' | 'EVIL';

export const VictoryTypeList = [
  { value: 'THREE_MISSIONS', label: 'Classica' },
  { value: 'ASSASSINATION', label: 'Assassinando Merlino' },
];

export const GameResultList = [
  { value: 'GOOD_WIN', label: 'Servitori di Artù' },
  { value: 'EVIL_WIN', label: 'Servitori di Mordred' },
];

export const GameRolesList = [
  { value: 'MERLIN', label: 'Merlino' },
  { value: 'PERCIVAL', label: 'Percival' },
  { value: 'GOOD_SIMPLE', label: 'Servitore di Artù' },
  { value: 'ASSASSIN', label: 'Assassino' },
  { value: 'MORGANA', label: 'Morgana' },
  { value: 'MORDRED', label: 'Mordred' },
  { value: 'OBERON', label: 'Oberon' },
  { value: 'EVIL_SIMPLE', label: 'Servitore di Mordred' },
];

export const GameFactionList = [
  { value: 'GOOD', label: 'Servitori di Artù' },
  { value: 'EVIL', label: 'Servitori di Mordred' },
];

// Serve per associare il ruolo di un giocatore per ogni partita
export interface PlayerGame {
  idPlayer: string;
  idRole: string;
}

export interface Game {
  id: string;
  groupId: string;
  result: GameResultType;
  winType: VictoryType;
  notes?: string;
  playedAt: Date;
}

export interface GameDetail extends Game {
  participants: {
    userId: string;
    role: GameRolesType;
    faction: GameFactionType;
    nickname: string;
  }[];
}
