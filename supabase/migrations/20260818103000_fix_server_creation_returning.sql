drop policy "members can view servers" on public.servers;

create policy "members can view servers"
on public.servers for select to authenticated
using (
  owner_id = (select auth.uid())
  or public.is_server_member(id)
);
