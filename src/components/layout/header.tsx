import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types';

interface HeaderProps {
  profile: Profile;
  title: string;
  subtitle: string;
}

/**
 * Cabeçalho contextual das áreas autenticadas.
 */
export function Header({ profile, title, subtitle }: HeaderProps) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right shadow-soft">
          <p className="text-sm font-semibold text-slate-900">{profile.full_name}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">{profile.role}</p>
        </div>
        <form action={signOut}>
          <Button variant="secondary" type="submit">Sair</Button>
        </form>
      </div>
    </header>
  );
}
