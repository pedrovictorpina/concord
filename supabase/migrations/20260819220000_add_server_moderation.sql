create table public.server_bans (
  server_id uuid not null references public.servers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  banned_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create table public.server_member_moderation (
  server_id uuid not null references public.servers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  timeout_until timestamptz,
  microphone_disabled boolean not null default false,
  output_disabled boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create or replace function public.can_moderate_member(target_server_id uuid, target_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.server_members actor
    join public.server_members target on target.server_id = actor.server_id
    where actor.server_id = target_server_id and actor.user_id = (select auth.uid()) and target.user_id = target_user_id
      and ((actor.role = 'owner' and target.role <> 'owner') or (actor.role = 'moderator' and target.role = 'member'))
  );
$$;

create or replace function public.ban_server_member(target_server_id uuid, target_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_moderate_member(target_server_id, target_user_id) then raise exception 'Sem permissao para banir este membro'; end if;
  insert into public.server_bans (server_id, user_id, banned_by) values (target_server_id, target_user_id, (select auth.uid())) on conflict do nothing;
  delete from public.server_members where server_id = target_server_id and user_id = target_user_id;
end;
$$;

create or replace function public.set_server_member_moderation(target_server_id uuid, target_user_id uuid, next_timeout_until timestamptz, next_microphone_disabled boolean, next_output_disabled boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_moderate_member(target_server_id, target_user_id) then raise exception 'Sem permissao para moderar este membro'; end if;
  insert into public.server_member_moderation (server_id, user_id, timeout_until, microphone_disabled, output_disabled)
  values (target_server_id, target_user_id, next_timeout_until, next_microphone_disabled, next_output_disabled)
  on conflict (server_id, user_id) do update set timeout_until = excluded.timeout_until, microphone_disabled = excluded.microphone_disabled, output_disabled = excluded.output_disabled, updated_at = now();
end;
$$;

create or replace function public.can_use_channel(target_channel_id uuid, action text)
returns boolean language sql stable security definer set search_path = '' as $$
  with channel_role as (
    select channels.server_id, public.server_role(channels.server_id) as role
    from public.channels where channels.id = target_channel_id
  ), moderation as (
    select timeout_until from public.server_member_moderation where server_id = (select server_id from channel_role) and user_id = (select auth.uid())
  )
  select case
    when role = 'owner' then true
    when role is null then false
    when action in ('write', 'speak') and coalesce((select timeout_until > now() from moderation), false) then false
    when not exists (select 1 from public.channel_permissions where channel_id = target_channel_id) then true
    when action = 'read' then coalesce((select can_read from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    when action = 'write' then coalesce((select can_write from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    when action = 'speak' then coalesce((select can_speak from public.channel_permissions where channel_id = target_channel_id and role = channel_role.role), false)
    else false
  end from channel_role;
$$;

alter table public.server_bans enable row level security;
alter table public.server_member_moderation enable row level security;
create policy "members view server moderation" on public.server_member_moderation for select to authenticated using (public.is_server_member(server_id));
grant select on public.server_bans, public.server_member_moderation to authenticated;
grant execute on function public.ban_server_member(uuid, uuid), public.set_server_member_moderation(uuid, uuid, timestamptz, boolean, boolean) to authenticated;
