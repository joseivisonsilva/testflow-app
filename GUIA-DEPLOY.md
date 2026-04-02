# Guia prático de deploy — TestFlow Pro

## 1) Criar conta gratuita no Supabase
1. Acesse https://supabase.com/ e clique em Start your project.
2. Crie um novo projeto.
3. Guarde a `Project URL`, a `anon key` e a `service_role key`.
4. Abra o SQL Editor.
5. Copie o conteúdo do arquivo `supabase/schema.sql` e execute.
6. Em Authentication > Users, crie o primeiro usuário administrador.
7. Na tabela `profiles`, altere o papel desse usuário para `ADM`.

## 2) Criar conta gratuita na Vercel
1. Acesse https://vercel.com/ e conecte sua conta GitHub.
2. Publique este projeto em um repositório GitHub.
3. Na Vercel, clique em Add New Project.
4. Importe o repositório.
5. Configure as variáveis de ambiente com base no arquivo `.env.example`.
6. Clique em Deploy.

## 3) Rodar localmente (opcional)
1. Instale Node.js LTS.
2. Abra o terminal na pasta do projeto.
3. Execute `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Preencha as chaves do Supabase.
6. Execute `npm run dev`.

## 4) Checklist rápido pós-deploy
- Login funcionando.
- Dashboard carregando.
- CRUD de caso de teste funcionando.
- Upload no bucket `evidences` funcionando.
- Exportação CSV funcionando.
- Download do SQL funcionando.
- Usuário Viewer sem botão de excluir.
- Usuário Editor sem exclusão.
- Usuário ADM com acesso total.
