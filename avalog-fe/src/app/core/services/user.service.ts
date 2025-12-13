import { inject, Injectable } from '@angular/core';
import { User } from '../models';
import { UserSqliteRepository, UserSupabaseRepository } from '../repositories';
import { STORAGE_CONFIG } from '../config/storage.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private sqliteRepo = inject(UserSqliteRepository);
  private supabaseRepo = inject(UserSupabaseRepository);

  private get userRepo() {
    switch (STORAGE_CONFIG.type) {
      case 'supabase':
        return this.supabaseRepo;
      case 'api':
        return this.sqliteRepo;
      case 'sqlite':
        return this.sqliteRepo;
      default:
        return this.sqliteRepo;
    }
  }

  async getAll(): Promise<User[]> {
    return this.userRepo.getAll();
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepo.getById(id);
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.userRepo.getByUsername(username);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return this.userRepo.update(id, userData);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepo.delete(id);
  }
}
