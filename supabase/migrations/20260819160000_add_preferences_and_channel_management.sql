create table public.server_preferences (
  server_id uuid not null references public.servers (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  muted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (server_id, user_id)
);

create trigger server_preferences_set_updated_at
before update on public.server_preferences
for each row execute procedure public.set_updated_at();

alter table public.server_preferences enable row level security;

create policy "users manage their server preferences"
on public.server_preferences for all to authenticated
using ((select auth.uid()) = user_id and public.is_server_member(server_id))
with check ((select auth.uid()) = user_id and public.is_server_member(server_id));

grant select, insert, update, delete on public.server_preferences to authenticated;
