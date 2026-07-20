-- Coach Planner v7.01 Cloud Snapshot MVP
-- Adds a workspace-level snapshot model without changing the earlier normalized MVP tables.
-- This migration is safe to run more than once.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  workspace_slug text not null unique,
  display_name text not null default 'Coach Planner',
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  app_version text,
  schema_version integer,
  updated_by_device text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_snapshots_workspace_unique unique (workspace_id)
);

alter table public.workspaces enable row level security;
alter table public.app_snapshots enable row level security;

-- No public RLS policies are added for the MVP. The app reads/writes through the
-- Supabase Edge Function using the server-side service role key, and the function
-- scopes every request by validated workspace session.

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists set_app_snapshots_updated_at on public.app_snapshots;
create trigger set_app_snapshots_updated_at
before update on public.app_snapshots
for each row execute function public.set_updated_at();

-- Required for Edge Function access when the function uses the Supabase service_role.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.workspaces to service_role;
grant select, insert, update, delete on table public.app_snapshots to service_role;
