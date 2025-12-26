import { Injectable, inject } from '@angular/core';
import { Match, PlayerMatch } from '../../models';
import { BaseRepository } from '../base.repository';
import { BaseService } from '../../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class MatchSupabaseRepository implements BaseRepository<Match> {
  private client = inject(BaseService);

  async getAll(): Promise<Match[]> {
    const { data, error } = await this.client.select('matches', '*');
    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getById(id: string): Promise<Match | null> {
    const { data, error } = await this.client.select('matches', {select: '*', filter: {id}});
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToMatch(data) : null;
  }

  async getByGroupId(groupId: string): Promise<Match[]> {
    const { data, error } = await this.client.select('matches', {select: '*', filter: {group_id: groupId}});

    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getByUserId(userId: string): Promise<Match[]> {
    const { data: playerData, error: playerError } = await this.client.select('match_players', {select: 'match_id', filter: {user_id: userId}});

    if (playerError) throw playerError;
    if (!playerData || playerData.length === 0) return [];

    const matchIds = playerData.map((p: any) => p.match_id);

    const { data, error } = await this.client.select('matches', {select: '*', filter: {id: matchIds}});
    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async create(matchData: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const { data, error } = await this.client.insert('matches', {
      group_id: matchData.groupId,
      date: matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date,
      winning_faction: matchData.winningFaction,
        victory_type: matchData.victoryType,
        notes: matchData.notes || null,
        created_by: matchData.createdBy
      });

    if (error) throw error;

    for (const player of matchData.players) {
      await this.client.insert('match_players', {
        match_id: data.id,
        user_id: player.idPlayer,
        role_id: player.idRole
      });
    }

    return this.mapToMatch(data);
  }

  async update(id: string, matchData: Partial<Match>): Promise<Match | null> {
    const updateData: Record<string, unknown> = {};

    if (matchData.date) {
      updateData['date'] =
        matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date;
    }
    if (matchData.winningFaction) updateData['winning_faction'] = matchData.winningFaction;
    if (matchData.victoryType) updateData['victory_type'] = matchData.victoryType;
    if (matchData.notes !== undefined) updateData['notes'] = matchData.notes;

    const { data, error } = await this.client.update('matches', id, updateData);

    if (error) throw error;

    if (matchData.players) {
      await this.client.delete('match_players', id);

      for (const player of matchData.players) {
        await this.client.insert('match_players', {
          match_id: id,
          user_id: player.idPlayer,
          role_id: player.idRole
        });
      }
    }

    return data ? this.mapToMatch(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    await this.client.delete('match_players', id);

    const { error } = await this.client.delete('matches', id);

    if (error) throw error;
    return true;
  }

  private async mapToMatch(data: Record<string, unknown>): Promise<Match> {
    const { data: players } = await this.client.select('match_players', {select: 'user_id, role_id', filter: {match_id: data['id']}});

    const playerMatches: PlayerMatch[] = (players || []).map((p: any) => ({
      idPlayer: p.user_id,
      idRole: p.role_id
    }));

    return {
      id: data['id'] as string,
      groupId: data['group_id'] as string,
      date: new Date(data['date'] as string),
      winningFaction: data['winning_faction'] as 'good' | 'evil',
      victoryType: data['victory_type'] as 'missions' | 'assassination',
      notes: data['notes'] as string | undefined,
      createdBy: data['created_by'] as string,
      createdAt: new Date(data['created_at'] as string),
      players: playerMatches
    };
  }
}
