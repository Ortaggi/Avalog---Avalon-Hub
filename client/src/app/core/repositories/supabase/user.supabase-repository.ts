import { inject, Injectable } from '@angular/core';
import { BaseRepository } from '../base.repository';
import { User } from '../../models';
import { BaseService } from '../../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserSupabaseRepository implements BaseRepository<User> {
  private client = inject(BaseService);

  private mapToUser(data: Record<string, unknown>): User {
    const user = Array.isArray(data) ? data[0] : data;

    console.log('mapToUser - input data:', data);
    console.log('mapToUser - typeof data:', typeof data);
    console.log('mapToUser - data.id:', data['id']);
    console.log('mapToUser - data["id"]:', data['id']);

    return {
      id: user['id'] as string,
      email: user['email'] as string,
      username: user['username'] as string,
      displayName: user['display_name'] as string,
      avatar: user['avatar'] as string | undefined,
      createdAt: new Date(user['created_at'] as string)
    };
  }

  async create(entity: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User> {
    const { data, error } = await this.client.insert('users', {
      email: entity.email,
      username: entity.username,
      display_name: entity.displayName,
      password: entity.password,
      avatar: entity.avatar || null
    });

    if (error) throw error;
    return this.mapToUser(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.delete('users', id);

    if (error) throw error;
    return true;
  }

  async getAll(): Promise<User[]> {
    const { data, error } = await this.client.select('users', '*');

    if (error) throw error;
    return (data || []).map((user: any) => this.mapToUser(user));
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await this.client.select('users', { select: '*', filter: { id } });

    if (error) throw error;
    return data ? this.mapToUser(data) : null;
  }

  async update(id: string, entity: Partial<User>): Promise<User | null> {
    // con record posso creare un set di proprieta di tipo string e valori di tipo unknown
    const updatedData: Record<string, unknown> = {};

    if (entity.avatar !== undefined) updatedData['avatar'] = entity.avatar;
    if (entity.email) updatedData['email'] = entity.email;
    if (entity.displayName) updatedData['display_name'] = entity.displayName;
    if (entity.username) updatedData['username'] = entity.username;

    const { data, error } = await this.client.update('users', id, updatedData);

    if (error) throw error;
    return data ? this.mapToUser(data) : null;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.client.select('users', {
      select: '*',
      filter: { email, password }
    });

    console.log('Supabase validatePassword - raw data:', data);
    console.log('Supabase validatePassword - error:', error);

    if (error) throw error;
    return data ? this.mapToUser(data) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client.select('users', { select: '*', filter: { email } });

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToUser(data) : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.client.select('users', {
      select: '*',
      filter: { username }
    });

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToUser(data) : null;
  }
}
