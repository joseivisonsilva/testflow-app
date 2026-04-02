import { signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';

/**
 * Tela de login com formulário mínimo para Supabase Auth.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Acesso Seguro</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Entrar na plataforma</h1>
        <p className="mt-2 text-sm text-slate-500">Use suas credenciais cadastradas no Supabase Auth.</p>

        <form action={signIn} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input type="email" name="email" placeholder="voce@empresa.com" required className="w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input type="password" name="password" placeholder="********" required className="w-full" />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </section>
    </main>
  );
}
