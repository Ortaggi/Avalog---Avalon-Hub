import { inject, Injectable } from '@angular/core';
import { BaseRepository } from '../base.repository';
import { User } from '../../models';
import { SupabaseService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class UserSupabaseRepository implements BaseRepository<User> {
  private supabaseService = inject(SupabaseService).getClient();

  private mapToUser(data: Record<string, unknown>): User {
    return {
      id: data['id'] as string,
      email: data['email'] as string,
      username: data['username'] as string,
      displayName: data['display_name'] as string,
      avatar: data['avatar'] as string | undefined,
      createdAt: new Date(data['created_at'] as string)
    };
  }

  async create(entity: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User> {
    const { data, error } = await this.supabaseService
      .from('users')
      .insert({
        email: entity.email,
        username: entity.username,
        display_name: entity.displayName,
        password: entity.password,
        avatar: entity.avatar || null
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToUser(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabaseService.from('users').delete().eq('id', id);

    if (error) throw error;
    return true;
  }

  async getAll(): Promise<User[]> {
    const { data, error } = await this.supabaseService.from('users').select('*');

    if (error) throw error;
    return (data || []).map((user) => this.mapToUser(user));
  }

  async getById(id: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

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

    const { data, error } = await this.supabaseService
      .from('users')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data ? this.mapToUser(data) : null;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .maybeSingle();

    if (error) throw error;
    return data ? this.mapToUser(data) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToUser(data) : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapToUser(data) : null;
  }
}
