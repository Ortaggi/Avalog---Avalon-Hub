import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Group } from '../../models';
import { BaseRepository } from '../base.repository';

@Injectable({
  providedIn: 'root'
})
export class GroupSupabaseRepository implements BaseRepository<Group> {
  private supabaseClient = inject(SupabaseService).getClient();

  async getAll(): Promise<Group[]> {
    const { data, error } = await this.supabaseClient.from('groups').select('*');

    if (error) throw error;

    const groups: Group[] = [];
    for (const row of data || []) {
      const group = await this.mapToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getById(id: string): Promise<Group | null> {
    const { data, error } = await this.supabaseClient
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async getByUserId(userId: string): Promise<Group[]> {
    const { data: memberData, error: memberError } = await this.supabaseClient
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId);

    if (memberError) throw memberError;
    if (!memberData || memberData.length === 0) return [];

    const groupIds = memberData.map((m) => m.group_id);

    const { data, error } = await this.supabaseClient.from('groups').select('*').in('id', groupIds);

    if (error) throw error;

    const groups: Group[] = [];
    for (const row of data || []) {
      const group = await this.mapToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getByInviteCode(code: string): Promise<Group | null> {
    const { data, error } = await this.supabaseClient
      .from('groups')
      .select('*')
      .eq('invite_code', code)
      .single();

    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async create(groupData: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const inviteCode = groupData.inviteCode || this.generateInviteCode();

    const { data, error } = await this.supabaseClient
      .from('groups')
      .insert({
        name: groupData.name,
        description: groupData.description || null,
        admin_id: groupData.adminId,
        invite_code: inviteCode
      })
      .select()
      .single();

    if (error) throw error;

    // Aggiungi l'admin come membro
    await this.addMember(data.id, groupData.adminId);

    // Aggiungi gli altri membri
    for (const memberId of groupData.memberIds) {
      if (memberId !== groupData.adminId) {
        await this.addMember(data.id, memberId);
      }
    }

    return this.mapToGroup(data);
  }

  async update(id: string, groupData: Partial<Group>): Promise<Group | null> {
    const updateData: Record<string, unknown> = {};

    if (groupData.name) updateData['name'] = groupData.name;
    if (groupData.description !== undefined) updateData['description'] = groupData.description;

    const { data, error } = await this.supabaseClient
      .from('groups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    // Prima elimina i membri (cascade dovrebbe farlo automaticamente)
    await this.supabaseClient.from('group_members').delete().eq('group_id', id);

    const { error } = await this.supabaseClient.from('groups').delete().eq('id', id);

    if (error) throw error;
    return true;
  }

  async addMember(groupId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabaseClient.from('group_members').insert({
      group_id: groupId,
      user_id: userId
    });

    if (error) throw error;
    return true;
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabaseClient
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  private async mapToGroup(data: Record<string, unknown>): Promise<Group> {
    const { data: members } = await this.supabaseClient
      .from('group_members')
      .select('user_id')
      .eq('group_id', data['id']);

    return {
      id: data['id'] as string,
      name: data['name'] as string,
      description: data['description'] as string | undefined,
      adminId: data['admin_id'] as string,
      inviteCode: data['invite_code'] as string | undefined,
      memberIds: (members || []).map((m) => m.user_id),
      createdAt: new Date(data['created_at'] as string)
    };
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
