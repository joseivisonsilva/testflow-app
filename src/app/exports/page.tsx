import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { requireAuthorizedRoute } from '@/lib/auth/session';

/**
 * Área central de exportação de dados do sistema.
 */
export default async function ExportsPage() {
  const { profile } = await requireAuthorizedRoute('/exports');

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Header profile={profile} title="Exportações" subtitle="Baixe a base operacional em CSV e o script SQL da aplicação." />

        <section className="grid gap-6 md:grid-cols-2">
          <article className="card-shell">
            <h2 className="text-xl font-semibold text-slate-900">Exportar CSV</h2>
            <p className="mt-2 text-sm text-slate-500">Gera um arquivo CSV com todos os casos de teste usando a API do Supabase.</p>
            <div className="mt-5">
              <Link href="/api/export/csv"><Button>Baixar CSV</Button></Link>
            </div>
          </article>

          <article className="card-shell">
            <h2 className="text-xl font-semibold text-slate-900">Exportar SQL</h2>
            <p className="mt-2 text-sm text-slate-500">Baixa o script SQL completo de estrutura, políticas e dados iniciais.</p>
            <div className="mt-5">
              <Link href="/api/export/sql"><Button variant="secondary">Baixar SQL</Button></Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
