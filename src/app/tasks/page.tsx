import { deleteTask } from '@/actions/tasks';
import { TaskForm } from '@/components/forms/task-form';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requireAuthorizedRoute } from '@/lib/auth/session';
import { canDelete, canEdit } from '@/lib/auth/roles';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate, isOverdue } from '@/lib/utils/date';

/**
 * Quadro operacional de tarefas não vinculadas diretamente aos CTs.
 */
export default async function TasksPage() {
  const { profile, role } = await requireAuthorizedRoute('/tasks');
  const supabase = await createServerSupabaseClient();

  const [{ data: tasks }, { data: users }] = await Promise.all([
    supabase.from('tasks').select('*, responsible_user:profiles!tasks_responsible_user_id_fkey(full_name)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('full_name')
  ]);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Header profile={profile} title="Backlog Operacional" subtitle="Gerencie atividades extras em formato visual orientado à execução." />

        {canEdit(role) && (
          <section className="mb-6">
            <TaskForm users={users ?? []} />
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(tasks ?? []).map((task) => {
            const overdue = isOverdue(task.forecast_date, task.effective_date) || task.status === 'ATRASADA';
            const tone = task.status === 'CONCLUIDA' ? 'green' : overdue ? 'red' : task.status === 'EM_ANDAMENTO' ? 'yellow' : 'blue';

            return (
              <article key={task.id} className="card-shell">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{task.description || 'Sem detalhamento adicional.'}</p>
                  </div>
                  <Badge label={overdue ? 'ATRASADA' : task.status} tone={tone as 'green' | 'yellow' | 'red' | 'blue'} />
                </div>
                <dl className="mt-5 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-4"><dt>Responsável</dt><dd>{(task.responsible_user as { full_name?: string } | null)?.full_name ?? '—'}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Alocação</dt><dd>{formatDate(task.allocation_date)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Previsão</dt><dd>{formatDate(task.forecast_date)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Efetiva</dt><dd>{formatDate(task.effective_date)}</dd></div>
                </dl>
                {canDelete(role) && (
                  <form className="mt-5" action={async () => { 'use server'; await deleteTask(task.id); }}>
                    <Button type="submit" variant="danger" className="w-full">Excluir tarefa</Button>
                  </form>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
