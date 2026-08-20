import { useMemo, useState } from 'react'
import { DropdownMenu, Tabs } from 'radix-ui'
import type { FriendPresence, FriendRequestSummary, PersonSummary, ServerInviteSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { statusClass, statusLabel } from './presence'

type ActionResult = { ok: boolean; message: string }

type FriendsHomeProps = {
  friendRequests: FriendRequestSummary[]
  friends: PersonSummary[]
  onAcceptFriendRequest: (requestId: string) => Promise<ActionResult>
  onAcceptServerInvite: (invite: ServerInviteSummary) => Promise<ActionResult>
  onOpenFriend: (friend: PersonSummary) => void
  onSendFriendRequest: (username: string) => Promise<ActionResult>
  presenceByUser: Record<string, FriendPresence>
  serverInvites: ServerInviteSummary[]
  tab: string
  onTabChange: (tab: string) => void
}

const initialsFrom = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function FriendsHome({ friendRequests, friends, onAcceptFriendRequest, onAcceptServerInvite, onOpenFriend, onSendFriendRequest, presenceByUser, serverInvites, tab, onTabChange }: FriendsHomeProps) {
  const [search, setSearch] = useState('')
  const [newFriend, setNewFriend] = useState('')
  const [feedback, setFeedback] = useState<ActionResult | null>(null)

  const receivedRequests = friendRequests.filter((request) => request.direction === 'received')
  const sentRequests = friendRequests.filter((request) => request.direction === 'sent')
  const pendingCount = receivedRequests.length + sentRequests.length + serverInvites.length

  const ordered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return friends
      .filter((friend) => !term || friend.nickname.toLowerCase().includes(term) || friend.username.toLowerCase().includes(term))
      .slice()
      .sort((left, right) => {
        const leftOnline = presenceByUser[left.id] ? 0 : 1
        const rightOnline = presenceByUser[right.id] ? 0 : 1
        return leftOnline - rightOnline || left.nickname.localeCompare(right.nickname)
      })
  }, [friends, presenceByUser, search])

  const online = ordered.filter((friend) => Boolean(presenceByUser[friend.id]))
  const activeNow = friends
    .map((friend) => ({ friend, presence: presenceByUser[friend.id] }))
    .filter((entry): entry is { friend: PersonSummary; presence: FriendPresence } => Boolean(entry.presence?.voiceChannelName))

  const submitFriend = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await onSendFriendRequest(newFriend)
    setFeedback(result)
    if (result.ok) setNewFriend('')
  }

  const renderList = (list: PersonSummary[], emptyCopy: string) => (
    <>
      <p className="friends-count-label">{tab === 'online' ? 'DISPONÍVEL' : 'TODOS'} — {list.length}</p>
      <ul className="friends-people">
        {list.map((friend) => {
          const presence = presenceByUser[friend.id]
          return (
            <li className="friend-person" key={friend.id}>
              <span className={statusClass(presence)}>
                <Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} />
              </span>
              <div><strong>{friend.nickname}</strong><small>{statusLabel(presence)}</small></div>
              <button aria-label={`Enviar mensagem para ${friend.nickname}`} className="friend-person-action" type="button" onClick={() => onOpenFriend(friend)}>✉</button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger aria-label={`Mais opções de ${friend.nickname}`} className="friend-person-action">⋮</DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" className="server-menu-content" sideOffset={6}>
                    <DropdownMenu.Item onSelect={() => onOpenFriend(friend)}>Enviar mensagem</DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => void navigator.clipboard?.writeText(`@${friend.username}`)}>Copiar identificador</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </li>
          )
        })}
      </ul>
      {!list.length ? <p className="friends-empty-copy">{emptyCopy}</p> : null}
    </>
  )

  return (
    <section className="friends-home">
      <Tabs.Root className="friends-tabs" value={tab} onValueChange={onTabChange}>
      <header className="friends-header">
        <div className="friends-title"><span aria-hidden="true">♧</span><h1>Amigos</h1></div>
        <Tabs.List aria-label="Seções de amigos" className="friends-tab-list">
          <Tabs.Trigger value="online">Disponível</Tabs.Trigger>
          <Tabs.Trigger value="all">Todos</Tabs.Trigger>
          <Tabs.Trigger value="pending">Pendente{pendingCount ? ` · ${pendingCount}` : ''}</Tabs.Trigger>
          <Tabs.Trigger className="friends-add-tab" value="add">Adicionar amigo</Tabs.Trigger>
        </Tabs.List>
      </header>
      <div className="friends-body">
        <div className="friends-main">
          {tab === 'online' || tab === 'all' ? (
            <input aria-label="Buscar amigos" className="friends-search" placeholder="Buscar" type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          ) : null}
          <Tabs.Content className="friends-tab-content" value="online">
            {renderList(online, 'Ninguém dos seus amigos está disponível agora.')}
          </Tabs.Content>
          <Tabs.Content className="friends-tab-content" value="all">
            {renderList(ordered, 'Sua lista está pronta. Adicione o primeiro amigo pelo identificador.')}
          </Tabs.Content>
          <Tabs.Content className="friends-tab-content" value="pending">
            <section className="friend-requests" aria-label="Pedidos recebidos">
              <p>PEDIDOS RECEBIDOS</p>
              {receivedRequests.map((request) => (
                <div className="friend-row" key={request.id}>
                  <Avatar initials={initialsFrom(request.person.nickname)} tone="amber" url={request.person.avatarUrl} />
                  <div><strong>{request.person.nickname}</strong><small>@{request.person.username}</small></div>
                  <button type="button" onClick={() => void onAcceptFriendRequest(request.id)}>ACEITAR</button>
                </div>
              ))}
              {!receivedRequests.length ? <p className="friends-empty-copy">Nenhum pedido de amizade pendente.</p> : null}
            </section>
            <section className="friend-requests" aria-label="Pedidos enviados">
              <p>PEDIDOS ENVIADOS</p>
              {sentRequests.map((request) => (
                <div className="friend-row" key={request.id}>
                  <Avatar initials={initialsFrom(request.person.nickname)} url={request.person.avatarUrl} />
                  <div><strong>{request.person.nickname}</strong><small>@{request.person.username} · aguardando resposta</small></div>
                </div>
              ))}
              {!sentRequests.length ? <p className="friends-empty-copy">Nenhum pedido enviado.</p> : null}
            </section>
            <section className="friend-requests" aria-label="Convites de servidor">
              <p>CONVITES DE SERVIDOR</p>
              {serverInvites.map((invite) => (
                <div className="friend-row" key={invite.id}>
                  <Avatar initials={initialsFrom(invite.serverName)} />
                  <div><strong>{invite.serverName}</strong><small>por @{invite.sender.username}</small></div>
                  <button type="button" onClick={() => void onAcceptServerInvite(invite)}>ENTRAR</button>
                </div>
              ))}
              {!serverInvites.length ? <p className="friends-empty-copy">Nenhum convite de servidor pendente.</p> : null}
            </section>
          </Tabs.Content>
          <Tabs.Content className="friends-tab-content" value="add">
            <form className="friends-add-form" onSubmit={(event) => void submitFriend(event)}>
              <h2>Adicionar amigo</h2>
              <p>Você pode adicionar amigos pelo identificador. Ele diferencia maiúsculas de minúsculas.</p>
              <div>
                <input aria-label="Identificador" placeholder="@identificador" value={newFriend} onChange={(event) => { setNewFriend(event.target.value); setFeedback(null) }} />
                <button disabled={!newFriend.trim()} type="submit">Enviar pedido</button>
              </div>
              {feedback ? <p className={feedback.ok ? 'friends-feedback ok' : 'friends-feedback'} role="status">{feedback.message}</p> : null}
            </form>
          </Tabs.Content>
        </div>
        <aside className="friends-active" aria-label="Ativo agora">
          <h2>Ativo agora</h2>
          {activeNow.map(({ friend, presence }) => (
            <button className="friends-active-card" key={friend.id} type="button" onClick={() => onOpenFriend(friend)}>
              <Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} />
              <div><strong>{friend.nickname}</strong><small>{presence.voiceServerName ? `${presence.voiceServerName} · ` : ''}{presence.voiceChannelName}</small></div>
            </button>
          ))}
          {!activeNow.length ? <p className="friends-empty-copy">Está meio quieto por aqui. Quando um amigo entrar em uma chamada, ele aparece nesta lista.</p> : null}
        </aside>
      </div>
      </Tabs.Root>
    </section>
  )
}
