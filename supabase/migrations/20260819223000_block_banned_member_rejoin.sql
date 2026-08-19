create or replace function public.accept_server_invite()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.server_id <> old.server_id or new.sender_id <> old.sender_id or new.recipient_id <> old.recipient_id then raise exception 'Os dados do convite nao podem ser alterados'; end if;
  if old.status <> 'pending' then raise exception 'Este convite ja foi respondido'; end if;
  if new.status = 'accepted' then
    if exists (select 1 from public.server_bans where server_id = new.server_id and user_id = new.recipient_id) then raise exception 'Este usuario foi banido deste servidor'; end if;
    insert into public.server_members (server_id, user_id) values (new.server_id, new.recipient_id) on conflict (server_id, user_id) do nothing;
    new.responded_at := coalesce(new.responded_at, now());
  end if;
  return new;
end;
$$;

create or replace function public.redeem_server_invite_link(target_code text)
returns table (server_id uuid, server_name text) language plpgsql security definer set search_path = '' as $$
declare link_row public.server_invite_links%rowtype;
begin
  select * into link_row from public.server_invite_links where code = target_code and revoked_at is null and (expires_at is null or expires_at > now()) and (max_uses is null or uses_count < max_uses) for update;
  if not found then raise exception 'Convite invalido ou expirado'; end if;
  if exists (select 1 from public.server_bans where server_id = link_row.server_id and user_id = (select auth.uid())) then raise exception 'Este usuario foi banido deste servidor'; end if;
  insert into public.server_members (server_id, user_id, role) values (link_row.server_id, (select auth.uid()), 'member') on conflict do nothing;
  update public.server_invite_links set uses_count = uses_count + 1 where id = link_row.id;
  return query select servers.id, servers.name from public.servers where servers.id = link_row.server_id;
end;
$$;
