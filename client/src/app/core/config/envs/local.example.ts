import { defineConfig } from '../defineConfig';

export function createLocalConfig() {
  return defineConfig({
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: ''
  });
}
