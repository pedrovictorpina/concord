import { useMemo, useState } from 'react'
import { DropdownMenu } from 'radix-ui'
import type { FriendPresence, FriendRequestSummary, PersonSummary, ServerInviteSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { presenceBucket, statusClass, statusLabel } from './presence'
import type { PresenceBucket } from './presence'
import { BackIcon, MessageIcon, MoreIcon } from './WorkspaceIcons'

type ActionResult = { ok: boolean; message: string }

export type FriendsHomeTab = 'friends' | 'pending' | 'add'

type FriendsHomeProps = {
  friendRequests: FriendRequestSummary[]
  friends: PersonSummary[]
  onAcceptFriendRequest: (requestId: string) => Promise<ActionResult>
  onAcceptServerInvite: (invite: ServerInviteSummary) => Promise<ActionResult>
  onOpenFriend: (friend: PersonSummary) => void
  onSendFriendRequest: (username: string) => Promise<ActionResult>
  presenceByUser: Record<string, FriendPresence>
  serverInvites: ServerInviteSummary[]
  tab: FriendsHomeTab
  onTabChange: (tab: FriendsHomeTab) => void
}

const initialsFrom = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const filterOptions: ReadonlyArray<readonly ['all' | PresenceBucket, string]> = [
  ['all', 'Todos'],
  ['online', 'Online'],
  ['away', 'Ausentes'],
  ['offline', 'Offline'],
]

const bucketOrder: PresenceBucket[] = ['online', 'away', 'offline']
const bucketLabel: Record<PresenceBucket, string> = { online: 'Online', away: 'Ausentes', offline: 'Offline' }
const bucketPriority: Record<PresenceBucket, number> = { online: 0, away: 1, offline: 2 }

export function FriendsHome({ friendRequests, friends, onAcceptFriendRequest, onAcceptServerInvite, onOpenFriend, onSendFriendRequest, presenceByUser, serverInvites, tab, onTabChange }: FriendsHomeProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | PresenceBucket>('all')
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)
  const [newFriend, setNewFriend] = useState('')
  const [feedback, setFeedback] = useState<ActionResult | null>(null)

  const receivedRequests = friendRequests.filter((request) => request.direction === 'received')
  const sentRequests = friendRequests.filter((request) => request.direction === 'sent')
  const pendingCount = receivedRequests.length + sentRequests.length + serverInvites.length

  const counts = useMemo(() => {
    const result: Record<'all' | PresenceBucket, number> = { all: friends.length, online: 0, away: 0, offline: 0 }
    friends.forEach((friend) => { result[presenceBucket(presenceByUser[friend.id])] += 1 })
    return result
  }, [friends, presenceByUser])

  const sorted = useMemo(() => {
    const term = search.trim().toLowerCase()
    return friends
      .filter((friend) => !term || friend.nickname.toLowerCase().includes(term) || friend.username.toLowerCase().includes(term))
      .filter((friend) => filter === 'all' || presenceBucket(presenceByUser[friend.id]) === filter)
      .slice()
      .sort((left, right) => {
        const diff = bucketPriority[presenceBucket(presenceByUser[left.id])] - bucketPriority[presenceBucket(presenceByUser[right.id])]
        return diff || left.nickname.localeCompare(right.nickname)
      })
  }, [filter, friends, presenceByUser, search])

  const groups = useMemo(() => {
    if (filter !== 'all') return null
    const result: Record<PresenceBucket, PersonSummary[]> = { online: [], away: [], offline: [] }
    sorted.forEach((friend) => { result[presenceBucket(presenceByUser[friend.id])].push(friend) })
    return result
  }, [filter, presenceByUser, sorted])

  const activeNow = friends
    .map((friend) => ({ friend, presence: presenceByUser[friend.id] }))
    .filter((entry): entry is { friend: PersonSummary; presence: FriendPresence } => Boolean(entry.presence?.voiceChannelName))

  const selectedFriend = friends.find((friend) => friend.id === selectedFriendId) ?? null
  const selectedPresence = selectedFriend ? presenceByUser[selectedFriend.id] : undefined

  const submitFriend = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await onSendFriendRequest(newFriend)
    setFeedback(result)
    if (result.ok) setNewFriend('')
  }

  const emptyMessage = () => {
    if (!friends.length) return 'Você ainda não adicionou ninguém.'
    if (search.trim()) return 'Nenhum amigo corresponde a essa busca.'
    if (filter === 'online') return 'Nenhum amigo online agora.'
    if (filter === 'away') return 'Nenhum amigo ausente agora.'
    if (filter === 'offline') return 'Nenhum amigo offline agora.'
    return 'Nenhum amigo encontrado.'
  }

  const friendActionsMenu = (friend: PersonSummary) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label={`Mais opções de ${friend.nickname}`} className="friend-person-action"><MoreIcon /></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="server-menu-content" sideOffset={6}>
          <DropdownMenu.Item onSelect={() => onOpenFriend(friend)}>Enviar mensagem</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => void navigator.clipboard?.writeText(`@${friend.username}`)}>Copiar identificador</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )

  const renderFriendRow = (friend: PersonSummary) => {
    const presence = presenceByUser[friend.id]
    return (
      <li className={selectedFriendId === friend.id ? 'friend-person selected' : 'friend-person'} key={friend.id}>
        <button className="friend-person-main" type="button" onClick={() => setSelectedFriendId(friend.id)}>
          <span className={statusClass(presence)}>
            <Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} />
          </span>
          <div><strong>{friend.nickname}</strong><small>{statusLabel(presence)}</small></div>
        </button>
        <button aria-label={`Enviar mensagem para ${friend.nickname}`} className="friend-person-action" type="button" onClick={() => onOpenFriend(friend)}><MessageIcon /></button>
        {friendActionsMenu(friend)}
      </li>
    )
  }

  const renderPendingView = () => (
    <>
      <header className="friends-subview-header">
        <button aria-label="Voltar para amigos" className="friends-back" type="button" onClick={() => onTabChange('friends')}><BackIcon /></button>
        <h2>Solicitações{pendingCount ? <i className="channel-badge">{pendingCount}</i> : null}</h2>
      </header>
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
    </>
  )

  const renderAddView = () => (
    <>
      <header className="friends-subview-header">
        <button aria-label="Voltar para amigos" className="friends-back" type="button" onClick={() => onTabChange('friends')}><BackIcon /></button>
        <h2>Adicionar amigo</h2>
      </header>
      <form className="friends-add-form" onSubmit={(event) => void submitFriend(event)}>
        <p>Você pode adicionar amigos pelo identificador. Ele diferencia maiúsculas de minúsculas.</p>
        <div>
          <input aria-label="Identificador" placeholder="@identificador" value={newFriend} onChange={(event) => { setNewFriend(event.target.value); setFeedback(null) }} />
          <button disabled={!newFriend.trim()} type="submit">Enviar pedido</button>
        </div>
        {feedback ? <p className={feedback.ok ? 'friends-feedback ok' : 'friends-feedback'} role="status">{feedback.message}</p> : null}
      </form>
    </>
  )

  const renderFriendsView = () => (
    <>
      <div className="friends-search-row">
        <input aria-label="Buscar amigos" className="friends-search" placeholder="Buscar amigos..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="friends-filter-row" role="group" aria-label="Filtrar por presença">
        {filterOptions.map(([id, label]) => (
          <button aria-pressed={filter === id} className={filter === id ? 'friends-filter active' : 'friends-filter'} key={id} type="button" onClick={() => setFilter(id)}>
            {label} <i>{counts[id]}</i>
          </button>
        ))}
      </div>

      {filter === 'all' && groups ? (
        bucketOrder.map((bucket) => groups[bucket].length ? (
          <div className="friends-group" key={bucket}>
            <p className="friends-count-label">{bucketLabel[bucket]} — {groups[bucket].length}</p>
            <ul className="friends-people">{groups[bucket].map(renderFriendRow)}</ul>
          </div>
        ) : null)
      ) : (
        <>
          <p className="friends-count-label">{filterOptions.find(([id]) => id === filter)?.[1]} — {sorted.length}</p>
          <ul className="friends-people">{sorted.map(renderFriendRow)}</ul>
        </>
      )}
      {!sorted.length ? (
        <div className="friends-empty">
          <p className="friends-empty-copy">{emptyMessage()}</p>
          {!friends.length ? <button className="friends-empty-cta" type="button" onClick={() => onTabChange('add')}>Adicionar amigo</button> : null}
        </div>
      ) : null}
    </>
  )

  const renderFriendDetail = (friend: PersonSummary, presence: FriendPresence | undefined) => (
    <div className="friend-detail">
      <button aria-label="Fechar detalhes" className="friends-back" type="button" onClick={() => setSelectedFriendId(null)}><BackIcon /></button>
      <span className={statusClass(presence)}><Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} /></span>
      <h2>{friend.nickname}</h2>
      <p className="friend-detail-status">{statusLabel(presence)}</p>
      <small>@{friend.username}</small>
      <div className="friend-detail-actions">
        <button className="friend-detail-message" type="button" onClick={() => onOpenFriend(friend)}><MessageIcon />Mensagem</button>
        {friendActionsMenu(friend)}
      </div>
      {presence?.voiceChannelName ? (
        <div className="friend-detail-activity">
          <p>ATIVIDADE</p>
          <strong>{presence.voiceServerName ? `${presence.voiceServerName} · ` : ''}{presence.voiceChannelName}</strong>
        </div>
      ) : null}
    </div>
  )

  return (
    <section className="friends-home">
      <div className="friends-body">
        <div className="friends-main">
          {tab === 'friends' ? (
            <header className="friends-header">
              <div className="friends-title"><span aria-hidden="true">♧</span><h1>Amigos</h1></div>
              <button className="friends-add-shortcut" type="button" onClick={() => onTabChange('add')}><span aria-hidden="true">+</span>Adicionar amigo</button>
            </header>
          ) : null}
          {tab === 'add' ? renderAddView() : tab === 'pending' ? renderPendingView() : renderFriendsView()}
          {tab === 'friends' && selectedFriend ? (
            <div aria-label={`Detalhes de ${selectedFriend.nickname}`} className="friend-detail-overlay" role="region">
              {renderFriendDetail(selectedFriend, selectedPresence)}
            </div>
          ) : null}
        </div>
        <aside className="friends-details" aria-label={selectedFriend ? `Detalhes de ${selectedFriend.nickname}` : 'Ativo agora'}>
          {selectedFriend ? renderFriendDetail(selectedFriend, selectedPresence) : (
            <>
              <h2>Ativo agora</h2>
              {activeNow.map(({ friend, presence }) => (
                <button className="friends-active-card" key={friend.id} type="button" onClick={() => onOpenFriend(friend)}>
                  <Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} />
                  <div><strong>{friend.nickname}</strong><small>{presence.voiceServerName ? `${presence.voiceServerName} · ` : ''}{presence.voiceChannelName}</small></div>
                </button>
              ))}
              {!activeNow.length ? <p className="friends-empty-copy">Está meio quieto por aqui. Quando um amigo entrar em uma chamada, ele aparece nesta lista.</p> : null}

              {receivedRequests.length ? (
                <section className="friends-details-summary">
                  <header><strong>Solicitações de amizade</strong><i>{receivedRequests.length}</i></header>
                  {receivedRequests.slice(0, 2).map((request) => (
                    <div className="friend-row" key={request.id}>
                      <Avatar initials={initialsFrom(request.person.nickname)} tone="amber" url={request.person.avatarUrl} />
                      <div><strong>{request.person.nickname}</strong><small>@{request.person.username}</small></div>
                      <button type="button" onClick={() => void onAcceptFriendRequest(request.id)}>ACEITAR</button>
                    </div>
                  ))}
                  <button className="friends-details-viewall" type="button" onClick={() => onTabChange('pending')}>Ver todas</button>
                </section>
              ) : null}

              {serverInvites.length ? (
                <section className="friends-details-summary">
                  <header><strong>Convites de servidor</strong><i>{serverInvites.length}</i></header>
                  {serverInvites.slice(0, 2).map((invite) => (
                    <div className="friend-row" key={invite.id}>
                      <Avatar initials={initialsFrom(invite.serverName)} />
                      <div><strong>{invite.serverName}</strong><small>por @{invite.sender.username}</small></div>
                      <button type="button" onClick={() => void onAcceptServerInvite(invite)}>ENTRAR</button>
                    </div>
                  ))}
                  <button className="friends-details-viewall" type="button" onClick={() => onTabChange('pending')}>Ver todas</button>
                </section>
              ) : null}
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
