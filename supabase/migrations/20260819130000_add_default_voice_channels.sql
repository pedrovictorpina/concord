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
  values
    (new.id, 'geral', 'text', 0, new.owner_id),
    (new.id, 'voz', 'voice', 1, new.owner_id);

  return new;
end;
$$;

insert into public.channels (server_id, name, kind, position, created_by)
select servers.id, 'voz', 'voice', 1, servers.owner_id
from public.servers
on conflict (server_id, name) do nothing;
