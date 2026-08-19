import { useEffect, useMemo, useRef, useState } from 'react'
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
  onCreateInviteLink: (options?: { expiresInHours?: number | null; maxUses?: number | null }) => Promise<Result & { url: string }>
  onOpenPeople: () => void
  onSearchProfiles: (term: string) => Promise<PersonSummary[]>
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

export function InviteFriendsDialog({ channelKind = 'text', channelName, friends, inviteLinks, members, onClose, onCreateInviteLink, onOpenPeople, onSearchProfiles, onSendServerInvite, server }: InviteFriendsDialogProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [states, setStates] = useState<Record<string, InviteState>>({})
  const [feedback, setFeedback] = useState('')
  const [createdUrl, setCreatedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)
  const [found, setFound] = useState<PersonSummary[]>([])
  const [searching, setSearching] = useState(false)
  const [expiresInHours, setExpiresInHours] = useState<number | null>(null)
  const [maxUses, setMaxUses] = useState<number | null>(null)

  const memberIds = useMemo(() => new Set(members.map((member) => member.id)), [members])
  const activeLink = inviteLinks[0]
  const inviteUrl = createdUrl || (activeLink ? linkFor(activeLink.code) : '')
  const canInvite = server.role === 'owner' || server.role === 'moderator'

  const visibleFriends = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^@/, '')
    if (!term) return friends
    return friends.filter((friend) => friend.nickname.toLowerCase().includes(term) || friend.username.toLowerCase().includes(term))
  }, [friends, search])

  useEffect(() => {
    const term = search.trim()
    if (term.length < 2) {
      setFound([])
      setSearching(false)
      return
    }
    let active = true
    setSearching(true)
    const timer = window.setTimeout(async () => {
      const results = await onSearchProfiles(term)
      if (!active) return
      setFound(results)
      setSearching(false)
    }, 320)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [onSearchProfiles, search])

  const invite = async (friend: PersonSummary) => {
    setStates((current) => ({ ...current, [friend.id]: 'sending' }))
    setFeedback('')
    const result = await onSendServerInvite(server.id, friend.username)
    setStates((current) => ({ ...current, [friend.id]: result.ok ? 'sent' : 'idle' }))
    setFeedback(result.message)
  }

  const friendIds = useMemo(() => new Set(friends.map((friend) => friend.id)), [friends])
  const outsiders = useMemo(() => found.filter((person) => !friendIds.has(person.id)), [found, friendIds])

  const renderPerson = (person: PersonSummary) => {
    const already = memberIds.has(person.id)
    const state = states[person.id] ?? 'idle'
    return (
      <div className="invite-friend-row" key={person.id}>
        <Avatar initials={initialsFrom(person.nickname)} url={person.avatarUrl} />
        <div><strong>{person.nickname}</strong><small>@{person.username}</small></div>
        {already
          ? <span className="invite-tag">JÁ É MEMBRO</span>
          : <button disabled={state !== 'idle' || !canInvite} type="button" onClick={() => void invite(person)}>
              {state === 'sending' ? 'ENVIANDO...' : state === 'sent' ? 'CONVIDADO' : 'CONVIDAR'}
            </button>}
      </div>
    )
  }

  const createLink = async () => {
    setCreating(true)
    setFeedback('')
    const result = await onCreateInviteLink({ expiresInHours, maxUses })
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
      description={channelName ? <>Quem aceitar chega direto em <strong>{channelKind === 'voice' ? '◖' : '#'} {channelName}</strong>.</> : 'Busque por apelido ou identificador: a pessoa não precisa ser sua amiga.'}
      eyebrow="CONVIDAR PARA O SERVIDOR"
      initialFocusRef={searchRef}
      onClose={onClose}
      title={<>Convidar{' '}<br />para {server.name}.</>}
    >
      <label className="invite-search">
        <span>Buscar pessoas</span>
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
        {visibleFriends.map((friend) => renderPerson(friend))}
      </section>

      {search.trim().length >= 2 ? (
        <section className="invite-friend-list" aria-label="Outras pessoas">
          <p>OUTRAS PESSOAS{searching ? ' — BUSCANDO...' : ''}</p>
          {outsiders.map((person) => renderPerson(person))}
          {!searching && outsiders.length === 0 ? <small>Ninguém novo com esse nome ou identificador.</small> : null}
        </section>
      ) : null}

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
        ) : canInvite ? (
          <>
            <div className="invite-link-options">
              <label>
                <span>Expira em</span>
                <select value={expiresInHours ?? ''} onChange={(event) => setExpiresInHours(event.target.value ? Number(event.target.value) : null)}>
                  <option value="">Nunca</option>
                  <option value="1">1 hora</option>
                  <option value="24">1 dia</option>
                  <option value="168">7 dias</option>
                </select>
              </label>
              <label>
                <span>Limite de usos</span>
                <select value={maxUses ?? ''} onChange={(event) => setMaxUses(event.target.value ? Number(event.target.value) : null)}>
                  <option value="">Sem limite</option>
                  <option value="1">1 pessoa</option>
                  <option value="5">5 pessoas</option>
                  <option value="25">25 pessoas</option>
                </select>
              </label>
            </div>
            <button className="dialog-submit subdued" disabled={creating} type="button" onClick={() => void createLink()}>{creating ? 'GERANDO...' : 'GERAR LINK DE CONVITE'}</button>
            <small>O link pede confirmação antes de entrar e pode ser revogado nas configurações.</small>
          </>
        ) : <small>Somente quem administra o servidor pode gerar links de convite.</small>}
      </section>

      {feedback ? <p className="dialog-feedback" role="status">{feedback}</p> : null}
    </Modal>
  )
}
