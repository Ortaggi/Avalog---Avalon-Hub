export interface ApiInterface {
  signUp(email: string, password: string, userData?: any): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<any>;

  create<T>(table: string, data: T): Promise<T>;
  getById<T>(table: string, id: string): Promise<T>;
  getAll<T>(table: string, filters?: any): Promise<T[]>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  delete(table: string, id: string): Promise<void>;

  query<T>(table: string, query: any): Promise<T[]>;
  count(table: string, filters?: any): Promise<number>;
}
