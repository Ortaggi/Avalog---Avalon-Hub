export type StorageType = 'sqlite' | 'api' | 'supabase';

export const STORAGE_CONFIG = {
  // Switcha il valore per cambiare
  type: 'supabase' as StorageType,

  //url ipotetico dell'api backend
  apiUrl: 'http://localhost:8080/api'
};
