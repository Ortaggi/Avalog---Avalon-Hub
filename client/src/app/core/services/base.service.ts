import { inject, Injectable } from "@angular/core";
import { ApiClient } from "../models/api";
import { SERVER_TYPE_TOKEN } from "../config/client.config";
import { SupabaseService } from "./supabase.service";
import { HttpClientService } from "./api.service";



@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private client: ApiClient;
  private serverType = inject(SERVER_TYPE_TOKEN);

  constructor() {
    this.client = this.serverType === 'supabase' ? new SupabaseService() : new HttpClientService();
  }

  async signIn(email: string, password: string) {
    return this.client.signIn(email, password);
  }

  async signUp(email: string, password: string) {
    return this.client.signUp(email, password);
  }

  async signOut() {
    return this.client.signOut();
  }

  async select(table: string, options?: any) {
    return this.client.select(table, options);
  }

  async insert(table: string, data: any) {
    return this.client.insert(table, data);
  }

  async update(table: string, id: string, data: any) {
    return this.client.update(table, id, data);
  }

  async delete(table: string, id: string) {
    return this.client.delete(table, id);
  }

  subscribe(table: string, callback: (payload: any) => void) {
    if (this.client.subscribe) {
      return this.client.subscribe(table, callback);
    }
    // Return empty unsubscribe function for API client
    return () => { /* empty */ };
  }

  getServerType() {
    return this.serverType;
  }
}
