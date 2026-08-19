import { useMemo, useRef, useState } from 'react'
import type { PersonSummary, ServerMemberRole, ServerSummary } from '@concord/contracts'
import { Avatar } from '../../components/ui/Avatar'
import { Modal } from '../../components/ui/Modal'
import { initialsFrom } from './voice-participants'

type Result = { ok: boolean; message: string }

type InviteLink = {
  id: string
  code: string
  expires_at?: string | null
  uses_count: number
}

type InviteFriendsDialogProps = {
  channelKind?: 'text' | 'voice'
  channelName?: string | null
  friends: PersonSummary[]
  inviteLinks: InviteLink[]
  members: Array<PersonSummary & { role: ServerMemberRole }>
  onClose: () => void
  onCreateInviteLink: () => Promise<Result & { url: string }>
  onOpenPeople: () => void
  onSendServerInvite: (serverId: string, username: string) => Promise<Result>
  server: ServerSummary
}

type InviteState = 'idle' | 'sending' | 'sent'

const linkFor = (code: string) => `${window.location.origin}/?invite=${code}`

const expiryLabel = (expiresAt: string | null | undefined) => {
  if (!expiresAt) return 'Este link não expira.'
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000)
  if (days <= 0) return 'Este link já expirou. Gere um novo.'
  return days === 1 ? 'Este link expira amanhã.' : `Este link expira em ${days} dias.`
}

export function InviteFriendsDialog({ channelKind = 'text', channelName, friends, inviteLinks, members, onClose, onCreateInviteLink, onOpenPeople, onSendServerInvite, server }: InviteFriendsDialogProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [states, setStates] = useState<Record<string, InviteState>>({})
  const [feedback, setFeedback] = useState('')
  const [createdUrl, setCreatedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)

  const memberIds = useMemo(() => new Set(members.map((member) => member.id)), [members])
  const activeLink = inviteLinks[0]
  const inviteUrl = createdUrl || (activeLink ? linkFor(activeLink.code) : '')
  const owner = server.role === 'owner'

  const visibleFriends = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^@/, '')
    if (!term) return friends
    return friends.filter((friend) => friend.nickname.toLowerCase().includes(term) || friend.username.toLowerCase().includes(term))
  }, [friends, search])

  const invite = async (friend: PersonSummary) => {
    setStates((current) => ({ ...current, [friend.id]: 'sending' }))
    setFeedback('')
    const result = await onSendServerInvite(server.id, friend.username)
    setStates((current) => ({ ...current, [friend.id]: result.ok ? 'sent' : 'idle' }))
    setFeedback(result.message)
  }

  const createLink = async () => {
    setCreating(true)
    setFeedback('')
    const result = await onCreateInviteLink()
    setCreating(false)
    if (result.ok) setCreatedUrl(result.url)
    else setFeedback(result.message)
  }

  const copyLink = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch (caught) {
      console.error('[convite] falha ao copiar o link', caught)
      setFeedback('Copie o link manualmente: o navegador bloqueou a área de transferência.')
    }
  }

  return (
    <Modal
      className="invite-friends-dialog"
      closeLabel="Fechar convite de amigos"
      description={channelName ? <>Quem aceitar chega direto em <strong>{channelKind === 'voice' ? '◖' : '#'} {channelName}</strong>.</> : 'Convide alguém da sua lista de amigos para este servidor.'}
      eyebrow="CONVIDAR PARA O SERVIDOR"
      initialFocusRef={searchRef}
      onClose={onClose}
      title={<>Convidar{' '}<br />para {server.name}.</>}
    >
      <label className="invite-search">
        <span>Buscar amigos</span>
        <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou @identificador" type="search" />
      </label>

      <section className="invite-friend-list" aria-label="Amigos">
        <p>SEUS AMIGOS — {friends.length}</p>
        {friends.length === 0 ? (
          <div className="invite-empty">
            <p>Você ainda não tem amigos confirmados.</p>
            <button className="dialog-text-button" type="button" onClick={onOpenPeople}>ADICIONAR AMIGOS</button>
          </div>
        ) : null}
        {friends.length > 0 && visibleFriends.length === 0 ? <small>Nenhum amigo corresponde a essa busca.</small> : null}
        {visibleFriends.map((friend) => {
          const already = memberIds.has(friend.id)
          const state = states[friend.id] ?? 'idle'
          return (
            <div className="invite-friend-row" key={friend.id}>
              <Avatar initials={initialsFrom(friend.nickname)} />
              <div><strong>{friend.nickname}</strong><small>@{friend.username}</small></div>
              {already
                ? <span className="invite-tag">JÁ É MEMBRO</span>
                : <button disabled={state !== 'idle'} type="button" onClick={() => void invite(friend)}>
                    {state === 'sending' ? 'ENVIANDO...' : state === 'sent' ? 'CONVIDADO' : 'CONVIDAR'}
                  </button>}
            </div>
          )
        })}
      </section>

      <section className="invite-link-section" aria-label="Convite por link">
        <p>OU ENVIE UM LINK DO SERVIDOR</p>
        {inviteUrl ? (
          <>
            <div className="invite-link-row">
              <input aria-label="Link de convite" readOnly value={inviteUrl} onFocus={(event) => event.currentTarget.select()} />
              <button type="button" onClick={() => void copyLink()}>{copied ? 'COPIADO' : 'COPIAR'}</button>
            </div>
            <small>{expiryLabel(activeLink?.expires_at)}{activeLink ? ` · ${activeLink.uses_count} entradas por este link.` : ''}</small>
          </>
        ) : owner ? (
          <>
            <button className="dialog-submit subdued" disabled={creating} type="button" onClick={() => void createLink()}>{creating ? 'GERANDO...' : 'GERAR LINK DE CONVITE'}</button>
            <small>O link pede confirmação antes de entrar e pode ser revogado nas configurações.</small>
          </>
        ) : <small>Somente o proprietário do servidor pode gerar links de convite.</small>}
      </section>

      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
