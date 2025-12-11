export type StorageType = 'sqlite' | 'api';

export const STORAGE_CONFIG = {
  // Switcha il valore per cambiare
  type: 'sqlite' as StorageType,

  //url ipotetico dell'api backend
  apiUrl: 'http://localhost:8080/api'
};
