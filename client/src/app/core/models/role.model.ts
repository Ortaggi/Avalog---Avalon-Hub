export type Faction = 'good' | 'evil';

export interface Role {
  id: string;
  name: string;
  faction: Faction;
  description: string;
  icon?: string;
}

// TODO: Da spostare nel DB in futuro :/ , preparo intanto questo mock.
export const AVALON_ROLES: Role[] = [
  {
    id: 'merlin',
    name: 'Merlino',
    faction: 'good',
    description: 'Conosce i cattivi (tranne Mordred)'
  },
  {
    id: 'percival',
    name: 'Percival',
    faction: 'good',
    description: 'Conosce Merlino (ma vede anche Morgana)'
  },
  { id: 'loyal', name: 'Fedele di Artù', faction: 'good', description: 'Nessun potere speciale' },

  {
    id: 'assassin',
    name: 'Assassino',
    faction: 'evil',
    description: 'Può tentare di assassinare Merlino'
  },
  {
    id: 'morgana',
    name: 'Morgana',
    faction: 'evil',
    description: 'Appare come Merlino a Percival'
  },
  { id: 'mordred', name: 'Mordred', faction: 'evil', description: 'Invisibile a Merlino' },
  { id: 'oberon', name: 'Oberon', faction: 'evil', description: 'Non conosce gli altri cattivi' },
  {
    id: 'minion',
    name: 'Sgherro di Mordred',
    faction: 'evil',
    description: 'Nessun potere speciale'
  }
];
