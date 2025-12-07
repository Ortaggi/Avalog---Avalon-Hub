import { Injectable } from '@angular/core';
import { AVALON_ROLES, Match, Role } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  // Mock di qualche Partita
  private matches: Match[] = [
    {
      id: '1',
      groupId: '1',
      date: new Date('2024-06-01'),
      players: [
        { userId: '1', roleId: 'merlin' },
        { userId: '2', roleId: 'percival' },
        { userId: '3', roleId: 'loyal' },
        { userId: '4', roleId: 'loyal' },
        { userId: '5', roleId: 'assassin' },
        { userId: '6', roleId: 'morgana' }
      ],
      winningFaction: 'good',
      victoryType: 'missions',
      createdBy: '1',
      createdAt: new Date('2024-06-01')
    },
    {
      id: '2',
      groupId: '1',
      date: new Date('2024-06-08'),
      players: [
        { userId: '1', roleId: 'loyal' },
        { userId: '2', roleId: 'merlin' },
        { userId: '3', roleId: 'percival' },
        { userId: '4', roleId: 'assassin' },
        { userId: '5', roleId: 'mordred' },
        { userId: '6', roleId: 'loyal' }
      ],
      winningFaction: 'evil',
      victoryType: 'assassination',
      createdBy: '1',
      createdAt: new Date('2024-06-08')
    }
  ];

  getAll(): Match[] {
    return this.matches;
  }

  getById(id: string): Match {
    return this.matches.find((m) => m.id === id);
  }

  getByGroupId(groupId: string): Match[] {
    return this.matches.filter((m) => m.groupId === groupId);
  }

  // Array.some(): ritorna true se trova qualcosa che matcha
  getByUserId(userId: string): Match[] {
    return this.matches.filter((m) => m.players.some((p) => p.userId === userId));
  }

  create(match: Omit<Match, 'id' | 'createdAt'>): Match {
    const newMatch: Match = {
      ...match,
      id: Date.now.toString(),
      createdAt: new Date()
    };
    this.matches.push(newMatch);
    return newMatch;
  }

  delete(matchId: string): boolean {
    const index = this.matches.findIndex((m) => m.id === matchId);
    if (index !== -1) {
      this.matches.splice(index, 1);
      return true;
    }
    return false;
  }

  //TODO: Aggiungo qualche funzione helper, ma da valutare se va spostata in un service a se

  getPlayerRole(match: Match, playerId: string): Role {
    const player = match.players.find((p) => p.id === playerId);
    if (!player) {
      return undefined;
    }
    return AVALON_ROLES.find((ar: Role) => ar.roleId === player.roleId);
  }

  didPlayerWin(match: Match, userId: string): boolean {
    const role = this.getPlayerRole(match, userId);
    if (!role) {
      return false;
    }
    return role.faction === match.winningFaction;
  }
}
