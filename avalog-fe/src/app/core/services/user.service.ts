import { inject, Injectable } from '@angular/core';
import { User } from '../models';
import { UserSqliteRepository } from '../repositories';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRepo = inject(UserSqliteRepository);

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
