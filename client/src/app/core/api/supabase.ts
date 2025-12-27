import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApiInterface } from './api.interface';
import { environment } from '../../../../environments/environment';

export class SupabaseApi implements ApiInterface {
  private readonly supabase: SupabaseClient;
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly supabaseKey = environment.supabaseKey;

  constructor() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL and Key must be provided in the environment configuration.');
    }
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async signUp(email: string, password: string, userData?: any): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: userData },
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut(): Promise<any> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    return true;
  }

  async getCurrentUser(): Promise<any> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }

  async create<T>(table: string, data: T): Promise<T> {
    const { data: result, error } = await this.supabase.from(table).insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async getById<T>(table: string, id: string): Promise<T> {
    const { data, error } = await this.supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async getAll<T>(table: string, filters?: any): Promise<T[]> {
    let query = this.supabase.from(table).select('*');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }

  async query<T>(table: string, query: any): Promise<T[]> {
    // Implement custom query logic based on your needs
    const { data, error } = await this.supabase.from(table).select('*').match(query);
    if (error) throw error;
    return data || [];
  }

  async count(table: string, filters?: any): Promise<number> {
    let query = this.supabase.from(table).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
}
