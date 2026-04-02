import { AppRole } from '@/types';

/**
 * Mapa central de permissões por rota.
 * Facilita evolução futura para granularidade por recurso ou operação.
 */
export const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
  '/dashboard': ['ADM', 'EDITOR', 'VIEWER'],
  '/test-cases': ['ADM', 'EDITOR', 'VIEWER'],
  '/test-cases/new': ['ADM', 'EDITOR'],
  '/tasks': ['ADM', 'EDITOR', 'VIEWER'],
  '/exports': ['ADM', 'EDITOR']
};

/**
 * Define se um perfil pode editar ou inserir registros.
 */
export function canEdit(role: AppRole): boolean {
  return role === 'ADM' || role === 'EDITOR';
}

/**
 * Define se um perfil pode remover registros.
 * A exclusão é restrita exclusivamente ao administrador.
 */
export function canDelete(role: AppRole): boolean {
  return role === 'ADM';
}

/**
 * Verifica se uma rota está autorizada para o papel informado.
 * Caso a rota não esteja mapeada explicitamente, assume acesso permitido para páginas públicas.
 */
export function canAccessRoute(pathname: string, role: AppRole): boolean {
  const matched = Object.entries(ROUTE_PERMISSIONS).find(([route]) => pathname.startsWith(route));
  if (!matched) return true;
  return matched[1].includes(role);
}
