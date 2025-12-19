export interface ApiClient {
  signIn(email: string, password: string): Promise<any>
  signUp(email: string, password: string): Promise<any>
  signOut(): Promise<any>

  select(table: string, options?: any): Promise<any>
  insert(table: string, data: any): Promise<any>
  update(table: string, id: string, data: any): Promise<any>
  delete(table: string, id: string): Promise<any>

  subscribe?(table: string, callback: (payload: any) => void): () => void
}
