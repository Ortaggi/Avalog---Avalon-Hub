import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase.config';
import { ApiClient } from '../models/api';

export class SupabaseService implements ApiClient {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async select(table: string, options: any = {}) {
    let query = this.supabase.from(table).select(options.select || '*');

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  async insert(table: string, data: any) {
    return this.supabase.from(table).insert(data);
  }

  async update(table: string, id: string, data: any) {
    return this.supabase.from(table).update(data).eq('id', id);
  }

  async delete(table: string, id: string) {
    return this.supabase.from(table).delete().eq('id', id);
  }

  subscribe(table: string, callback: (payload: any) => void) {
    const subscription = this.supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();

    return () => subscription.unsubscribe();
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
