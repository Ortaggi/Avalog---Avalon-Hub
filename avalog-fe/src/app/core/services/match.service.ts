import { inject, Injectable } from '@angular/core';
import { AVALON_ROLES, Match, Role } from '../models';
import { MatchSqliteRepository } from '../repositories';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchRepo = inject(MatchSqliteRepository);

  async getAll(): Promise<Match[]> {
    return this.matchRepo.getAll();
  }

  async getById(id: string): Promise<Match | null> {
    return this.matchRepo.getById(id);
  }

  async getByGroupId(groupId: string): Promise<Match[]> {
    return this.matchRepo.getByGroupId(groupId);
  }

  async getByUserId(userId: string): Promise<Match[]> {
    return this.matchRepo.getByUserId(userId);
  }

  async create(match: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    return this.matchRepo.create(match);
  }

  async update(id: string, matchData: Partial<Match>): Promise<Match | null> {
    return this.matchRepo.update(id, matchData);
  }

  async delete(id: string): Promise<boolean> {
    return this.matchRepo.delete(id);
  }

  getPlayerRole(match: Match, userId: string): Role | undefined {
    const player = match.players.find((p) => p.idPlayer === userId);
    if (!player) return undefined;

    return AVALON_ROLES.find((r) => r.id === player.idRole);
  }

  didPlayerWin(match: Match, userId: string): boolean {
    const role = this.getPlayerRole(match, userId);
    if (!role) return false;

    return role.faction === match.winningFaction;
  }
}
