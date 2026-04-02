'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/auth/session';
import { canDelete, canEdit } from '@/lib/auth/roles';
import { taskSchema } from '@/lib/validators/task';

/**
 * Cria uma tarefa operacional independente de casos de teste.
 */
export async function createTask(formData: FormData): Promise<void> {
  const { userId, profile } = await requireSession();
  if (!canEdit(profile.role)) {
    throw new Error('Usuário sem permissão para criar tarefas.');
  }

  const parsed = taskSchema.parse({
    title: formData.get('title'),
    description: formData.get('description') || null,
    responsible_user_id: formData.get('responsible_user_id') || null,
    allocation_date: formData.get('allocation_date') || null,
    forecast_date: formData.get('forecast_date') || null,
    effective_date: formData.get('effective_date') || null,
    status: formData.get('status')
  });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('tasks').insert({
    ...parsed,
    created_by: userId
  });

  if (error) {
    throw new Error(`Falha ao criar tarefa: ${error.message}`);
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
}

/**
 * Exclui tarefa apenas para administradores.
 */
export async function deleteTask(id: string): Promise<void> {
  const { profile } = await requireSession();
  if (!canDelete(profile.role)) {
    throw new Error('Somente administradores podem excluir tarefas.');
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    throw new Error(`Falha ao excluir tarefa: ${error.message}`);
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
}
