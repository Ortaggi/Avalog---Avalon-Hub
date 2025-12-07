import { Injectable, signal } from '@angular/core';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User>(null);
  isAuthenticated = signal<boolean>(false);

  // MOCK
  private mockedUser: User = {
    id: '1',
    email: 'diego.gettatelli@email.it',
    username: 'dgett130',
    displayName: 'Diego Gettatelli',
    avatar: undefined,
    createdAt: new Date('2025-12-06')
  };

  // TODO: Capire se con i signal e` giusto o meno
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  login(): boolean {
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  register(): boolean {
    return false;
  }
}
