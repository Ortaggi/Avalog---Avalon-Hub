import { Injectable } from '@angular/core';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Aggiungo alcuni utenti MOCK
  private users: User[] = [
    {
      id: '1',
      email: 'mariorossi@email.it',
      username: 'mrossi66',
      displayName: 'Mario Rossi',
      createdAt: new Date('2024-12-01')
    },
    {
      id: '2',
      email: 'toniocartonio@email.it',
      username: 'toniocartonio10',
      displayName: 'Tonio Cartonio',
      createdAt: new Date('2024-12-02')
    },
    {
      id: '3',
      email: 'ninofrassica@email.it',
      username: 'ninofrassica1',
      displayName: 'Tony New Star Dance 2000',
      createdAt: new Date('2024-12-03')
    }
  ];

  getAll(): User[] {
    return this.users;
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }
}
