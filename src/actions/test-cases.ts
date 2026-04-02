'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { canDelete, canEdit } from '@/lib/auth/roles';
import { testCaseSchema } from '@/lib/validators/test-case';

/**
 * Cria um caso de teste validando permissão e consistência mínima dos dados.
 * Usa Server Action para simplificar o fluxo de submissão do formulário.
 */
export async function createTestCase(formData: FormData): Promise<void> {
  const { userId, profile } = await requireSession();
  if (!canEdit(profile.role)) {
    throw new Error('Usuário sem permissão para criar casos de teste.');
  }

  const parsed = testCaseSchema.parse({
    module_id: formData.get('module_id'),
    code: formData.get('code'),
    description: formData.get('description'),
    system_name: formData.get('system_name'),
    scope_main: formData.get('scope_main') || null,
    out_of_scope: formData.get('out_of_scope') || null,
    notes: formData.get('notes') || null,
    status: formData.get('status'),
    priority: formData.get('priority'),
    assigned_user_id: formData.get('assigned_user_id') || null,
    start_date: formData.get('start_date') || null,
    due_date: formData.get('due_date') || null,
    conclusion_date: formData.get('conclusion_date') || null,
    condition: formData.get('condition') || null,
    pre_condition: formData.get('pre_condition') || null
  });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('test_cases').insert({
    ...parsed,
    author_id: userId
  });

  if (error) {
    throw new Error(`Falha ao criar caso de teste: ${error.message}`);
  }

  revalidatePath('/test-cases');
  revalidatePath('/dashboard');
}

/**
 * Exclui um caso de teste apenas quando o perfil tem papel ADM.
 */
export async function deleteTestCase(id: string): Promise<void> {
  const { profile } = await requireSession();
  if (!canDelete(profile.role)) {
    throw new Error('Somente administradores podem excluir casos de teste.');
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('test_cases').delete().eq('id', id);

  if (error) {
    throw new Error(`Falha ao excluir caso de teste: ${error.message}`);
  }

  revalidatePath('/test-cases');
  revalidatePath('/dashboard');
}

/**
 * Faz upload de evidências no bucket do Supabase Storage e registra metadados no banco.
 */
export async function uploadEvidence(testCaseId: string, formData: FormData): Promise<void> {
  const { userId, profile } = await requireSession();
  if (!canEdit(profile.role)) {
    throw new Error('Usuário sem permissão para enviar evidências.');
  }

  const file = formData.get('evidence') as File | null;
  if (!file) {
    throw new Error('Arquivo de evidência não informado.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${testCaseId}/${Date.now()}-${file.name}`;
  const supabase = await createServerSupabaseClient();

  const storage = await supabase.storage.from('evidences').upload(path, buffer, {
    contentType: file.type,
    upsert: false
  });

  if (storage.error) {
    throw new Error(`Falha no upload do arquivo: ${storage.error.message}`);
  }

  const { error } = await supabase.from('test_case_evidences').insert({
    test_case_id: testCaseId,
    file_name: file.name,
    file_path: path,
    file_type: file.type,
    uploaded_by: userId
  });

  if (error) {
    throw new Error(`Falha ao registrar evidência: ${error.message}`);
  }

  revalidatePath('/test-cases');
}
