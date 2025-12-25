export interface Environment {
  production: boolean;
  useSupabase: boolean;
  backendUrl?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}
