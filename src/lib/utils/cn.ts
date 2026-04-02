import { clsx, type ClassValue } from 'clsx';

/**
 * Concatena classes CSS de forma segura e legível.
 * Esta função simplifica composição condicional de estilos no Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
