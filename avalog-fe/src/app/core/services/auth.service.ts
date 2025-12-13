import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models';
import { UserSqliteRepository, UserSupabaseRepository } from '../repositories';
import { STORAGE_CONFIG } from '../config/storage.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sqliteRepo = inject(UserSqliteRepository);
  private supabaseRepo = inject(UserSupabaseRepository);
  private currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

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

  // TODO: Capire se con i signal e` giusto o meno
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  async login(email: string, password: string): Promise<boolean> {
    const user = await this.userRepo.validatePassword(email, password);

    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      sessionStorage.setItem('currentUserId', user.id);
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    sessionStorage.removeItem('currentUserId');
  }

  async register(
    email: string,
    username: string,
    displayName: string,
    password: string
  ): Promise<boolean> {
    try {
      const existingMail = await this.userRepo.getByEmail(email);
      if (existingMail) return false;

      const existingUsername = await this.userRepo.getByUsername(username);
      if (existingUsername) return false;

      const user = await this.userRepo.create({
        email,
        username,
        displayName,
        password
      });

      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      sessionStorage.setItem('currentUserId', user.id);
      return true;
    } catch {
      return false;
    }
  }

  async restoreSession(): Promise<void> {
    const userId = sessionStorage.getItem('currentUserId');
    if (userId) {
      const user = await this.userRepo.getById(userId);
      if (user) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }
    }
  }
}
