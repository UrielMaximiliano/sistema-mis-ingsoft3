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

drop policy if exists "Profiles are readable by owner and admins" on public.profiles;
create policy "Profiles are readable by owner and admins"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.current_user_role() in ('admin', 'treasury'));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users read categories" on public.categories;
create policy "Authenticated users read categories"
on public.categories for select
to authenticated
using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Authenticated users read channels" on public.channels;
create policy "Authenticated users read channels"
on public.channels for select
to authenticated
using (true);

drop policy if exists "Admins manage channels" on public.channels;
create policy "Admins manage channels"
on public.channels for all
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "Admins and treasury read movements" on public.movements;
create policy "Admins and treasury read movements"
on public.movements for select
to authenticated
using (public.current_user_role() in ('admin', 'treasury'));

drop policy if exists "Operators add blind movements" on public.movements;
create policy "Operators add blind movements"
on public.movements for insert
to authenticated
with check (
  public.current_user_role() in ('admin', 'operator')
  and is_projected = false
  and not public.is_period_locked(date)
);

drop policy if exists "Treasury and admins manage unlocked movements" on public.movements;
create policy "Treasury and admins manage unlocked movements"
on public.movements for all
to authenticated
using (
  public.current_user_role() in ('admin', 'treasury')
  and not public.is_period_locked(date)
)
with check (
  public.current_user_role() in ('admin', 'treasury')
  and not public.is_period_locked(date)
);

drop policy if exists "Admins and treasury read locks" on public.period_locks;
create policy "Admins and treasury read locks"
on public.period_locks for select
to authenticated
using (public.current_user_role() in ('admin', 'treasury'));

drop policy if exists "Treasury locks periods" on public.period_locks;
create policy "Treasury locks periods"
on public.period_locks for insert
to authenticated
with check (public.current_user_role() in ('admin', 'treasury'));

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
