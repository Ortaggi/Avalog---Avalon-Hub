import { Injectable, signal } from '@angular/core';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
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

  // TODO: Al momento non gestisco la password
  login(email: string): boolean {
    if (this.mockedUser.email === email) {
      this.currentUser.set(this.mockedUser);
      this.isAuthenticated.set(true);
    }
    return this.isAuthenticated();
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  register(email: string, username: string): boolean {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      displayName: username,
      createdAt: new Date()
    };
    this.currentUser.set(newUser);
    this.isAuthenticated.set(true);

    return true;
  }
}
