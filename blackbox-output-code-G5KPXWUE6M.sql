-- Habilitar RLS na tabela modules
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Função para pegar role do profile atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role AS $$
DECLARE
  user_role public.app_role;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid()::uuid;
  
  RETURN COALESCE(user_role, 'VIEWER'::public.app_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas RLS atualizadas
CREATE POLICY "Users can read modules" ON modules
FOR SELECT USING (true);

CREATE POLICY "ADM and EDITOR can manage modules" ON modules
FOR ALL USING (
  get_current_user_role() IN ('ADM'::public.app_role, 'EDITOR'::public.app_role)
);

CREATE POLICY "Only ADM can delete modules" ON modules
FOR DELETE USING (
  get_current_user_role() = 'ADM'::public.app_role
);