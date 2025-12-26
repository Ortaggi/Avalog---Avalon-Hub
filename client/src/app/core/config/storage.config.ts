export type StorageType = 'sqlite' | 'api' | 'supabase';

export const STORAGE_CONFIG = {
  // Switcha il valore per cambiare
  type: 'api' as StorageType,

  //url ipotetico dell'api backend
  apiUrl: 'http://localhost:8000/api'
};
