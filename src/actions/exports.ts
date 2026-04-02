'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { canEdit } from '@/lib/auth/roles';

/**
 * Retorna dados de casos de teste em formato CSV usando a API do Supabase.
 */
export async function exportCasesCsv(): Promise<string> {
  const { profile } = await requireSession();
  if (!canEdit(profile.role)) {
    throw new Error('Usuário sem permissão para exportar.');
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('test_cases').select('*').csv();

  if (error) {
    throw new Error(`Falha na exportação CSV: ${error.message}`);
  }

  return data;
}
