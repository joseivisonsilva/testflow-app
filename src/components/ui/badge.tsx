import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  label: string;
  tone?: 'green' | 'yellow' | 'red' | 'blue' | 'slate';
}

/**
 * Badge semafórico para status e prioridade.
 */
export function Badge({ label, tone = 'slate' }: BadgeProps) {
  const tones = {
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-rose-100 text-rose-700',
    blue: 'bg-blue-100 text-blue-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', tones[tone])}>{label}</span>;
}
