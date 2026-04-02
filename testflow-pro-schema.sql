-- =============================================================
-- TestFlow Pro - Modelagem de Banco de Dados e Segurança (Supabase)
-- =============================================================

create extension if not exists "pgcrypto";

create type public.app_role as enum ('ADM', 'EDITOR', 'VIEWER');
create type public.case_status as enum ('PENDENTE', 'EM_ANDAMENTO', 'FINALIZADA');
create type public.case_priority as enum ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');
create type public.task_status as enum ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'ATRASADA');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.app_role not null default 'VIEWER',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.test_cases (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete restrict,
  code text not null unique,
  description text not null,
  system_name text not null,
  author_id uuid not null references public.profiles(id) on delete restrict,
  scope_main text,
  out_of_scope text,
  notes text,
  status public.case_status not null default 'PENDENTE',
  priority public.case_priority not null default 'MEDIA',
  assigned_user_id uuid references public.profiles(id) on delete set null,
  start_date date,
  due_date date,
  conclusion_date date,
  condition text,
  pre_condition text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_case_steps (
  id uuid primary key default gen_random_uuid(),
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  step_order integer not null,
  action text not null,
  input_data text,
  expected_result text not null,
  created_at timestamptz not null default now(),
  unique(test_case_id, step_order)
);

create table if not exists public.test_case_evidences (
  id uuid primary key default gen_random_uuid(),
  test_case_id uuid not null references public.test_cases(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  responsible_user_id uuid references public.profiles(id) on delete set null,
  allocation_date date,
  forecast_date date,
  effective_date date,
  status public.task_status not null default 'PENDENTE',
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'ADM'
  );
$$;

create or replace function public.can_edit()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('ADM', 'EDITOR')
  );
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger trg_test_cases_updated_at
before update on public.test_cases
for each row execute procedure public.handle_updated_at();

create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.test_cases enable row level security;
alter table public.test_case_steps enable row level security;
alter table public.test_case_evidences enable row level security;
alter table public.tasks enable row level security;

create policy "profiles_select_authenticated" on public.profiles
for select using (auth.role() = 'authenticated');

create policy "profiles_update_admin_only" on public.profiles
for update using (public.is_admin()) with check (public.is_admin());

create policy "modules_select_authenticated" on public.modules
for select using (auth.role() = 'authenticated');

create policy "modules_manage_editors" on public.modules
for all using (public.can_edit()) with check (public.can_edit());

create policy "test_cases_select_authenticated" on public.test_cases
for select using (auth.role() = 'authenticated');

create policy "test_cases_insert_editors" on public.test_cases
for insert with check (public.can_edit());

create policy "test_cases_update_editors" on public.test_cases
for update using (public.can_edit()) with check (public.can_edit());

create policy "test_cases_delete_admin" on public.test_cases
for delete using (public.is_admin());

create policy "test_case_steps_select_authenticated" on public.test_case_steps
for select using (auth.role() = 'authenticated');

create policy "test_case_steps_manage_editors" on public.test_case_steps
for all using (public.can_edit()) with check (public.can_edit());

create policy "evidences_select_authenticated" on public.test_case_evidences
for select using (auth.role() = 'authenticated');

create policy "evidences_insert_editors" on public.test_case_evidences
for insert with check (public.can_edit());

create policy "evidences_delete_admin" on public.test_case_evidences
for delete using (public.is_admin());

create policy "tasks_select_authenticated" on public.tasks
for select using (auth.role() = 'authenticated');

create policy "tasks_insert_editors" on public.tasks
for insert with check (public.can_edit());

create policy "tasks_update_editors" on public.tasks
for update using (public.can_edit()) with check (public.can_edit());

create policy "tasks_delete_admin" on public.tasks
for delete using (public.is_admin());

insert into public.modules (name, code, description)
values
  ('Inbound', 'INB', 'Fluxos de entrada e recebimento'),
  ('Outbound', 'OUT', 'Separação, conferência e expedição'),
  ('Movimentação', 'MOV', 'Transferências internas e reendereçamento'),
  ('Inventário', 'INV', 'Contagens e ajustes de estoque')
on conflict (code) do nothing;

insert into storage.buckets (id, name, public)
values ('evidences', 'evidences', false)
on conflict (id) do nothing;

create policy "storage_select_authenticated" on storage.objects
for select using (bucket_id = 'evidences' and auth.role() = 'authenticated');

create policy "storage_insert_editors" on storage.objects
for insert with check (bucket_id = 'evidences' and public.can_edit());

create policy "storage_delete_admin" on storage.objects
for delete using (bucket_id = 'evidences' and public.is_admin());
