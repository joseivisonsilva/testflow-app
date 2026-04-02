import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canAccessRoute } from '@/lib/auth/roles';
import type { AppRole, Profile } from '@/types';

/**
 * Lê a sessão autenticada e carrega o perfil de autorização.
 * Redireciona para login quando a sessão não existe.
 */
export async function requireSession(): Promise<{ userId: string; profile: Profile }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  return {
    userId: user.id,
    profile: profile as Profile
  };
}

/**
 * Garante sessão e valida se o perfil atual pode acessar a rota alvo.
 * Redireciona para a tela de proibido quando a autorização falha.
 */
export async function requireAuthorizedRoute(pathname: string): Promise<{ userId: string; role: AppRole; profile: Profile }> {
  const { userId, profile } = await requireSession();

  if (!canAccessRoute(pathname, profile.role)) {
    redirect('/forbidden');
  }

  return { userId, role: profile.role, profile };
}
