create or replace function public.can_invite_to_server(target_server_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.server_members
    where server_id = target_server_id
      and user_id = (select auth.uid())
      and role in ('owner', 'moderator')
  );
$$;

revoke all on function public.can_invite_to_server(uuid) from public;
grant execute on function public.can_invite_to_server(uuid) to authenticated;

drop policy if exists "owners can send server invites" on public.server_invites;
create policy "owners and moderators can send server invites"
on public.server_invites for insert to authenticated
with check (
  public.can_invite_to_server(server_id)
  and (select auth.uid()) = sender_id
);

drop policy if exists "owners manage invite links" on public.server_invite_links;
create policy "owners and moderators manage invite links"
on public.server_invite_links for all to authenticated
using (public.can_invite_to_server(server_id))
with check (public.can_invite_to_server(server_id) and (select auth.uid()) = created_by);
