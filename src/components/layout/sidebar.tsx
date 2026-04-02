import Link from 'next/link';
import { LayoutDashboard, ListTodo, ShieldCheck, TestTube2, Download } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/test-cases', label: 'Casos de Teste', icon: TestTube2 },
  { href: '/tasks', label: 'Backlog Operacional', icon: ListTodo },
  { href: '/exports', label: 'Exportações', icon: Download }
];

/**
 * Sidebar principal de navegação.
 */
export function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-600 p-3 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">TestFlow Pro</p>
          <p className="text-sm text-slate-500">Execução de CTs e Tarefas</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
