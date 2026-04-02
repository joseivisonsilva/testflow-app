/**
 * Centraliza os tipos compartilhados entre páginas, componentes e ações.
 * Manter estes contratos em um único local reduz acoplamento e facilita manutenção.
 */
export type AppRole = 'ADM' | 'EDITOR' | 'VIEWER';
export type CaseStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'FINALIZADA';
export type CasePriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'ATRASADA';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  avatar_url?: string | null;
}

export interface ModuleItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
}

export interface TestCaseStep {
  id: string;
  test_case_id: string;
  step_order: number;
  action: string;
  input_data: string | null;
  expected_result: string;
}

export interface EvidenceFile {
  id: string;
  test_case_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface TestCase {
  id: string;
  module_id: string;
  code: string;
  description: string;
  system_name: string;
  author_id: string;
  scope_main: string | null;
  out_of_scope: string | null;
  notes: string | null;
  status: CaseStatus;
  priority: CasePriority;
  assigned_user_id: string | null;
  start_date: string | null;
  due_date: string | null;
  conclusion_date: string | null;
  condition: string | null;
  pre_condition: string | null;
  created_at: string;
  updated_at: string;
  module?: ModuleItem;
  author?: Profile;
  assigned_user?: Profile | null;
  steps?: TestCaseStep[];
  evidences?: EvidenceFile[];
}

export interface TaskCard {
  id: string;
  title: string;
  description: string | null;
  responsible_user_id: string | null;
  allocation_date: string | null;
  forecast_date: string | null;
  effective_date: string | null;
  status: TaskStatus;
  created_by: string;
  created_at: string;
  responsible_user?: Profile | null;
}

export interface DashboardStats {
  totalCases: number;
  completedCases: number;
  inProgressCases: number;
  pendingCases: number;
  overdueCases: number;
  completionRate: number;
  byModule: Array<{ module: string; total: number; completed: number; completionRate: number }>;
  byUser: Array<{ user: string; total: number; completed: number }>;
}
