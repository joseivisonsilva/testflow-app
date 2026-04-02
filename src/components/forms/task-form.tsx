import { createTask } from '@/actions/tasks';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types';

interface TaskFormProps {
  users: Profile[];
}

/**
 * Formulário de criação de tarefa operacional.
 */
export function TaskForm({ users }: TaskFormProps) {
  return (
    <form action={createTask} className="card-shell space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Descrição curta</label>
        <input name="title" placeholder="Ajustar massa de dados do ambiente X" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Detalhamento</label>
        <textarea name="description" rows={4} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Responsável</label>
          <select name="responsible_user_id" defaultValue="">
            <option value="">Não definido</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.full_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Alocação</label>
          <input type="date" name="allocation_date" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Previsão</label>
          <input type="date" name="forecast_date" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Data Efetiva</label>
          <input type="date" name="effective_date" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select name="status" defaultValue="PENDENTE">
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="ATRASADA">Atrasada</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Salvar Tarefa</Button>
      </div>
    </form>
  );
}
