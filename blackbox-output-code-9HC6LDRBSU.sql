-- Adicionar foreign key na tabela de casos de teste
ALTER TABLE test_cases 
ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_test_cases_module_id ON test_cases(module_id);

-- View para contar casos de teste por módulo
CREATE OR REPLACE VIEW module_stats AS
SELECT 
  m.id,
  m.name,
  m.code,
  m.description,
  m.is_active,
  COUNT(tc.id) as test_cases_count,
  COUNT(CASE WHEN tc.status = 'PASSED' THEN 1 END) as passed_count,
  COUNT(CASE WHEN tc.status = 'FAILED' THEN 1 END) as failed_count,
  COUNT(CASE WHEN tc.status = 'PENDING' THEN 1 END) as pending_count
FROM modules m
LEFT JOIN test_cases tc ON m.id = tc.module_id
GROUP BY m.id, m.name, m.code, m.description, m.is_active;