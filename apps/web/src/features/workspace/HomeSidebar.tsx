import type { FriendPresence, PersonSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { statusClass, statusLabel } from './presence'
import { SearchIcon } from './WorkspaceIcons'
import type { WorkspaceIdentity } from './workspace-types'

type HomeSidebarProps = {
  activeFriendId: string | null
  friends: PersonSummary[]
  identity: WorkspaceIdentity
  onOpenFriend: (friend: PersonSummary) => void
  onOpenProfile: () => void
  onOpenSearch: () => void
  onShowFriends: () => void
  onShowRequests: () => void
  pendingCount: number
  presenceByUser: Record<string, FriendPresence>
  view: 'friends' | 'requests'
}

const initialsFrom = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

export function HomeSidebar({ activeFriendId, friends, identity, onOpenFriend, onOpenProfile, onOpenSearch, onShowFriends, onShowRequests, pendingCount, presenceByUser, view }: HomeSidebarProps) {
  return (
    <aside className="home-sidebar" aria-label="Mensagens diretas">
      <div className="home-sidebar-search">
        <button type="button" onClick={onOpenSearch}><SearchIcon />Encontre ou comece uma conversa</button>
      </div>
      <nav className="home-sidebar-nav" aria-label="Seções de mensagens">
        <button aria-current={view === 'friends' && !activeFriendId} className={view === 'friends' && !activeFriendId ? 'active' : ''} type="button" onClick={onShowFriends}>
          <span aria-hidden="true">♧</span>Amigos
        </button>
        <button aria-current={view === 'requests'} className={view === 'requests' ? 'active' : ''} type="button" onClick={onShowRequests}>
          <span aria-hidden="true">✉</span>Solicitações
          {pendingCount ? <i className="channel-badge">{pendingCount}</i> : null}
        </button>
      </nav>
      <section className="home-sidebar-list" aria-label="Conversas">
        <p>MENSAGENS DIRETAS</p>
        {friends.map((friend) => (
          <button
            className={activeFriendId === friend.id ? 'home-dm active' : 'home-dm'}
            key={friend.id}
            type="button"
            onClick={() => onOpenFriend(friend)}
          >
            <span className={statusClass(presenceByUser[friend.id])}>
              <Avatar initials={initialsFrom(friend.nickname)} url={friend.avatarUrl} />
            </span>
            <div><strong>{friend.nickname}</strong><small>{statusLabel(presenceByUser[friend.id])}</small></div>
          </button>
        ))}
        {!friends.length ? <p className="home-sidebar-empty">Suas conversas aparecem aqui depois do primeiro amigo.</p> : null}
      </section>
      <footer className="identity-strip">
        <Avatar alt="Foto de perfil" initials={identity.initials} url={identity.avatarUrl} />
        <div><strong>{identity.nickname}</strong><small>@{identity.username}</small></div>
        <button aria-label="Abrir configurações" className="home-sidebar-settings" type="button" onClick={onOpenProfile}>⚙</button>
      </footer>
    </aside>
  )
}
