import { defineConfig } from '../defineConfig';

export function createLocalConfig() {
  return defineConfig({
    SUPABASE_URL: 'https://flfoyhmtxcputsxohsvf.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZm95aG10eGNwdXRzeG9oc3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjczMzgsImV4cCI6MjA4MTIwMzMzOH0.b1Dud2hWbP0gkWLovKM1WLcPbkDDOLrvk6gKIiX2aIw'
  });
}
