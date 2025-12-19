import { ApiClient } from "../models/api";

export class HttpClientService implements ApiClient {
  private baseUrl = 'http://localhost:8000';

  async signIn(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async signUp(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async signOut(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth/signout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async select(table: string, options?: any): Promise<any> {
    console.log('HTTP Client select called with options:', options);
    const response = await fetch(`${this.baseUrl}/${table}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async insert(table: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async update(table: string, id: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${table}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async delete(table: string, id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${table}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
}
