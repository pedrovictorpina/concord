create table public.server_invites (
  id uuid primary key default gen_random_uuid(),
  server_id uuid not null references public.servers (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete restrict,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint server_invites_distinct_users check (sender_id <> recipient_id),
  constraint server_invites_unique_recipient unique (server_id, recipient_id)
);

create index server_invites_recipient_idx on public.server_invites (recipient_id, status, created_at desc);

create or replace function public.accept_server_invite()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.server_id <> old.server_id or new.sender_id <> old.sender_id or new.recipient_id <> old.recipient_id then
    raise exception 'Os dados do convite nao podem ser alterados';
  end if;

  if old.status <> 'pending' then
    raise exception 'Este convite ja foi respondido';
  end if;

  if new.status = 'accepted' then
    insert into public.server_members (server_id, user_id)
    values (new.server_id, new.recipient_id)
    on conflict (server_id, user_id) do nothing;

    new.responded_at := coalesce(new.responded_at, now());
  end if;

  return new;
end;
$$;

create trigger server_invites_accept_member
before update on public.server_invites
for each row execute procedure public.accept_server_invite();

alter table public.server_invites enable row level security;

create policy "participants can view server invites"
on public.server_invites for select to authenticated
using (
  (select auth.uid()) = recipient_id
  or public.is_server_owner(server_id)
);

create policy "owners can send server invites"
on public.server_invites for insert to authenticated
with check (
  public.is_server_owner(server_id)
  and (select auth.uid()) = sender_id
);

create policy "recipients can respond to server invites"
on public.server_invites for update to authenticated
using ((select auth.uid()) = recipient_id)
with check ((select auth.uid()) = recipient_id);

grant select, insert, update on public.server_invites to authenticated;
