import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TestFlow Pro',
  description: 'Plataforma web para gestão de execução de casos de teste e backlog operacional.'
};

/**
 * Layout raiz da aplicação.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
