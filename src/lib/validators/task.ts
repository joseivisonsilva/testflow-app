import { z } from 'zod';

/**
 * Schema de validação do backlog operacional.
 */
export const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  responsible_user_id: z.string().uuid().optional().nullable(),
  allocation_date: z.string().optional().nullable(),
  forecast_date: z.string().optional().nullable(),
  effective_date: z.string().optional().nullable(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'ATRASADA'])
});
