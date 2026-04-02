import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { StatCard } from '@/components/dashboard/stat-card';
import { requireAuthorizedRoute } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { toPercent } from '@/lib/utils/date';

/**
 * Dashboard executivo com indicadores gerais.
 */
export default async function DashboardPage() {
  const { profile } = await requireAuthorizedRoute('/dashboard');
  const supabase = await createServerSupabaseClient();

  const [{ data: cases }, { data: modules }, { data: tasks }] = await Promise.all([
    supabase.from('test_cases').select('id, status, due_date, conclusion_date, module:modules(name), assigned_user:profiles!test_cases_assigned_user_id_fkey(full_name)'),
    supabase.from('modules').select('id, name'),
    supabase.from('tasks').select('id, status')
  ]);

  const totalCases = cases?.length ?? 0;
  const completedCases = cases?.filter((item) => item.status === 'FINALIZADA').length ?? 0;
  const inProgressCases = cases?.filter((item) => item.status === 'EM_ANDAMENTO').length ?? 0;
  const pendingCases = cases?.filter((item) => item.status === 'PENDENTE').length ?? 0;
  const overdueCases = cases?.filter((item) => item.due_date && !item.conclusion_date && new Date(item.due_date).getTime() < Date.now()).length ?? 0;
  const completionRate = totalCases ? (completedCases / totalCases) * 100 : 0;

  const moduleStats = (modules ?? []).map((module) => {
    const group = (cases ?? []).filter((item) => (item.module as { name?: string } | null)?.name === module.name);
    const completed = group.filter((item) => item.status === 'FINALIZADA').length;
    return {
      module: module.name,
      completionRate: group.length ? (completed / group.length) * 100 : 0
    };
  });

  const productivityMap = new Map<string, { total: number; completed: number }>();
  (cases ?? []).forEach((item) => {
    const user = ((item.assigned_user as { full_name?: string } | null)?.full_name ?? 'Sem responsável');
    const current = productivityMap.get(user) ?? { total: 0, completed: 0 };
    current.total += 1;
    if (item.status === 'FINALIZADA') current.completed += 1;
    productivityMap.set(user, current);
  });

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Header profile={profile} title="Painel de Gestão" subtitle="Indicadores operacionais em tempo real por módulo e responsável." />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="CTs Totais" value={totalCases} helper="Base total de casos cadastrados" />
          <StatCard label="Concluídos" value={completedCases} helper="Casos com execução finalizada" />
          <StatCard label="Em andamento" value={inProgressCases} helper="Casos em execução ativa" />
          <StatCard label="Pendentes" value={pendingCases} helper="Casos aguardando início" />
          <StatCard label="Conclusão geral" value={toPercent(completionRate)} helper={`${tasks?.length ?? 0} tarefas operacionais cadastradas`} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="card-shell">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Conclusão por módulo</h2>
                <p className="text-sm text-slate-500">Leitura rápida da saúde dos principais domínios funcionais.</p>
              </div>
            </div>
            <div className="space-y-4">
              {moduleStats.map((item) => (
                <ProgressBar key={item.module} label={item.module} value={item.completionRate} />
              ))}
            </div>
          </article>

          <article className="card-shell">
            <h2 className="text-lg font-semibold text-slate-900">Status crítico</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-sm text-rose-700">Em atraso</p>
                <p className="mt-1 text-2xl font-bold text-rose-700">{overdueCases}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Aguardando ação</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">{pendingCases}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Finalizados</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">{completedCases}</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 card-shell">
          <h2 className="text-lg font-semibold text-slate-900">Produtividade por usuário</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Responsável</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Concluídos</th>
                  <th className="px-3 py-2">Eficiência</th>
                </tr>
              </thead>
              <tbody>
                {[...productivityMap.entries()].map(([user, stats]) => {
                  const rate = stats.total ? (stats.completed / stats.total) * 100 : 0;
                  return (
                    <tr key={user} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-3 font-medium text-slate-700">{user}</td>
                      <td className="px-3 py-3">{stats.total}</td>
                      <td className="px-3 py-3">{stats.completed}</td>
                      <td className="px-3 py-3">{toPercent(rate)}</td>
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
