export interface BaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
