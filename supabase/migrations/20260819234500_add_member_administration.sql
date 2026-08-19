create or replace function public.remove_server_member(target_server_id uuid, target_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_moderate_member(target_server_id, target_user_id) then
    raise exception 'Sem permissao para remover este membro';
  end if;
  delete from public.server_members where server_id = target_server_id and user_id = target_user_id;
end;
$$;

create or replace function public.transfer_server_ownership(target_server_id uuid, target_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := (select auth.uid());
begin
  if not exists (
    select 1 from public.servers where id = target_server_id and owner_id = actor
  ) then
    raise exception 'Somente o proprietario pode transferir o servidor';
  end if;

  if not exists (
    select 1 from public.server_members
    where server_id = target_server_id and user_id = target_user_id
  ) then
    raise exception 'A pessoa escolhida nao e membro deste servidor';
  end if;

  if target_user_id = actor then
    raise exception 'Escolha outra pessoa para receber o servidor';
  end if;

  update public.servers set owner_id = target_user_id, updated_at = now() where id = target_server_id;
  update public.server_members set role = 'owner' where server_id = target_server_id and user_id = target_user_id;
  update public.server_members set role = 'moderator' where server_id = target_server_id and user_id = actor;
end;
$$;

revoke all on function public.remove_server_member(uuid, uuid) from public;
revoke all on function public.transfer_server_ownership(uuid, uuid) from public;
grant execute on function public.remove_server_member(uuid, uuid) to authenticated;
grant execute on function public.transfer_server_ownership(uuid, uuid) to authenticated;
