import type { FriendRequestSummary, PersonSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'

type FriendsHomeProps = {
  friendRequests: FriendRequestSummary[]
  friends: PersonSummary[]
  onAddFriend: () => void
  onOpenFriend: (friend: PersonSummary) => void
}

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function FriendsHome({ friendRequests, friends, onAddFriend, onOpenFriend }: FriendsHomeProps) {
  const receivedRequests = friendRequests.filter((request) => request.direction === 'received')

  return (
    <section className="friends-home">
      <header className="friends-header"><div><span className="eyebrow">CONEXÕES</span><h1>Mensagens</h1></div><button className="friends-add" type="button" onClick={onAddFriend}>♧ <span>Adicionar amigo</span></button></header>
      <div className="friends-body">
        <section className="friends-overview" aria-label="Resumo de amizades"><span className="friends-count">{friends.length}</span><div><strong>Amigos em sintonia</strong><p>Adicione pessoas pelo identificador e reúna sua turma no mesmo lugar.</p></div></section>
        {receivedRequests.length ? <section className="friend-requests"><p>PEDIDOS RECEBIDOS</p>{receivedRequests.map((request) => <div className="friend-row" key={request.id}><Avatar initials={initials(request.person.nickname)} tone="amber" /><div><strong>{request.person.nickname}</strong><small>@{request.person.username}</small></div><button type="button" onClick={onAddFriend}>VER PEDIDO</button></div>)}</section> : null}
        <section className="friends-list" aria-label="Amigos">
          <div><p>AMIGOS</p><button type="button" onClick={onAddFriend}>+ ADICIONAR</button></div>
          {friends.map((friend) => <button className="friend-row" key={friend.id} type="button" onClick={() => onOpenFriend(friend)}><Avatar initials={initials(friend.nickname)} /><div><strong>{friend.nickname}</strong><small>@{friend.username} · amizade confirmada</small></div><span aria-label="Amizade ativa" className="presence-dot" /></button>)}
          {!friends.length && <div className="friends-empty"><strong>Sua lista está pronta.</strong><p>Adicione o primeiro amigo para iniciar suas conexões no Concord.</p><button type="button" onClick={onAddFriend}>ADICIONAR AMIGO</button></div>}
        </section>
      </div>
    </section>
  )
}
