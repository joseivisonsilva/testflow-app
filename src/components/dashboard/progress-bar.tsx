interface ProgressBarProps {
  label: string;
  value: number;
}

/**
 * Barra de progresso textual para uso em gráficos leves sem bibliotecas extras.
 */
export function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{Math.round(value)}%</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-brand-600" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
