import { createTestCase } from '@/actions/test-cases';
import { Button } from '@/components/ui/button';
import type { ModuleItem, Profile } from '@/types';

interface TestCaseFormProps {
  modules: ModuleItem[];
  users: Profile[];
}

/**
 * Formulário principal de cadastro de caso de teste.
 */
export function TestCaseForm({ modules, users }: TestCaseFormProps) {
  return (
    <form action={createTestCase} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Módulo</label>
          <select name="module_id" required>
            <option value="">Selecione</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>{module.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">ID / Código</label>
          <input name="code" placeholder="CT-001" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Sistema</label>
          <input name="system_name" placeholder="WMS / TMS / ERP" required />
        </div>
        <div className="md:col-span-2 xl:col-span-3">
          <label className="mb-1 block text-sm font-medium">Descrição</label>
          <textarea name="description" placeholder="Descreva o caso de teste" rows={3} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select name="status" defaultValue="PENDENTE">
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Prioridade</label>
          <select name="priority" defaultValue="MEDIA">
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Responsável</label>
          <select name="assigned_user_id" defaultValue="">
            <option value="">Não definido</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.full_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Data Início</label>
          <input type="date" name="start_date" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Data Prevista</label>
          <input type="date" name="due_date" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Data Conclusão</label>
          <input type="date" name="conclusion_date" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Escopo Principal</label>
          <textarea name="scope_main" rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Fora de Escopo</label>
          <textarea name="out_of_scope" rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Condição</label>
          <textarea name="condition" rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pré-condição</label>
          <textarea name="pre_condition" rows={3} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Observações</label>
          <textarea name="notes" rows={4} />
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 p-4">
        <p className="text-sm font-semibold text-slate-800">Grid Step-by-Step</p>
        <p className="mt-1 text-sm text-slate-500">
          Para manter o projeto inicial simples e estável, os passos podem ser cadastrados em uma segunda etapa via tabela
          dedicada <code>test_case_steps</code>. O schema SQL já está pronto para isso.
        </p>
      </section>

      <div className="flex justify-end">
        <Button type="submit">Salvar Caso de Teste</Button>
      </div>
    </form>
  );
}
