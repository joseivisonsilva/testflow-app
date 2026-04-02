-- Exemplo: Tornar um usuário ADM
UPDATE profiles SET role = 'ADM' WHERE email = 'admin@empresa.com';

-- EDITOR
UPDATE profiles SET role = 'EDITOR' WHERE email = 'editor@empresa.com';

-- VIEWER (padrão)
UPDATE profiles SET role = 'VIEWER' WHERE email = 'viewer@empresa.com';