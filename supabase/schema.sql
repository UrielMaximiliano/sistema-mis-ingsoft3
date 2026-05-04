create extension if not exists pgcrypto;

do $$
begin
  create type public.user_role as enum ('admin', 'treasury', 'operator');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.movement_type as enum ('income', 'expense');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'operator'
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  type public.movement_type not null
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name in ('Mayorista', 'Minorista'))
);

create table if not exists public.period_locks (
  id uuid primary key default gen_random_uuid(),
  week_start date not null unique,
  reason text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  amount numeric(10, 2) not null check (amount > 0),
  type public.movement_type not null,
  category_id uuid not null references public.categories(id),
  channel_id uuid not null references public.channels(id),
  is_projected boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists movements_date_idx on public.movements(date);
create index if not exists movements_category_idx on public.movements(category_id);
create index if not exists movements_channel_idx on public.movements(channel_id);
create index if not exists period_locks_created_by_idx on public.period_locks(created_by);

do $$
begin
  alter publication supabase_realtime add table public.movements;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.period_locks;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.channels enable row level security;
alter table public.movements enable row level security;
alter table public.period_locks enable row level security;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_period_locked(movement_date date)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.period_locks
    where week_start = date_trunc('week', movement_date)::date
  )
$$;

create or replace function public.prevent_locked_period_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_date date;
begin
  target_date := case when tg_op = 'DELETE' then old.date else new.date end;

  if public.is_period_locked(target_date) then
    raise exception 'The selected period is locked and cannot be edited.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists movements_prevent_locked_period_update on public.movements;
create trigger movements_prevent_locked_period_update
before update or delete on public.movements
for each row execute function public.prevent_locked_period_changes();

revoke execute on function public.current_user_role() from public;
revoke execute on function public.current_user_role() from anon;
grant execute on function public.current_user_role() to authenticated;
revoke execute on function public.is_period_locked(date) from public;
revoke execute on function public.is_period_locked(date) from anon;
grant execute on function public.is_period_locked(date) to authenticated;
revoke execute on function public.prevent_locked_period_changes() from public;

drop policy if exists "Profiles are readable by owner and admins" on public.profiles;
create policy "Profiles are readable by owner and admins"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or (select public.current_user_role()) in ('admin', 'treasury'));

drop policy if exists "Admins manage profiles" on public.profiles;
drop policy if exists "Admins create profiles" on public.profiles;
create policy "Admins create profiles"
on public.profiles for insert
to authenticated
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles"
on public.profiles for update
to authenticated
using ((select public.current_user_role()) = 'admin')
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins delete profiles" on public.profiles;
create policy "Admins delete profiles"
on public.profiles for delete
to authenticated
using ((select public.current_user_role()) = 'admin');

drop policy if exists "Authenticated users read categories" on public.categories;
create policy "Authenticated users read categories"
on public.categories for select
to authenticated
using (true);

drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Admins create categories" on public.categories;
create policy "Admins create categories"
on public.categories for insert
to authenticated
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins update categories" on public.categories;
create policy "Admins update categories"
on public.categories for update
to authenticated
using ((select public.current_user_role()) = 'admin')
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins delete categories" on public.categories;
create policy "Admins delete categories"
on public.categories for delete
to authenticated
using ((select public.current_user_role()) = 'admin');

drop policy if exists "Authenticated users read channels" on public.channels;
create policy "Authenticated users read channels"
on public.channels for select
to authenticated
using (true);

drop policy if exists "Admins manage channels" on public.channels;
drop policy if exists "Admins create channels" on public.channels;
create policy "Admins create channels"
on public.channels for insert
to authenticated
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins update channels" on public.channels;
create policy "Admins update channels"
on public.channels for update
to authenticated
using ((select public.current_user_role()) = 'admin')
with check ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins delete channels" on public.channels;
create policy "Admins delete channels"
on public.channels for delete
to authenticated
using ((select public.current_user_role()) = 'admin');

drop policy if exists "Admins and treasury read movements" on public.movements;
create policy "Admins and treasury read movements"
on public.movements for select
to authenticated
using ((select public.current_user_role()) in ('admin', 'treasury'));

drop policy if exists "Operators add blind movements" on public.movements;
drop policy if exists "Treasury and admins manage unlocked movements" on public.movements;
drop policy if exists "Authenticated users add unlocked movements" on public.movements;
create policy "Authenticated users add unlocked movements"
on public.movements for insert
to authenticated
with check (
  (
    (select public.current_user_role()) in ('admin', 'treasury')
    or ((select public.current_user_role()) = 'operator' and is_projected = false)
  )
  and not public.is_period_locked(date)
);

drop policy if exists "Treasury and admins update unlocked movements" on public.movements;
create policy "Treasury and admins update unlocked movements"
on public.movements for update
to authenticated
using (
  (select public.current_user_role()) in ('admin', 'treasury')
  and not public.is_period_locked(date)
)
with check (
  (select public.current_user_role()) in ('admin', 'treasury')
  and not public.is_period_locked(date)
);

drop policy if exists "Treasury and admins delete unlocked movements" on public.movements;
create policy "Treasury and admins delete unlocked movements"
on public.movements for delete
to authenticated
using (
  (select public.current_user_role()) in ('admin', 'treasury')
  and not public.is_period_locked(date)
);

drop policy if exists "Admins and treasury read locks" on public.period_locks;
create policy "Admins and treasury read locks"
on public.period_locks for select
to authenticated
using ((select public.current_user_role()) in ('admin', 'treasury'));

drop policy if exists "Treasury locks periods" on public.period_locks;
create policy "Treasury locks periods"
on public.period_locks for insert
to authenticated
with check ((select public.current_user_role()) in ('admin', 'treasury'));

insert into public.channels (name)
values ('Mayorista'), ('Minorista')
on conflict (name) do nothing;

insert into public.categories (name, description, type)
values
  ('Ventas', 'Ingresos por ventas diarias', 'income'),
  ('Cobranzas', 'Cobros pendientes de clientes', 'income'),
  ('Sueldos', 'Nomina semanal y mensual', 'expense'),
  ('Servicios', 'Luz, gas, internet y mantenimiento', 'expense'),
  ('Proveedores Criticos', 'Pagos que sostienen operacion comercial', 'expense'),
  ('Logistica', 'Fletes y distribucion', 'expense')
on conflict (name) do update
set description = excluded.description,
    type = excluded.type;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  normalized_role public.user_role;
begin
  requested_role := new.raw_user_meta_data->>'role';

  normalized_role := case
    when requested_role in ('admin', 'treasury', 'operator') then requested_role::public.user_role
    else 'operator'::public.user_role
  end;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    normalized_role
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.prevent_locked_period_changes() from public;

insert into public.profiles (id, full_name, role)
select
  id,
  coalesce(raw_user_meta_data->>'full_name', email),
  case
    when raw_user_meta_data->>'role' in ('admin', 'treasury', 'operator')
      then (raw_user_meta_data->>'role')::public.user_role
    else 'operator'::public.user_role
  end
from auth.users
on conflict (id) do nothing;

with category_ids as (
  select name, id from public.categories
),
channel_ids as (
  select name, id from public.channels
)
insert into public.movements (id, date, amount, type, category_id, channel_id, is_projected)
values
  ('10000000-0000-4000-8000-000000000001', '2026-05-01', 1820000, 'income', (select id from category_ids where name = 'Ventas'), (select id from channel_ids where name = 'Mayorista'), false),
  ('10000000-0000-4000-8000-000000000002', '2026-05-02', 1260000, 'income', (select id from category_ids where name = 'Ventas'), (select id from channel_ids where name = 'Minorista'), false),
  ('10000000-0000-4000-8000-000000000003', '2026-05-02', 840000, 'expense', (select id from category_ids where name = 'Proveedores Criticos'), (select id from channel_ids where name = 'Mayorista'), false),
  ('10000000-0000-4000-8000-000000000004', '2026-05-03', 530000, 'expense', (select id from category_ids where name = 'Servicios'), (select id from channel_ids where name = 'Minorista'), false),
  ('10000000-0000-4000-8000-000000000005', '2026-05-06', 2050000, 'income', (select id from category_ids where name = 'Cobranzas'), (select id from channel_ids where name = 'Mayorista'), true),
  ('10000000-0000-4000-8000-000000000006', '2026-05-07', 980000, 'income', (select id from category_ids where name = 'Ventas'), (select id from channel_ids where name = 'Minorista'), true),
  ('10000000-0000-4000-8000-000000000007', '2026-05-08', 1560000, 'expense', (select id from category_ids where name = 'Sueldos'), (select id from channel_ids where name = 'Mayorista'), true),
  ('10000000-0000-4000-8000-000000000008', '2026-05-08', 610000, 'expense', (select id from category_ids where name = 'Servicios'), (select id from channel_ids where name = 'Minorista'), true),
  ('10000000-0000-4000-8000-000000000009', '2026-05-09', 1725000, 'expense', (select id from category_ids where name = 'Proveedores Criticos'), (select id from channel_ids where name = 'Mayorista'), true),
  ('10000000-0000-4000-8000-000000000010', '2026-05-10', 420000, 'expense', (select id from category_ids where name = 'Logistica'), (select id from channel_ids where name = 'Mayorista'), true)
on conflict (id) do update
set date = excluded.date,
    amount = excluded.amount,
    type = excluded.type,
    category_id = excluded.category_id,
    channel_id = excluded.channel_id,
    is_projected = excluded.is_projected;

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
using ((select public.current_user_role()) in ('admin', 'treasury'));

drop policy if exists "Authenticated users create alert notifications" on public.alert_notifications;
create policy "Authenticated users create alert notifications"
on public.alert_notifications for insert
to authenticated
with check ((select public.current_user_role()) in ('admin', 'treasury'));

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
  end if;
end $$;
