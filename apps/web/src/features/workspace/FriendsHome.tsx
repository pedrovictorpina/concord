import { Tabs } from 'radix-ui'
import type { FriendRequestSummary, PersonSummary, ServerInviteSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'

type ActionResult = { ok: boolean; message: string }

type FriendsHomeProps = {
  friendRequests: FriendRequestSummary[]
  friends: PersonSummary[]
  onAcceptFriendRequest: (requestId: string) => Promise<ActionResult>
  onAcceptServerInvite: (invite: ServerInviteSummary) => Promise<ActionResult>
  onAddFriend: () => void
  onOpenFriend: (friend: PersonSummary) => void
  serverInvites: ServerInviteSummary[]
}

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function FriendsHome({ friendRequests, friends, onAcceptFriendRequest, onAcceptServerInvite, onAddFriend, onOpenFriend, serverInvites }: FriendsHomeProps) {
  const receivedRequests = friendRequests.filter((request) => request.direction === 'received')
  const inviteCount = receivedRequests.length + serverInvites.length

  return (
    <section className="friends-home">
      <header className="friends-header"><div><span className="eyebrow">CONEXÕES</span><h1>Mensagens</h1></div><button className="friends-add" type="button" onClick={onAddFriend}>♧ <span>Adicionar amigo</span></button></header>
      <Tabs.Root className="friends-tabs" defaultValue="friends">
        <Tabs.List aria-label="Mensagens e convites" className="friends-tab-list">
          <Tabs.Trigger value="friends">Amigos</Tabs.Trigger>
          <Tabs.Trigger value="invites">Convites{inviteCount ? ` · ${inviteCount}` : ''}</Tabs.Trigger>
        </Tabs.List>
        <div className="friends-body">
          <Tabs.Content className="friends-tab-content" value="friends">
            <section className="friends-overview" aria-label="Resumo de amizades"><span className="friends-count">{friends.length}</span><div><strong>Amigos em sintonia</strong><p>Adicione pessoas pelo identificador e reúna sua turma no mesmo lugar.</p></div></section>
            <section className="friends-list" aria-label="Amigos">
              <div><p>AMIGOS</p><button type="button" onClick={onAddFriend}>+ ADICIONAR</button></div>
              {friends.map((friend) => <button className="friend-row" key={friend.id} type="button" onClick={() => onOpenFriend(friend)}><Avatar initials={initials(friend.nickname)} /><div><strong>{friend.nickname}</strong><small>@{friend.username} · amizade confirmada</small></div><span aria-label="Amizade ativa" className="presence-dot" /></button>)}
              {!friends.length && <div className="friends-empty"><strong>Sua lista está pronta.</strong><p>Adicione o primeiro amigo para iniciar suas conexões no Concord.</p><button type="button" onClick={onAddFriend}>ADICIONAR AMIGO</button></div>}
            </section>
          </Tabs.Content>
          <Tabs.Content className="friends-tab-content" value="invites">
            <section className="friend-requests" aria-label="Pedidos de amizade"><p>PEDIDOS DE AMIZADE</p>{receivedRequests.map((request) => <div className="friend-row" key={request.id}><Avatar initials={initials(request.person.nickname)} tone="amber" /><div><strong>{request.person.nickname}</strong><small>@{request.person.username}</small></div><button type="button" onClick={() => void onAcceptFriendRequest(request.id)}>ACEITAR</button></div>)}{!receivedRequests.length ? <p className="friends-empty-copy">Nenhum pedido de amizade pendente.</p> : null}</section>
            <section className="friend-requests" aria-label="Convites de servidor"><p>CONVITES DE SERVIDOR</p>{serverInvites.map((invite) => <div className="friend-row" key={invite.id}><Avatar initials={initials(invite.serverName)} /><div><strong>{invite.serverName}</strong><small>por @{invite.sender.username}</small></div><button type="button" onClick={() => void onAcceptServerInvite(invite)}>ENTRAR</button></div>)}{!serverInvites.length ? <p className="friends-empty-copy">Nenhum convite de servidor pendente.</p> : null}</section>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </section>
  )
}
