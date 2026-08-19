create table public.channel_categories (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 32),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (server_id, name)
);

alter table public.channels add column category_id uuid references public.channel_categories (id) on delete set null;
alter table public.servers add column icon_url text;

create table public.server_member_preferences (
  server_id uuid not null references public.servers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  nickname text check (char_length(trim(nickname)) between 2 and 32),
  primary key (server_id, user_id)
);

create table public.message_reactions (
  message_id uuid not null references public.messages (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null check (char_length(emoji) between 1 and 16),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);

alter table public.channel_categories enable row level security;
alter table public.server_member_preferences enable row level security;
alter table public.message_reactions enable row level security;

create policy "members view categories" on public.channel_categories for select to authenticated using (public.is_server_member(server_id));
create policy "moderators manage categories" on public.channel_categories for all to authenticated using (public.can_manage_channels(server_id)) with check (public.can_manage_channels(server_id));
create policy "users manage own server nickname" on public.server_member_preferences for all to authenticated using ((select auth.uid()) = user_id and public.is_server_member(server_id)) with check ((select auth.uid()) = user_id and public.is_server_member(server_id));
create policy "members view reactions" on public.message_reactions for select to authenticated using (public.can_use_channel((select channel_id from public.messages where id = message_id), 'read'));
create policy "members add reactions" on public.message_reactions for insert to authenticated with check ((select auth.uid()) = user_id and public.can_use_channel((select channel_id from public.messages where id = message_id), 'read'));
create policy "users remove own reactions" on public.message_reactions for delete to authenticated using ((select auth.uid()) = user_id);
create policy "members can leave servers" on public.server_members for delete to authenticated using ((select auth.uid()) = user_id and role <> 'owner');

grant select, insert, update, delete on public.channel_categories, public.server_member_preferences, public.message_reactions to authenticated;
alter publication supabase_realtime add table public.message_reactions;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('server-icons', 'server-icons', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']) on conflict (id) do nothing;
create policy "server icons are readable" on storage.objects for select to authenticated using (bucket_id = 'server-icons');
create policy "owners upload server icons" on storage.objects for insert to authenticated with check (bucket_id = 'server-icons' and public.is_server_owner((storage.foldername(name))[1]::uuid));
create policy "owners update server icons" on storage.objects for update to authenticated using (bucket_id = 'server-icons' and public.is_server_owner((storage.foldername(name))[1]::uuid));
