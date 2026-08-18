create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint friend_requests_distinct_users check (sender_id <> recipient_id),
  constraint friend_requests_unique_direction unique (sender_id, recipient_id)
);

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles (id) on delete cascade,
  user_b_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint friendships_distinct_users check (user_a_id <> user_b_id),
  constraint friendships_ordered_users check (user_a_id < user_b_id),
  constraint friendships_unique_pair unique (user_a_id, user_b_id)
);

create table public.servers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  name text not null check (char_length(trim(name)) between 3 and 48),
  description text not null default '' check (char_length(description) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.server_members (
  server_id uuid not null references public.servers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers (id) on delete cascade,
  name text not null check (name ~ '^[a-z0-9][a-z0-9-]{1,46}$'),
  kind text not null default 'text' check (kind in ('text', 'voice')),
  position integer not null default 0 check (position >= 0),
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint channels_unique_name_per_server unique (server_id, name)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index messages_channel_created_at_idx on public.messages (channel_id, created_at);
create index server_members_user_id_idx on public.server_members (user_id, server_id);
create index channels_server_position_idx on public.channels (server_id, position, created_at);

create or replace function public.is_server_member(target_server_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.server_members
    where server_id = target_server_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_server_owner(target_server_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.servers
    where id = target_server_id
      and owner_id = (select auth.uid())
  );
$$;

create or replace function public.create_server_defaults()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.server_members (server_id, user_id, role)
  values (new.id, new.owner_id, 'owner');

  insert into public.channels (server_id, name, kind, position, created_by)
  values (new.id, 'geral', 'text', 0, new.owner_id);

  return new;
end;
$$;

create trigger servers_create_defaults
after insert on public.servers
for each row execute procedure public.create_server_defaults();

create or replace function public.create_friendship_on_accept()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'accepted' and old.status <> 'accepted' then
    insert into public.friendships (user_a_id, user_b_id)
    values (least(new.sender_id, new.recipient_id), greatest(new.sender_id, new.recipient_id))
    on conflict (user_a_id, user_b_id) do nothing;

    new.responded_at := coalesce(new.responded_at, now());
  end if;

  return new;
end;
$$;

create trigger friend_requests_create_friendship
before update on public.friend_requests
for each row execute procedure public.create_friendship_on_accept();

create trigger servers_set_updated_at
before update on public.servers
for each row execute procedure public.set_updated_at();

alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;
alter table public.servers enable row level security;
alter table public.server_members enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;

create policy "users can view their friend requests"
on public.friend_requests for select to authenticated
using ((select auth.uid()) = sender_id or (select auth.uid()) = recipient_id);

create policy "users can send friend requests"
on public.friend_requests for insert to authenticated
with check ((select auth.uid()) = sender_id and sender_id <> recipient_id);

create policy "recipients can respond to friend requests"
on public.friend_requests for update to authenticated
using ((select auth.uid()) = recipient_id)
with check ((select auth.uid()) = recipient_id);

create policy "senders can cancel pending friend requests"
on public.friend_requests for update to authenticated
using ((select auth.uid()) = sender_id and status = 'pending')
with check ((select auth.uid()) = sender_id and status = 'cancelled');

create policy "users can view their friendships"
on public.friendships for select to authenticated
using ((select auth.uid()) = user_a_id or (select auth.uid()) = user_b_id);

create policy "members can view servers"
on public.servers for select to authenticated
using (public.is_server_member(id));

create policy "users can create servers"
on public.servers for insert to authenticated
with check ((select auth.uid()) = owner_id);

create policy "owners can update servers"
on public.servers for update to authenticated
using (public.is_server_owner(id))
with check (public.is_server_owner(id));

create policy "owners can delete servers"
on public.servers for delete to authenticated
using (public.is_server_owner(id));

create policy "members can view server members"
on public.server_members for select to authenticated
using (public.is_server_member(server_id));

create policy "owners can add server members"
on public.server_members for insert to authenticated
with check (public.is_server_owner(server_id));

create policy "owners can remove server members"
on public.server_members for delete to authenticated
using (public.is_server_owner(server_id));

create policy "members can view channels"
on public.channels for select to authenticated
using (public.is_server_member(server_id));

create policy "owners can create channels"
on public.channels for insert to authenticated
with check (public.is_server_owner(server_id) and (select auth.uid()) = created_by);

create policy "owners can update channels"
on public.channels for update to authenticated
using (public.is_server_owner(server_id))
with check (public.is_server_owner(server_id));

create policy "owners can delete channels"
on public.channels for delete to authenticated
using (public.is_server_owner(server_id));

create policy "members can view messages"
on public.messages for select to authenticated
using (
  exists (
    select 1 from public.channels
    where channels.id = messages.channel_id
      and public.is_server_member(channels.server_id)
  )
);

create policy "members can send messages"
on public.messages for insert to authenticated
with check (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.channels
    where channels.id = messages.channel_id
      and channels.kind = 'text'
      and public.is_server_member(channels.server_id)
  )
);

create policy "authors can update their messages"
on public.messages for update to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

create policy "authors can delete their messages"
on public.messages for delete to authenticated
using ((select auth.uid()) = author_id);

grant select, insert, update, delete on public.friend_requests to authenticated;
grant select on public.friendships to authenticated;
grant select, insert, update, delete on public.servers to authenticated;
grant select, insert, delete on public.server_members to authenticated;
grant select, insert, update, delete on public.channels to authenticated;
grant select, insert, update, delete on public.messages to authenticated;

alter publication supabase_realtime add table public.messages;
