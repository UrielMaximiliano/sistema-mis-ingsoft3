create index if not exists period_locks_created_by_idx on public.period_locks(created_by);

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

revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.prevent_locked_period_changes() from anon, authenticated, public;

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
