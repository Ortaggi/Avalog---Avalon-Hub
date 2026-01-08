import { HttpClient } from '@angular/common/http';
import { ApiInterface } from './api.interface';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { environment } from '../../../../environments/environment';

export class BackendApi implements ApiInterface {
  private readonly baseUrl = environment.backendUrl;

  constructor(private readonly http: HttpClient) {
    if (!this.baseUrl) {
      throw new Error('Backend URL must be provided in the environment configuration.');
    }
  }

  async signUp(email: string, password: string, userData?: any): Promise<any> {
    const body = { email, password, ...userData };
    return firstValueFrom(this.http.post(`${this.baseUrl}/auth/register`, body));
  }

  async signIn(email: string, password: string): Promise<any> {
    const body = { email, password };
    return firstValueFrom(this.http.post(`${this.baseUrl}/auth/login`, body));
  }

  async signOut(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/auth/logout`));
  }

  async getCurrentUser(): Promise<any> {
    return firstValueFrom(this.http.get(`${this.baseUrl}/auth/me`));
  }

  async create<T>(table: string, data: T): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${this.baseUrl}/${table}`, data));
  }

  async getById<T>(table: string, id: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${this.baseUrl}/${table}/${id}`));
  }

  async getAll<T>(table: string, filters?: any): Promise<T[]> {
    let url = `${this.baseUrl}/${table}`;
    if (filters) {
      const params = new URLSearchParams(filters).toString();
      url += `?${params}`;
    }
    return firstValueFrom(this.http.get<T[]>(url));
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    return firstValueFrom(this.http.put<T>(`${this.baseUrl}/${table}/${id}`, data));
  }

  async delete(table: string, id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${table}/${id}`));
  }

  async query<T>(table: string, query: any): Promise<T[]> {
    const params = new URLSearchParams(query).toString();
    return firstValueFrom(this.http.get<T[]>(`${this.baseUrl}/${table}/query?${params}`));
  }

  async count(table: string, filters?: any): Promise<number> {
    let url = `${this.baseUrl}/${table}/count`;
    if (filters) {
      const params = new URLSearchParams(filters).toString();
      url += `?${params}`;
    }
    const result = await firstValueFrom(this.http.get<{ count: number }>(url));
    return result.count;
  }
}
