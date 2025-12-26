import { defineConfig } from '../defineConfig';

export function createProdConfig() {
  return defineConfig({
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: ''
  });
}
