-- Coach Planner v7.01 service role grants.
-- Run this if the Edge Function returns: permission denied for table workspaces.

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.workspaces to service_role;
grant select, insert, update, delete on table public.app_snapshots to service_role;
