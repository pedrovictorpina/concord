create table public.direct_conversations (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles (id) on delete cascade,
  user_b_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint direct_conversations_distinct_users check (user_a_id <> user_b_id),
  constraint direct_conversations_ordered_users check (user_a_id < user_b_id),
  constraint direct_conversations_unique_pair unique (user_a_id, user_b_id)
);

create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.direct_conversations (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index direct_messages_conversation_created_at_idx on public.direct_messages (conversation_id, created_at);

create or replace function public.is_direct_conversation_member(target_conversation_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.direct_conversations where id = target_conversation_id and (user_a_id = (select auth.uid()) or user_b_id = (select auth.uid())));
$$;

create or replace function public.get_or_create_direct_conversation(peer_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare conversation_id uuid;
begin
  if peer_id = (select auth.uid()) or not exists (select 1 from public.friendships where user_a_id = least((select auth.uid()), peer_id) and user_b_id = greatest((select auth.uid()), peer_id)) then
    raise exception 'friendship required';
  end if;
  insert into public.direct_conversations (user_a_id, user_b_id)
  values (least((select auth.uid()), peer_id), greatest((select auth.uid()), peer_id))
  on conflict (user_a_id, user_b_id) do update set user_a_id = excluded.user_a_id
  returning id into conversation_id;
  return conversation_id;
end;
$$;

alter table public.direct_conversations enable row level security;
alter table public.direct_messages enable row level security;

create policy "friends view direct conversations" on public.direct_conversations for select to authenticated using (public.is_direct_conversation_member(id));
create policy "members view direct messages" on public.direct_messages for select to authenticated using (public.is_direct_conversation_member(conversation_id));
create policy "members send direct messages" on public.direct_messages for insert to authenticated with check ((select auth.uid()) = author_id and public.is_direct_conversation_member(conversation_id));

grant select on public.direct_conversations to authenticated;
grant select, insert on public.direct_messages to authenticated;
grant execute on function public.get_or_create_direct_conversation(uuid) to authenticated;
alter publication supabase_realtime add table public.direct_messages;
