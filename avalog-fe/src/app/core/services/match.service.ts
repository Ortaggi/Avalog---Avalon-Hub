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
        { idPlayer: '1', idRole: 'merlin' },
        { idPlayer: '2', idRole: 'percival' },
        { idPlayer: '3', idRole: 'loyal' },
        { idPlayer: '4', idRole: 'loyal' },
        { idPlayer: '5', idRole: 'assassin' },
        { idPlayer: '6', idRole: 'morgana' }
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
        { idPlayer: '1', idRole: 'loyal' },
        { idPlayer: '2', idRole: 'merlin' },
        { idPlayer: '3', idRole: 'percival' },
        { idPlayer: '4', idRole: 'assassin' },
        { idPlayer: '5', idRole: 'mordred' },
        { idPlayer: '6', idRole: 'loyal' }
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

  getById(id: string): Match | undefined {
    return this.matches.find((m) => m.id === id);
  }

  getByGroupId(groupId: string): Match[] {
    return this.matches.filter((m) => m.groupId === groupId);
  }

  // Array.some(): ritorna true se trova qualcosa che matcha
  getByUserId(userId: string): Match[] {
    return this.matches.filter((m) => m.players.some((p) => p.idRole === userId));
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

  getPlayerRole(match: Match, playerId: string): Role | undefined {
    const player = match.players.find((p) => p.idRole === playerId);
    if (!player) {
      return undefined;
    }
    return AVALON_ROLES.find((ar: Role) => ar.id === player.idRole);
  }

  didPlayerWin(match: Match, userId: string): boolean {
    const role = this.getPlayerRole(match, userId);
    if (!role) {
      return false;
    }
    return role.faction === match.winningFaction;
  }
}
