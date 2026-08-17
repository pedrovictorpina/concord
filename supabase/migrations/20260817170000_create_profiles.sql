create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 3 and 32),
  username text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  avatar_url text,
  status text not null default 'online' check (status in ('online', 'away', 'busy', 'offline')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "authenticated users can view profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_nickname text;
  username_base text;
begin
  requested_nickname := trim(coalesce(new.raw_user_meta_data ->> 'nickname', 'usuario'));
  username_base := trim(both '-' from regexp_replace(lower(requested_nickname), '[^a-z0-9]+', '-', 'g'));

  if char_length(username_base) < 3 then
    username_base := 'usuario';
  end if;

  insert into public.profiles (id, nickname, username)
  values (
    new.id,
    left(requested_nickname, 32),
    left(username_base, 23) || '-' || left(replace(new.id::text, '-', ''), 8)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();
