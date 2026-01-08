export type Faction = 'GOOD' | 'EVIL';

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
    id: 'MERLIN',
    name: 'Merlino',
    faction: 'GOOD',
    description: 'Conosce i cattivi (tranne Mordred)',
    icon: 'mage',
  },
  {
    id: 'PERCIVAL',
    name: 'Percival',
    faction: 'GOOD',
    description: 'Conosce Merlino (ma vede anche Morgana)',
    icon: 'eye',
  },
  {
    id: 'GOOD_SIMPLE',
    name: 'Fedele di Artù',
    faction: 'GOOD',
    description: 'Nessun potere speciale',
    icon: 'shield',
  },

  {
    id: 'ASSASSIN',
    name: 'Assassino',
    faction: 'EVIL',
    description: 'Può tentare di assassinare Merlino',
    icon: 'dagger',
  },
  {
    id: 'MORGANA',
    name: 'Morgana',
    faction: 'EVIL',
    description: 'Appare come Merlino a Percival',
    icon: 'ghost',
  },
  {
    id: 'MORDRED',
    name: 'Mordred',
    faction: 'EVIL',
    description: 'Invisibile a Merlino',
    icon: 'skull',
  },
  {
    id: 'OBERON',
    name: 'Oberon',
    faction: 'EVIL',
    description: 'Non conosce gli altri cattivi',
    icon: 'mask',
  },
  {
    id: 'EVIL_SIMPLE',
    name: 'Sgherro di Mordred',
    faction: 'EVIL',
    description: 'Nessun potere speciale',
    icon: 'minion',
  },
];
