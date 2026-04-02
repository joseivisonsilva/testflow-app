import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Landing page simples para direcionar ao login.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">TestFlow Pro</span>
        <h1 className="mt-6 text-4xl font-bold text-slate-900">Gestão completa de Casos de Teste e Tarefas operacionais</h1>
        <p className="mt-4 text-lg text-slate-600">
          Aplicação web com autenticação, RBAC, dashboard visual, upload de evidências, exportação CSV/SQL e estrutura pronta para comercialização.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/login"><Button>Entrar</Button></Link>
          <Link href="/dashboard"><Button variant="secondary">Ver Dashboard</Button></Link>
        </div>
      </section>
    </main>
  );
}
