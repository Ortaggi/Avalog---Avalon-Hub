import { Injectable, inject } from '@angular/core';
import { Group } from '../../models';
import { BaseRepository } from '../base.repository';
import { BaseService } from '../../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class GroupSupabaseRepository implements BaseRepository<Group> {
  private client = inject(BaseService);

  async getAll(): Promise<Group[]> {
    const { data, error } = await this.client.select('groups', '*');

    if (error) throw error;

    const groups: Group[] = [];
    for (const row of data || []) {
      const group = await this.mapToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getById(id: string): Promise<Group | null> {
    const { data, error } = await this.client.select('groups', {select: '*', filter: {id}});
    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async getByUserId(userId: string): Promise<Group[]> {
    const { data: memberData, error: memberError } = await this.client.select('group_members', {select: 'group_id', filter: {user_id: userId}});

    if (memberError) throw memberError;
    if (!memberData || memberData.length === 0) return [];

    const groupIds = memberData.map((m: any) => m.group_id);

    const { data, error } = await this.client.select('groups', {select: '*', filter: {id: groupIds}});

    if (error) throw error;

    const groups: Group[] = [];
    for (const row of data || []) {
      const group = await this.mapToGroup(row);
      groups.push(group);
    }
    return groups;
  }

  async getByInviteCode(code: string): Promise<Group | null> {
    const { data, error } = await this.client.select('groups', {select: '*', filter: {invite_code: code}});

    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async create(groupData: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    const inviteCode = groupData.inviteCode || this.generateInviteCode();

    const { data, error } = await this.client.insert('groups', {
      name: groupData.name,
      description: groupData.description || null,
      admin_id: groupData.adminId,
        invite_code: inviteCode
      });

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

    const { data, error } = await this.client.update('groups', id, updateData);

    if (error) throw error;
    return data ? this.mapToGroup(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    // Prima elimina i membri (cascade dovrebbe farlo automaticamente)
    await this.client.delete('group_members', id);

    const { error } = await this.client.delete('groups', id);

    if (error) throw error;
    return true;
  }

  async addMember(groupId: string, userId: string): Promise<boolean> {
    const { error } = await this.client.insert('group_members', {
      group_id: groupId,
      user_id: userId
    });

    if (error) throw error;
    return true;
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const { error } = await this.client.delete('group_members', userId);
    if (error) throw error;
    return true;
  }

  private async mapToGroup(data: Record<string, unknown>): Promise<Group> {
    const { data: members } = await this.client.select('group_members', {select: 'user_id', filter: {group_id: data['id']}});

    return {
      id: data['id'] as string,
      name: data['name'] as string,
      description: data['description'] as string | undefined,
      adminId: data['admin_id'] as string,
      inviteCode: data['invite_code'] as string | undefined,
      memberIds: (members || []).map((m: any) => m.user_id),
      createdAt: new Date(data['created_at'] as string)
    };
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
