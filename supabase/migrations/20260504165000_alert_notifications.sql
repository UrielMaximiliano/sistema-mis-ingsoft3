create table if not exists public.alert_notifications (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('risk', 'urgent')),
  subject text not null,
  body text not null,
  recipient text not null,
  delivery_status text not null check (delivery_status in ('sent', 'simulated', 'failed')),
  provider text not null default 'supabase-edge',
  provider_response jsonb,
  created_at timestamptz not null default now()
);

alter table public.alert_notifications enable row level security;

drop policy if exists "Admins and treasury read alert notifications" on public.alert_notifications;
create policy "Admins and treasury read alert notifications"
on public.alert_notifications for select
to authenticated
using (public.current_user_role() in ('admin', 'treasury'));

drop policy if exists "Authenticated users create alert notifications" on public.alert_notifications;
create policy "Authenticated users create alert notifications"
on public.alert_notifications for insert
to authenticated
with check (public.current_user_role() in ('admin', 'treasury'));
