import { createBrowserClient } from '@supabase/ssr';

/**
 * Cria o cliente Supabase para componentes client-side.
 * Centralizar esta criação evita divergência de configuração entre telas.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
