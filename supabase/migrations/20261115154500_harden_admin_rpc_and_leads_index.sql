-- The helper is only used inside RLS policies; it must not be callable through PostgREST.
revoke execute on function public.is_auto_majorel_admin() from anon, authenticated;

-- Cover the foreign key used when filtering leads by vehicle.
create index if not exists leads_vehicle_slug_idx on public.leads (vehicle_slug);
