alter table public.server_members drop constraint server_members_role_check;
alter table public.server_members add constraint server_members_role_check check (role in ('owner', 'moderator', 'member'));

create table public.channel_permissions (
  channel_id uuid not null references public.channels (id) on delete cascade,
  role text not null check (role in ('moderator', 'member')),
  can_read boolean not null default true,
  can_write boolean not null default true,
  can_speak boolean not null default true,
  primary key (channel_id, role)
);

create table public.channel_read_states (
  channel_id uuid not null references public.channels (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (channel_id, user_id)
);

create table public.server_invite_links (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers (id) on delete cascade,
  code text not null unique default replace(gen_random_uuid()::text, '-', ''),
  created_by uuid not null references public.profiles (id) on delete restrict,
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  uses_count integer not null default 0 check (uses_count >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.server_role(target_server_id uuid)
returns text
language sql stable security definer set search_path = ''
as $$
  select role from public.server_members
  where server_id = target_server_id and user_id = (select auth.uid());
$$;

create or replace function public.can_manage_channels(target_server_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(public.server_role(target_server_id) in ('owner', 'moderator'), false);
$$;

create or replace function public.can_use_channel(target_channel_id uuid, action text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  with channel_role as (
    select channels.server_id, public.server_role(channels.server_id) as role
    from public.channels where channels.id = target_channel_id
  )
  select case
    when role = 'owner' then true
    when role is null then false
    when not exists (select 1 from public.channel_permissions where channel_id = target_channel_id) then true
    when action = 'read' then coalesce((select can_read from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    when action = 'write' then coalesce((select can_write from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    when action = 'speak' then coalesce((select can_speak from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    else false
  end from channel_role;
$$;

drop policy "members can view channels" on public.channels;
drop policy "owners can create channels" on public.channels;
drop policy "owners can update channels" on public.channels;
drop policy "owners can delete channels" on public.channels;
create policy "members can view permitted channels" on public.channels for select to authenticated using (public.can_use_channel(id, 'read'));
create policy "moderators can create channels" on public.channels for insert to authenticated with check (public.can_manage_channels(server_id) and (select auth.uid()) = created_by);
create policy "moderators can update channels" on public.channels for update to authenticated using (public.can_manage_channels(server_id)) with check (public.can_manage_channels(server_id));
create policy "moderators can delete channels" on public.channels for delete to authenticated using (public.can_manage_channels(server_id));

drop policy "members can view messages" on public.messages;
drop policy "members can send messages" on public.messages;
create policy "members can view permitted messages" on public.messages for select to authenticated using (public.can_use_channel(channel_id, 'read'));
create policy "members can send permitted messages" on public.messages for insert to authenticated with check ((select auth.uid()) = author_id and public.can_use_channel(channel_id, 'write'));

create policy "members can view channel permissions" on public.channel_permissions for select to authenticated using (public.is_server_member((select server_id from public.channels where id = channel_id)));
create policy "owners manage channel permissions" on public.channel_permissions for all to authenticated using (public.is_server_owner((select server_id from public.channels where id = channel_id))) with check (public.is_server_owner((select server_id from public.channels where id = channel_id)));

create policy "users manage own read states" on public.channel_read_states for all to authenticated using ((select auth.uid()) = user_id and public.can_use_channel(channel_id, 'read')) with check ((select auth.uid()) = user_id and public.can_use_channel(channel_id, 'read'));

create policy "owners manage invite links" on public.server_invite_links for all to authenticated using (public.is_server_owner(server_id)) with check (public.is_server_owner(server_id) and (select auth.uid()) = created_by);
create policy "owners change member roles" on public.server_members for update to authenticated using (public.is_server_owner(server_id)) with check (public.is_server_owner(server_id));

alter table public.channel_permissions enable row level security;
alter table public.channel_read_states enable row level security;
alter table public.server_invite_links enable row level security;
grant select, insert, update, delete on public.channel_permissions, public.channel_read_states, public.server_invite_links to authenticated;

create or replace function public.inspect_server_invite_link(target_code text)
returns table (server_id uuid, server_name text)
language sql stable security definer set search_path = ''
as $$
  select links.server_id, servers.name
  from public.server_invite_links links join public.servers on servers.id = links.server_id
  where links.code = target_code and links.revoked_at is null
    and (links.expires_at is null or links.expires_at > now())
    and (links.max_uses is null or links.uses_count < links.max_uses);
$$;

create or replace function public.redeem_server_invite_link(target_code text)
returns table (server_id uuid, server_name text)
language plpgsql security definer set search_path = ''
as $$
declare link_row public.server_invite_links%rowtype;
begin
  select * into link_row from public.server_invite_links
  where code = target_code and revoked_at is null
    and (expires_at is null or expires_at > now())
    and (max_uses is null or uses_count < max_uses)
  for update;
  if not found then raise exception 'Convite invalido ou expirado'; end if;
  insert into public.server_members (server_id, user_id, role)
  values (link_row.server_id, (select auth.uid()), 'member') on conflict do nothing;
  update public.server_invite_links set uses_count = uses_count + 1 where id = link_row.id;
  return query select servers.id, servers.name from public.servers where servers.id = link_row.server_id;
end;
$$;
grant execute on function public.inspect_server_invite_link(text), public.redeem_server_invite_link(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "avatars are readable" on storage.objects for select to authenticated using (bucket_id = 'avatars');
create policy "users upload own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "users update own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "users remove own avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
