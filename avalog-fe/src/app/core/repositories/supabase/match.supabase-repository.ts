import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Match, PlayerMatch } from '../../models';
import { BaseRepository } from '../base.repository';

@Injectable({
  providedIn: 'root'
})
export class MatchSupabaseRepository implements BaseRepository<Match> {
  private supabaseClient = inject(SupabaseService).getClient();

  async getAll(): Promise<Match[]> {
    const { data, error } = await this.supabaseClient
      .from('matches')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getById(id: string): Promise<Match | null> {
    const { data, error } = await this.supabaseClient
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToMatch(data) : null;
  }

  async getByGroupId(groupId: string): Promise<Match[]> {
    const { data, error } = await this.supabaseClient
      .from('matches')
      .select('*')
      .eq('group_id', groupId)
      .order('date', { ascending: false });

    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async getByUserId(userId: string): Promise<Match[]> {
    const { data: playerData, error: playerError } = await this.supabaseClient
      .from('match_players')
      .select('match_id')
      .eq('user_id', userId);

    if (playerError) throw playerError;
    if (!playerData || playerData.length === 0) return [];

    const matchIds = playerData.map((p) => p.match_id);

    const { data, error } = await this.supabaseClient
      .from('matches')
      .select('*')
      .in('id', matchIds)
      .order('date', { ascending: false });

    if (error) throw error;

    const matches: Match[] = [];
    for (const row of data || []) {
      const match = await this.mapToMatch(row);
      matches.push(match);
    }
    return matches;
  }

  async create(matchData: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const { data, error } = await this.supabaseClient
      .from('matches')
      .insert({
        group_id: matchData.groupId,
        date: matchData.date instanceof Date ? matchData.date.toISOString() : matchData.date,
        winning_faction: matchData.winningFaction,
        victory_type: matchData.victoryType,
        notes: matchData.notes || null,
        created_by: matchData.createdBy
      })
      .select()
      .single();

    if (error) throw error;

    for (const player of matchData.players) {
      await this.supabaseClient.from('match_players').insert({
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

    const { data, error } = await this.supabaseClient
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (matchData.players) {
      await this.supabaseClient.from('match_players').delete().eq('match_id', id);

      for (const player of matchData.players) {
        await this.supabaseClient.from('match_players').insert({
          match_id: id,
          user_id: player.idPlayer,
          role_id: player.idRole
        });
      }
    }

    return data ? this.mapToMatch(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    await this.supabaseClient.from('match_players').delete().eq('match_id', id);

    const { error } = await this.supabaseClient.from('matches').delete().eq('id', id);

    if (error) throw error;
    return true;
  }

  private async mapToMatch(data: Record<string, unknown>): Promise<Match> {
    const { data: players } = await this.supabaseClient
      .from('match_players')
      .select('user_id, role_id')
      .eq('match_id', data['id']);

    const playerMatches: PlayerMatch[] = (players || []).map((p) => ({
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
