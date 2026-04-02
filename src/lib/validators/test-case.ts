import { z } from 'zod';

/**
 * Schema de validação para criação e atualização de casos de teste.
 * Mantém regras mínimas de consistência antes de persistir no banco.
 */
export const testCaseSchema = z.object({
  module_id: z.string().uuid(),
  code: z.string().min(3),
  description: z.string().min(10),
  system_name: z.string().min(2),
  scope_main: z.string().optional().nullable(),
  out_of_scope: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'FINALIZADA']),
  priority: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']),
  assigned_user_id: z.string().uuid().optional().nullable(),
  start_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  conclusion_date: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  pre_condition: z.string().optional().nullable()
});
