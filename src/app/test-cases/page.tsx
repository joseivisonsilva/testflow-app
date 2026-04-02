import Link from 'next/link';
import { deleteTestCase } from '@/actions/test-cases';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requireAuthorizedRoute } from '@/lib/auth/session';
import { canDelete, canEdit } from '@/lib/auth/roles';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils/date';

/**
 * Lista principal de casos de teste.
 */
export default async function TestCasesPage() {
  const { profile, role } = await requireAuthorizedRoute('/test-cases');
  const supabase = await createServerSupabaseClient();

  const { data: cases } = await supabase.from('test_cases').select(`
    id,
    code,
    description,
    system_name,
    status,
    priority,
    start_date,
    due_date,
    conclusion_date,
    module:modules(name),
    assigned_user:profiles!test_cases_assigned_user_id_fkey(full_name)
  `).order('created_at', { ascending: false });

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Header profile={profile} title="Casos de Teste" subtitle="Gestão hierárquica por módulo com rastreabilidade operacional." />

        <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-soft">
            Filtros sugeridos: por módulo, responsável, prioridade e status.
          </div>
          {canEdit(role) && (
            <Link href="/test-cases/new"><Button>Novo Caso de Teste</Button></Link>
          )}
        </section>

        <section className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Módulo</th>
                  <th className="px-4 py-3">Responsável</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prioridade</th>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Prevista</th>
                  <th className="px-4 py-3">Conclusão</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(cases ?? []).map((testCase) => {
                  const statusTone = testCase.status === 'FINALIZADA' ? 'green' : testCase.status === 'EM_ANDAMENTO' ? 'yellow' : 'red';
                  const priorityTone = testCase.priority === 'CRITICA' || testCase.priority === 'ALTA' ? 'red' : testCase.priority === 'MEDIA' ? 'yellow' : 'blue';
                  return (
                    <tr key={testCase.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4 font-semibold text-slate-700">{testCase.code}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">{testCase.description}</p>
                        <p className="mt-1 text-xs text-slate-500">Sistema: {testCase.system_name}</p>
                      </td>
                      <td className="px-4 py-4">{(testCase.module as { name?: string } | null)?.name ?? '—'}</td>
                      <td className="px-4 py-4">{(testCase.assigned_user as { full_name?: string } | null)?.full_name ?? '—'}</td>
                      <td className="px-4 py-4"><Badge label={testCase.status.replaceAll('_', ' ')} tone={statusTone as 'green' | 'yellow' | 'red'} /></td>
                      <td className="px-4 py-4"><Badge label={testCase.priority} tone={priorityTone as 'green' | 'yellow' | 'red' | 'blue'} /></td>
                      <td className="px-4 py-4">{formatDate(testCase.start_date)}</td>
                      <td className="px-4 py-4">{formatDate(testCase.due_date)}</td>
                      <td className="px-4 py-4">{formatDate(testCase.conclusion_date)}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {canEdit(role) && <Button variant="secondary">Editar</Button>}
                          {canDelete(role) && (
                            <form action={async () => { 'use server'; await deleteTestCase(testCase.id); }}>
                              <Button type="submit" variant="danger">Excluir</Button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
