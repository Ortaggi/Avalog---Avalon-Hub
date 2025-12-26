import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models';
import { UserSupabaseRepository } from '../repositories';
import { STORAGE_CONFIG } from '../config/storage.config';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseRepo = inject(UserSupabaseRepository);

  private tokenService = inject(TokenService);
  private currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  private get userRepo() {
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

  // TODO: Capire se con i signal e` giusto o meno
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      //console.log('Login tentativo per:', email);
      const user = await this.userRepo.validatePassword(email, password);
      if (user) {
        //console.log('Login successo, utente:', user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        //sessionStorage.setItem('currentUserId', user.id);
        this.tokenService.setToken(user.id);
        return true;
      }
      //console.log('Login fallito: credenziali non valide');
      return false;
    } catch (error) {
      console.error('Errore durante il login', error);
      return false;
    }
  }

  logout(): void {
    //console.log('Logout eseguito');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    //sessionStorage.removeItem('currentUserId');
    this.tokenService.clearToken();
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
      //sessionStorage.setItem('currentUserId', user.id);
      this.tokenService.setToken(user.id);
      return true;
    } catch (error) {
      console.error('Errore durante la registrazione', error);
      return false;
    }
  }

  async restoreSession(): Promise<void> {
    //console.log('RestoreSession chiamato');
    //console.log('Token valido?', this.tokenService.isTokenValid());
    if (this.tokenService.isTokenValid()) {
      const userId = this.tokenService.getUserId();
      //console.log('UserId dal token:', userId);
      if (userId) {
        try {
          // console.log('UserId dal token:', userId);
          const user = await this.userRepo.getById(userId);
          //console.log('Utente trovato:', user);
          if (user) {
            this.currentUser.set(user);
            this.isAuthenticated.set(true);
            // console.log('Sessione ripristinata con successo');
          } else {
            //console.log('Utente non trovato, pulisco token');
            this.tokenService.clearToken();
          }
        } catch (error) {
          console.error('Errore restore session:', error);
          this.tokenService.clearToken();
        }
      }
    }
  }
}
