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
