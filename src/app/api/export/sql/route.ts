import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Endpoint para download do script SQL de estrutura da aplicação.
 */
export async function GET() {
  const filePath = path.join(process.cwd(), 'supabase', 'schema.sql');
  const sql = await readFile(filePath, 'utf-8');

  return new Response(sql, {
    headers: {
      'Content-Type': 'application/sql; charset=utf-8',
      'Content-Disposition': 'attachment; filename="testflow-pro-schema.sql"'
    }
  });
}
