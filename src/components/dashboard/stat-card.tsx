interface StatCardProps {
  label: string;
  value: string | number;
  helper: string;
}

/**
 * Card simples para KPI de dashboard.
 */
export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <article className="card-shell">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </article>
  );
}
