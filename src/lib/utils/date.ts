/**
 * Formata uma data ISO para pt-BR.
 * Retorna hífen quando o valor não existe para evitar quebra visual na UI.
 */
export function formatDate(value?: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: undefined
  }).format(new Date(value));
}

/**
 * Calcula se uma data prevista está em atraso.
 * Só considera atraso quando a previsão existe e a data efetiva ainda não foi informada.
 */
export function isOverdue(forecastDate?: string | null, effectiveDate?: string | null): boolean {
  if (!forecastDate || effectiveDate) return false;
  return new Date(forecastDate).getTime() < Date.now();
}

/**
 * Converte porcentagem em string amigável para a UI.
 */
export function toPercent(value: number): string {
  return `${Math.round(value)}%`;
}
