import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { TestCaseForm } from '@/components/forms/test-case-form';
import { requireAuthorizedRoute } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Tela de criação de novos casos de teste.
 */
export default async function NewTestCasePage() {
  const { profile } = await requireAuthorizedRoute('/test-cases/new');
  const supabase = await createServerSupabaseClient();

  const [{ data: modules }, { data: users }] = await Promise.all([
    supabase.from('modules').select('*').order('name'),
    supabase.from('profiles').select('*').order('full_name')
  ]);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Header profile={profile} title="Novo Caso de Teste" subtitle="Cadastro completo com metadados de execução, escopo e responsabilidade." />
        <TestCaseForm modules={modules ?? []} users={users ?? []} />
      </main>
    </div>
  );
}
