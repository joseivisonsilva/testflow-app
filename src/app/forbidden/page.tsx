import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Página para acessos sem permissão.
 */
export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Acesso não autorizado</h1>
        <p className="mt-3 text-slate-600">Seu perfil não possui permissão para acessar esta funcionalidade.</p>
        <div className="mt-6">
          <Link href="/dashboard"><Button>Voltar ao Dashboard</Button></Link>
        </div>
      </section>
    </main>
  );
}
