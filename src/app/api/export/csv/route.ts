import { exportCasesCsv } from '@/actions/exports';

/**
 * Endpoint para download do CSV de casos de teste.
 */
export async function GET() {
  const csv = await exportCasesCsv();

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="test-cases.csv"'
    }
  });
}
