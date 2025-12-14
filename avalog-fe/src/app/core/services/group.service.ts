import { inject, Injectable } from '@angular/core';
import { Group } from '../models';
import { GroupSupabaseRepository } from '../repositories';
import { STORAGE_CONFIG } from '../config/storage.config';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private supabaseRepo = inject(GroupSupabaseRepository);

  private get groupRepo() {
    switch (STORAGE_CONFIG.type) {
      case 'supabase':
        return this.supabaseRepo;
      case 'api':
        return this.supabaseRepo;
      case 'sqlite':
        return this.supabaseRepo;
      default:
        return this.supabaseRepo;
    }
  }
  async getAll(): Promise<Group[]> {
    return this.groupRepo.getAll();
  }

  async getById(id: string): Promise<Group | null> {
    return this.groupRepo.getById(id);
  }

  async getByUserId(userId: string): Promise<Group[]> {
    return this.groupRepo.getByUserId(userId);
  }

  async create(group: Omit<Group, 'id' | 'createdAt'>): Promise<Group> {
    return this.groupRepo.create(group);
  }

  async update(id: string, groupData: Partial<Group>): Promise<Group | null> {
    return this.groupRepo.update(id, groupData);
  }

  async delete(id: string): Promise<boolean> {
    return this.groupRepo.delete(id);
  }

  async joinByCode(code: string, userId: string): Promise<Group | null> {
    const group = await this.groupRepo.getByInviteCode(code);
    if (group) {
      await this.groupRepo.addMember(group.id, userId);
      return this.groupRepo.getById(group.id);
    }
    return null;
  }

  async addMember(groupId: string, userId: string): Promise<boolean> {
    return this.groupRepo.addMember(groupId, userId);
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    return this.groupRepo.removeMember(groupId, userId);
  }
}
