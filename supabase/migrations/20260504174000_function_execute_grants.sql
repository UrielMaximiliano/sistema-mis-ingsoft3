revoke execute on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

revoke execute on function public.is_period_locked(date) from public;
grant execute on function public.is_period_locked(date) to authenticated;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.prevent_locked_period_changes() from public;

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public;
  end if;
end $$;
