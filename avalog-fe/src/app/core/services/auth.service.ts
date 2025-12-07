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

  login(): boolean {
    return false;
  }
}
